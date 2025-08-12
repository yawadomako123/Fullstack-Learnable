import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../constants/Colors';

export default function TabLayout() {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  return (
    <SafeAreaView edges={['bottom']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.icon,
            tabBarStyle: {
              backgroundColor: colors.background,
              borderTopWidth: 0,
              elevation: 0,
              height: 60,
              paddingBottom: 8,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              marginTop: -4,
            },
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explore',
              tabBarIcon: ({ color, size }) => <Ionicons name="compass-outline" size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="career"
            options={{
              title: 'Career',
              tabBarIcon: ({ color, size }) => <Ionicons name="briefcase-outline" size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              title: 'Search',
              tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
            }}
          />
        </Tabs>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});