// components/BottomNavBar.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  activeTab: 'home' | 'search' | 'profile';
};

const BottomNavBar: React.FC<Props> = ({ activeTab }) => {
  const router = useRouter();

  const tabs = [
    { id: 'home', label: 'Home', icon: 'home-outline', route: '/interface' },
    { id: 'search', label: 'Explore', icon: 'search-outline', route: '/explore' },
    { id: 'profile', label: 'Profile', icon: 'person-outline', route: '/profile' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => router.push(tab.route)}
          >
            <Ionicons
              name={tab.icon as any}
              size={24}
              color={isActive ? '#007AFF' : '#666'}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeLabel: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default BottomNavBar;
