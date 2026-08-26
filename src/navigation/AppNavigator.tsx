import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { ReleaseScreen } from '../screens/ReleaseScreen';
import { QuickResetScreen } from '../screens/QuickResetScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { AboutScreen } from '../screens/AboutScreen';

export type RootStackParamList = {
  Home: undefined;
  Release: undefined;
  QuickReset: undefined;
  History: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        animationDuration: 250,
        gestureEnabled: false,
        contentStyle: {},
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          gestureEnabled: true,
          animation: 'fade',
        }}
      />
      <Stack.Screen name="Release" component={ReleaseScreen} />
      <Stack.Screen
        name="QuickReset"
        component={QuickResetScreen}
        options={{ animation: 'slide_from_bottom', gestureEnabled: true }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ animation: 'slide_from_bottom', gestureEnabled: true }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ animation: 'slide_from_bottom', gestureEnabled: true }}
      />
    </Stack.Navigator>
  );
}
