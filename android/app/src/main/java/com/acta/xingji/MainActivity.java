package com.mws.acta;

import android.app.Activity;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.view.Window;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    public static final String SYSTEM_BAR_PREFERENCES = "acta.system.bar.preferences";
    public static final String SYSTEM_BAR_COLOR = "color";
    public static final String PREDICTIVE_BACK = "predictive_back";

    private OnBackInvokedCallback predictiveBackCallback;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ActaSyncPlugin.class);
        registerPlugin(ActaLanPlugin.class);
        registerPlugin(ActaUpdaterPlugin.class);
        super.onCreate(savedInstanceState);
        getBridge().getWebView().setWebChromeClient(new ActaWebChromeClient(getBridge()));
        applySavedSystemBars();
        applyPredictiveBack(null);
    }

    @Override
    public void onResume() {
        super.onResume();
        applySavedSystemBars();
        applyPredictiveBack(null);
    }

    // —— 预见式返回（Android 13+）——
    // 开启时注册系统级 OnBackInvokedCallback：边缘滑动手势出现系统预览
    // 动画、中途可取消，提交后把返回事件转发给 WebView 内的统一处理函数
    // （window.__actaHandleBackButton，与 backButton 事件共用一套层级逻辑）。
    // 本 callback 晚于 Capacitor App 插件的 Jetpack 桥接注册，系统按
    // 「最近注册的最高优先级回调」分派，不会双触发；关闭时反注册，返回
    // 事件回到 App 插件的 backButton 通道，行为与适配前一致。
    public void applyPredictiveBack(Boolean enabledOverride) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return;
        SharedPreferences preferences = getSharedPreferences(SYSTEM_BAR_PREFERENCES, 0);
        boolean enabled = enabledOverride != null
            ? enabledOverride
            : preferences.getBoolean(PREDICTIVE_BACK, true);
        if (enabledOverride != null) {
            preferences.edit().putBoolean(PREDICTIVE_BACK, enabledOverride).apply();
        }
        OnBackInvokedDispatcher dispatcher = getOnBackInvokedDispatcher();
        if (predictiveBackCallback != null) {
            dispatcher.unregisterOnBackInvokedCallback(predictiveBackCallback);
            predictiveBackCallback = null;
        }
        if (!enabled) return;
        // forOnBackInvoked 静态工厂是 API 34 新增：为兼容 compileSdk 下
        // API 33 的运行时，这里用接口的匿名实现（onBackInvoked 在提交时触发）。
        predictiveBackCallback = new OnBackInvokedCallback() {
            @Override
            public void onBackInvoked() {
                runOnUiThread(() -> getBridge().getWebView().evaluateJavascript(
                    "window.__actaHandleBackButton && window.__actaHandleBackButton();", null));
            }
        };
        dispatcher.registerOnBackInvokedCallback(
            OnBackInvokedDispatcher.PRIORITY_DEFAULT, predictiveBackCallback);
    }

    private void applySavedSystemBars() {
        SharedPreferences preferences = getSharedPreferences(SYSTEM_BAR_PREFERENCES, 0);
        int color = preferences.getInt(SYSTEM_BAR_COLOR, Color.parseColor("#E7E7E3"));
        applySystemBars(this, color);
    }

    public static void applySystemBars(Activity activity, int background) {
        Window window = activity.getWindow();
        window.setStatusBarColor(background);
        window.setNavigationBarColor(background);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.setStatusBarContrastEnforced(false);
            window.setNavigationBarContrastEnforced(false);
        }
        WindowCompat.setDecorFitsSystemWindows(window, true);
        // Android 15+ enforces edge-to-edge and ignores setStatusBarColor /
        // setNavigationBarColor, so the strips behind the transparent system bars
        // show the window background instead. Keep it in sync with the theme color.
        window.setBackgroundDrawable(new ColorDrawable(background));
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
        boolean darkIcons = relativeLuminance(background) >= .42;
        controller.setAppearanceLightStatusBars(darkIcons);
        controller.setAppearanceLightNavigationBars(darkIcons);
    }

    private static double relativeLuminance(int color) {
        double red = linearChannel(Color.red(color) / 255.0);
        double green = linearChannel(Color.green(color) / 255.0);
        double blue = linearChannel(Color.blue(color) / 255.0);
        return red * .2126 + green * .7152 + blue * .0722;
    }

    private static double linearChannel(double channel) {
        return channel <= .04045 ? channel / 12.92 : Math.pow((channel + .055) / 1.055, 2.4);
    }
}
