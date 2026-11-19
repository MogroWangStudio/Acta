package com.mws.acta;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * 应用内更新（Android 原生实现）：
 * 检查 GitHub Release 的安卓更新包 → 下载到应用外部缓存目录（带进度事件）→
 * 解压出 apk → 通过 FileProvider 拉起系统安装器（未授予「安装未知应用」权限
 * 时先跳转授权）。Release 资产统一为压缩包 `Acta-<版本>-android-arm64.zip`
 * （包内单个 Acta.apk），本插件按压缩包名识别、下载后解出 apk 再安装；
 * 桌面端更新走
 * Tauri 自身机制，与本插件互不影响。
 */
@CapacitorPlugin(name = "ActaUpdater")
public class ActaUpdaterPlugin extends Plugin {

    /** 列表端点：latest 永远只给正式版，测试通道拿不到 beta 预发布。 */
    private static final String RELEASES_LIST_API = "https://api.github.com/repos/MogroWangStudio/Acta/releases?per_page=15";
    private static final int CONNECT_TIMEOUT_MS = 10000;
    private static final int READ_TIMEOUT_MS = 30000;
    private static final long PROGRESS_STEP_BYTES = 262144L;
    private static final int NOTES_MAX_CHARS = 600;

    private String currentVersionName() {
        try {
            Context context = getContext();
            return context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionName;
        } catch (Exception error) {
            return "";
        }
    }

    /** 从 "v3.4.0" / "3.4.0" / "Acta v3.4.0 …" 中提取前三段数字。 */
    private static int[] parseVersion(String value) {
        int[] parts = new int[]{0, 0, 0};
        if (value == null) return parts;
        int index = 0;
        int start = -1;
        for (int i = 0; i <= value.length() && index < 3; i++) {
            char current = i < value.length() ? value.charAt(i) : '.';
            boolean digit = current >= '0' && current <= '9';
            if (digit && start < 0) start = i;
            if (!digit && start >= 0) {
                try {
                    parts[index] = Integer.parseInt(value.substring(start, i));
                } catch (NumberFormatException ignored) {
                }
                index++;
                start = -1;
            }
        }
        return parts;
    }

    private static String versionString(String value) {
        String trimmed = value == null ? "" : value.trim();
        if (trimmed.startsWith("v") || trimmed.startsWith("V")) trimmed = trimmed.substring(1);
        int plus = trimmed.indexOf('+');
        if (plus >= 0) trimmed = trimmed.substring(0, plus);
        return trimmed;
    }

    /** 预发布段（"4.3.0-beta10" → "beta10"），无预发布为空串。 */
    private static String preReleaseOf(String value) {
        String trimmed = versionString(value).toLowerCase();
        int dash = trimmed.indexOf('-');
        return dash < 0 ? "" : trimmed.substring(dash + 1);
    }

    /** 预发布段 token 化：beta10 → [beta, 10]，beta.2 → [beta, 2]。 */
    private static java.util.List<String> preTokens(String pre) {
        java.util.List<String> tokens = new java.util.ArrayList<>();
        if (pre == null || pre.isEmpty()) return tokens;
        for (String part : pre.split("[.-]")) {
            if (part.isEmpty()) continue;
            java.util.regex.Matcher inner = java.util.regex.Pattern.compile("\\d+|\\D+").matcher(part);
            while (inner.find()) tokens.add(inner.group());
        }
        return tokens;
    }

    private static int comparePreToken(String a, String b) {
        boolean numericA = a.matches("\\d+");
        boolean numericB = b.matches("\\d+");
        if (numericA && numericB) return Integer.compare(Integer.parseInt(a), Integer.parseInt(b));
        // semver：数字段小于同位置的非数字段（1 < alpha）。
        if (numericA) return -1;
        if (numericB) return 1;
        return a.compareTo(b);
    }

    /** semver 比较：>0 表示 remote 比 local 新；同版本号时正式版大于预发布。 */
    private static int compareVersions(String remote, String local) {
        int[] remoteParts = parseVersion(remote);
        int[] localParts = parseVersion(local);
        for (int i = 0; i < 3; i++) {
            if (remoteParts[i] != localParts[i]) return Integer.compare(remoteParts[i], localParts[i]);
        }
        String remotePre = preReleaseOf(remote);
        String localPre = preReleaseOf(local);
        if (remotePre.isEmpty() && localPre.isEmpty()) return 0;
        if (remotePre.isEmpty()) return 1;
        if (localPre.isEmpty()) return -1;
        java.util.List<String> remoteTokens = preTokens(remotePre);
        java.util.List<String> localTokens = preTokens(localPre);
        for (int i = 0; i < Math.min(remoteTokens.size(), localTokens.size()); i++) {
            int difference = comparePreToken(remoteTokens.get(i), localTokens.get(i));
            if (difference != 0) return difference;
        }
        return Integer.compare(remoteTokens.size(), localTokens.size());
    }

