import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons name="home-sharp" size={20} color={focused ? '#FFFFFF' : '#71717A'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Battles',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <MaterialCommunityIcons name="sword-cross" size={22} color={focused ? '#FFFFFF' : '#71717A'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <MaterialCommunityIcons name="package-variant-closed" size={22} color={focused ? '#FFFFFF' : '#71717A'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons name="person-outline" size={20} color={focused ? '#FFFFFF' : '#71717A'} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#09090B',
    borderTopColor: '#18181B',
    borderTopWidth: 1,
    height: 64,
    paddingTop: 8,
    paddingBottom: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    backgroundColor: '#141418',
    borderWidth: 1,
    borderColor: '#3F3F46',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
});
