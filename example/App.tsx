import React, { useEffect } from "react";
import { setupIfNecessary } from "./src/setup";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { QueueScreen } from "./src/QueueScreen";
import { PlayerScreen } from "./src/PlayerScreen";
import { DemoTracksScreen } from "./src/DemoTracksScreen";
import { DownloadsScreen } from "./src/DownloadsScreen";
import { CurrentDownloadsScreen } from "./src/CurrentDownloadsScreen";
import { demoStyles } from "./src/utils";

const Tab = createBottomTabNavigator();

function App(): JSX.Element {
  useEffect(() => {
    setupIfNecessary().catch(console.error);
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarIconStyle: demoStyles.tabBarIconStyle,
          tabBarLabelStyle: demoStyles.tabBarLabelStyle
        }}>
        <Tab.Screen name="Demo Tracks" component={DemoTracksScreen} />
        <Tab.Screen name="Player" component={PlayerScreen} />
        <Tab.Screen name="Queue" component={QueueScreen} />
        <Tab.Screen
          name="Current Downloads"
          component={CurrentDownloadsScreen}
        />
        <Tab.Screen name="All Downloads" component={DownloadsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
