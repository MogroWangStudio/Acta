package com.mws.acta;

import android.app.Activity;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.view.Window;
import android.window.BackEvent;
import android.window.OnBackAnimationCallback;
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
    private float lastBackProgress = -1f;

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
    // 开启时注册系统级回调：API 34+ 用 OnBackAnimationCallback（继承
    // OnBackInvokedCallback），手势过程中持续回报进度并桥接进 WebView，
    // 由页面驱动最上层界面的预见式动画——普通回调在手势全程没有任何
    // 动画，提交后界面层瞬间关闭，看起来就像功能不存在（这正是此前
    // 适配无效的原因）；API 33 只有提交回调。提交后把返回事件转发给
    // WebView 内的统一处理函数（window.__actaHandleBackButton，与
    // backButton 事件共用一套层级逻辑）。本 callback 晚于 Capacitor
    // App 插件的 Jetpack 桥接注册，系统在同优先级内按注册逆序分派，
    // 不会双触发；关闭时反注册，返回事件回到 App 插件的 backButton
    // 通道，行为与适配前一致。
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
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            // OnBackAnimationCallback 是 API 34 新增接口：匿名实现只在
            // API 34+ 分支创建，API 33 的运行时不会加载这个类。
            predictiveBackCallback = new OnBackAnimationCallback() {
                @Override
                public void onBackStarted(BackEvent event) {
                    lastBackProgress = 0f;
                    evaluateBackGesture("window.__actaBackGesture&&window.__actaBackGesture('start')");
                }

                @Override
                public void onBackProgressed(BackEvent event) {
                    float rounded = Math.round(event.getProgress() * 100f) / 100f;
                    if (rounded == lastBackProgress) return;
                    lastBackProgress = rounded;
                    evaluateBackGesture("window.__actaBackGesture&&window.__actaBackGesture('progress'," + rounded + ")");
                }

                @Override
                public void onBackCancelled() {
                    lastBackProgress = -1f;
                    evaluateBackGesture("window.__actaBackGesture&&window.__actaBackGesture('cancel')");
                }

                @Override
                public void onBackInvoked() {
                    lastBackProgress = -1f;
                    // 先复位手势动画再执行返回动作：同一次 JS 求值内完成，
                    // 复位与层级关闭落在同一帧，不会闪跳。
                    evaluateBackGesture("window.__actaBackGesture&&window.__actaBackGesture('commit');window.__actaHandleBackButton&&window.__actaHandleBackButton()");
                }
            };
        } else {
            // forOnBackInvoked 静态工厂是 API 34 新增：为兼容 compileSdk 下
            // API 33 的运行时，这里用接口的匿名实现（onBackInvoked 在提交时触发）。
            predictiveBackCallback = new OnBackInvokedCallback() {
                @Override
                public void onBackInvoked() {
                    evaluateBackGesture("window.__actaHandleBackButton&&window.__actaHandleBackButton()");
                }
            };
        }
        dispatcher.registerOnBackInvokedCallback(
            OnBackInvokedDispatcher.PRIORITY_DEFAULT, predictiveBackCallback);
    }

    private void evaluateBackGesture(String script) {
        runOnUiThread(() -> getBridge().getWebView().evaluateJavascript(script, null));
    }

    private void applySavedSystemBars() {
        SharedPreferences preferences = getSharedPreferences(SYSTEM_BAR_PREFERENCES, 0);
        int color = preferences.getInt(SYSTEM_BAR_COLOR, Color.parseColor("#E7E7E3"));
        applySystemBars(this, color);
    }

    public static void applySystemBars(Activity activity, int background) {
        Window window = activity.getWindow();
        // Edge-to-edge：WebView 全幅延伸到系统栏下方，状态栏 / 导航栏透明，
        // 状态栏区域成为页面的一部分，由页面统一处理——顶栏 / 底栏 / 弹窗
        // 已按 env(safe-area-inset-*) 预留安全区内边距，弹窗遮罩打开时会盖
        // 到状态栏、随之一起变暗。background 只作窗口兜底底色与图标明暗
        // 依据，不再作为系统栏的固定色。
        WindowCompat.setDecorFitsSystemWindows(window, false);
        window.setStatusBarColor(Color.TRANSPARENT);
        window.setNavigationBarColor(Color.TRANSPARENT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.setStatusBarContrastEnforced(false);
            window.setNavigationBarContrastEnforced(false);
        }
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
