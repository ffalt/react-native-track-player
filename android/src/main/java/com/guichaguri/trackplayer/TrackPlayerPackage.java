package com.guichaguri.trackplayer;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

import com.guichaguri.trackplayer.module.MusicModule;

/**
 * TrackPlayer Package that supports React Native New Architecture (TurboModule).
 */
public class TrackPlayerPackage extends BaseReactPackage {

    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactContext) {
        if (MusicModule.NAME.equals(name)) {
            return new MusicModule(reactContext);
        }
        return null;
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
            moduleInfos.put(
                MusicModule.NAME,
                new ReactModuleInfo(
                    MusicModule.NAME,       // name
                    MusicModule.NAME,       // className
                    false, // canOverrideExistingModule
                    false, // needsEagerInit
                    true, // hasConstants
                    false, // isCXXModule
                    true   // isTurboModule
                ));
            return moduleInfos;
        };
    }
}