    private static boolean isNewer(String remote, String local) {
        return compareVersions(remote, local) > 0;
    }

    private static String sanitizeFileName(String value) {
        return (value == null ? "" : value.replaceAll("[^A-Za-z0-9.\\-]", "")).trim();
    }

    private static String readStream(InputStream input) throws Exception {
        if (input == null) return "";
        StringBuilder builder = new StringBuilder();
        byte[] buffer = new byte[8192];
        int read;
        try (InputStream stream = input) {
            while ((read = stream.read(buffer)) != -1) {
                builder.append(new String(buffer, 0, read, StandardCharsets.UTF_8));
            }
        }
        return builder.toString();
    }

    /** 找出该 Release 里可用的安卓更新包（Acta-<版本>-android-<架构>.zip）。 */
    private static JSONObject androidAssetOf(JSONObject release) {
        JSONArray assets = release == null ? null : release.optJSONArray("assets");
        if (assets == null) return null;
        for (int i = 0; i < assets.length(); i++) {
            JSONObject asset = assets.optJSONObject(i);
            String name = asset == null ? "" : asset.optString("name", "");
            if (name.matches("Acta-.*-android-.*\\.zip")) return asset;
        }
        return null;
    }

    @PluginMethod
    public void checkUpdate(PluginCall call) {
        final String localVersion = currentVersionName();
        final boolean betaChannel = "beta".equalsIgnoreCase(call.getString("channel", "stable"));
        Thread worker = new Thread(() -> {
            try {
                HttpURLConnection connection = (HttpURLConnection) new URL(RELEASES_LIST_API).openConnection();
                connection.setConnectTimeout(CONNECT_TIMEOUT_MS);
                connection.setReadTimeout(READ_TIMEOUT_MS);
                connection.setRequestProperty("Accept", "application/vnd.github+json");
                int status = connection.getResponseCode();
                String body = status >= 400 ? "" : readStream(connection.getInputStream());
                connection.disconnect();
                JSObject result = new JSObject();
                if (status == 404) {
                    result.put("available", false);
                    result.put("reason", "noRelease");
                    call.resolve(result);
                    return;
                }
                if (status != 200) {
                    call.reject("检查更新失败：HTTP " + status);
                    return;
                }
                JSONArray releases = new JSONArray(body);
                // 通道过滤 + 按 semver 取最大者：列表按发布时间排序，取首个会
                // 把补发/先发的低版本当成最新（beta9 抢在 beta10 前面）。
                JSONObject release = null;
                String remoteVersion = "";
                for (int i = 0; i < releases.length(); i++) {
                    JSONObject candidate = releases.optJSONObject(i);
                    if (candidate == null) continue;
                    String version = versionString(candidate.optString("tag_name", ""));
                    if (version.isEmpty()) continue;
                    boolean prerelease = candidate.optBoolean("prerelease", false) || version.contains("-");
                    if (!betaChannel && prerelease) continue;
                    if (androidAssetOf(candidate) == null) continue;
                    if (!isNewer(version, localVersion)) continue;
                    if (release == null || compareVersions(version, remoteVersion) > 0) {
                        release = candidate;
                        remoteVersion = version;
                    }
                }
                if (release == null) {
                    result.put("available", false);
                    call.resolve(result);
                    return;
                }
                JSONObject asset = androidAssetOf(release);
                String downloadUrl = asset.optString("browser_download_url", "");
                if (downloadUrl.isEmpty()) {
                    result.put("available", false);
                    result.put("reason", "noAndroidAsset");
                    result.put("version", remoteVersion);
                    call.resolve(result);
                    return;
                }
                result.put("available", true);
                result.put("version", remoteVersion);
                result.put("url", downloadUrl);
                result.put("name", asset.optString("name", ""));
                result.put("size", asset.optLong("size", 0));
                result.put("htmlUrl", release.optString("html_url", ""));
                String notes = release.optString("body", "");
                if (notes.length() > NOTES_MAX_CHARS) notes = notes.substring(0, NOTES_MAX_CHARS);
                result.put("notes", notes);
                call.resolve(result);
            } catch (Exception error) {
                call.reject("检查更新失败：" + error.getMessage());
            }
        }, "acta-updater-check");
        worker.setDaemon(true);
        worker.start();
    }

