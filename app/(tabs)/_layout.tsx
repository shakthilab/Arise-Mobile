import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, palette } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: palette.electricBlue,
        tabBarInactiveTintColor: '#52525B',
        tabBarStyle: {
          backgroundColor: '#050506',
          borderTopColor: '#18181C',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamilies.bold,
          fontSize: 9,
          letterSpacing: 1.5,
          marginTop: 2,
        },
        tabBarIcon: ({ color, focused }) => {
          if (route.name === 'index') {
            return (
              <View style={styles.iconWrap}>
                <Ionicons name={focused ? 'grid' : 'grid-outline'} size={20} color={color} />
                {focused && <View style={styles.activeGlow} />}
              </View>
            );
          }
          if (route.name === 'leaderboard') {
            return (
              <View style={styles.iconWrap}>
                <MaterialCommunityIcons name="dumbbell" size={22} color={color} />
                {focused && <View style={styles.activeGlow} />}
              </View>
            );
          }
          if (route.name === 'achievements') {
            return (
              <View style={styles.iconWrap}>
                <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={20} color={color} />
                {focused && <View style={styles.activeGlow} />}
              </View>
            );
          }
          if (route.name === 'profile') {
            return (
              <View style={styles.iconWrap}>
                <Ionicons name={focused ? 'person' : 'person-outline'} size={20} color={color} />
                {focused && <View style={styles.activeGlow} />}
              </View>
            );
          }
          return <Feather name="circle" size={20} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'DASHBOARD' }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'WORKOUTS' }} />
      <Tabs.Screen name="achievements" options={{ title: 'METRICS' }} />
      <Tabs.Screen name="profile" options={{ title: 'PROFILE' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeGlow: {
    position: 'absolute',
    bottom: -5,
    width: 18,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: palette.electricBlue,
    shadowColor: palette.electricBlue,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
});
