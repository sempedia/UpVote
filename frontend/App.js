// App.js
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "./src/styles/globalStyles";

// Import screens
import FeatureListScreen from "./src/screens/FeatureListScreen";
import FeatureDetailScreen from "./src/screens/FeatureDetailScreen";
import NewFeatureScreen from "./src/screens/NewFeatureScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="FeatureList"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 18,
          },
          headerBackTitleVisible: false,
          cardStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="FeatureList"
          component={FeatureListScreen}
          options={{
            title: "UpVote",
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="FeatureDetail"
          component={FeatureDetailScreen}
          options={({ route }) => ({
            title: route.params?.feature?.title || "Feature Details",
            headerTitleStyle: {
              fontWeight: "600",
              fontSize: 16,
            },
          })}
        />
        <Stack.Screen
          name="NewFeature"
          component={NewFeatureScreen}
          options={{
            title: "New Feature",
            presentation: "modal",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