    @PluginMethod
    public void downloadUpdate(final PluginCall call) {
        final String url = call.getString("url", "");
        final String version = sanitizeFileName(call.getString("version", ""));
        final long expectedSize = (long) call.getInt("size", 0);
        if (!url.startsWith("https://github.com/") && !url.startsWith("https://api.github.com/")) {
            call.reject("更新包地址无效");
            return;
        }
        final Context context = getContext();
        Thread worker = new Thread(() -> {
            try {
                File updatesDir = new File(context.getExternalFilesDir(null), "updates");
                File target = new File(updatesDir, "Acta-" + version + "-android.zip");
                // 已有完整压缩包直接复用，避免重复下载
                if (expectedSize > 0 && target.exists() && target.length() == expectedSize) {
                    resolveDownloaded(call, extractApkFromZip(target, updatesDir, version));
                    return;
                }
                updatesDir.mkdirs();
                File part = new File(updatesDir, target.getName() + ".part");
                HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
                connection.setConnectTimeout(CONNECT_TIMEOUT_MS);
                connection.setReadTimeout(READ_TIMEOUT_MS);
                connection.setInstanceFollowRedirects(true);
                int status = connection.getResponseCode();
                if (status != 200) {
                    connection.disconnect();
                    call.reject("下载更新失败：HTTP " + status);
                    return;
                }
                long total = connection.getContentLength();
                try (InputStream input = connection.getInputStream();
                     FileOutputStream output = new FileOutputStream(part)) {
                    byte[] buffer = new byte[65536];
                    long received = 0;
                    long lastNotified = 0;
                    int read;
                    while ((read = input.read(buffer)) != -1) {
                        output.write(buffer, 0, read);
                        received += read;
                        if (received - lastNotified >= PROGRESS_STEP_BYTES) {
                            notifyProgress(received, total);
                            lastNotified = received;
                        }
                    }
                    output.getFD().sync();
                }
                connection.disconnect();
                if (total > 0 && part.length() != total) {
                    part.delete();
                    call.reject("下载不完整，请重试");
                    return;
                }
                if (target.exists()) target.delete();
                if (!part.renameTo(target)) {
                    call.reject("无法保存更新包");
                    return;
                }
                notifyProgress(target.length(), target.length());
                // 解压出 apk 再交给安装流程；压缩包完成使命后删除。
                File apk = extractApkFromZip(target, updatesDir, version);
                target.delete();
                resolveDownloaded(call, apk);
            } catch (Exception error) {
                call.reject("下载更新失败：" + error.getMessage());
            }
        }, "acta-updater-download");
        worker.setDaemon(true);
        worker.start();
    }

    /** 从更新压缩包里解出唯一的 apk（Release 资产固定一个 zip 装一个 Acta.apk）。 */
    private static File extractApkFromZip(File zipFile, File updatesDir, String version) throws Exception {
        File apkFile = new File(updatesDir, "Acta-" + version + "-android.apk");
        File extracted = null;
        try (ZipInputStream zip = new ZipInputStream(new BufferedInputStream(new FileInputStream(zipFile)))) {
            ZipEntry entry;
            while ((entry = zip.getNextEntry()) != null) {
                if (entry.isDirectory()) continue;
                String name = new File(entry.getName()).getName();
                if (!name.toLowerCase().endsWith(".apk")) continue;
                if (extracted != null) throw new IllegalStateException("更新压缩包里有多个 apk");
                try (FileOutputStream output = new FileOutputStream(apkFile)) {
                    byte[] buffer = new byte[65536];
                    int read;
                    while ((read = zip.read(buffer)) != -1) output.write(buffer, 0, read);
                    output.getFD().sync();
                }
                extracted = apkFile;
            }
        }
        if (extracted == null) throw new IllegalStateException("更新压缩包里没有 apk");
        return extracted;
    }

    private void resolveDownloaded(PluginCall call, File file) {
        JSObject result = new JSObject();
        result.put("filePath", file.getAbsolutePath());
        result.put("size", file.length());
        call.resolve(result);
    }

    private void notifyProgress(long received, long total) {
        JSObject payload = new JSObject();
        payload.put("received", received);
        payload.put("total", Math.max(total, 0));
        notifyListeners("updaterProgress", payload);
    }

    @PluginMethod
    public void installUpdate(PluginCall call) {
        String filePath = call.getString("filePath", "");
        File file = filePath.isEmpty() ? null : new File(filePath);
        if (file == null || !file.exists() || file.length() == 0) {
            call.reject("更新包不存在，请重新下载");
            return;
        }
        Context context = getContext();
        // Android 8+：未授予「安装未知应用」时先跳转系统授权页，授权后由前端重试
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            && !context.getPackageManager().canRequestPackageInstalls()) {
            try {
                Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                    Uri.parse("package:" + context.getPackageName()));
                Activity activity = getActivity();
                if (activity != null) activity.startActivity(intent);
                else {
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(intent);
                }
            } catch (Exception error) {
                call.reject("无法打开安装权限设置：" + error.getMessage());
                return;
            }
            JSObject result = new JSObject();
            result.put("needsPermission", true);
            call.resolve(result);
            return;
        }
        try {
            Uri uri = FileProvider.getUriForFile(context, context.getPackageName() + ".fileprovider", file);
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(uri, "application/vnd.android.package-archive");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            Activity activity = getActivity();
            if (activity != null) activity.startActivity(intent);
            else context.startActivity(intent);
            JSObject result = new JSObject();
            result.put("started", true);
            call.resolve(result);
        } catch (Exception error) {
            call.reject("无法打开安装程序：" + error.getMessage());
        }
    }
}
