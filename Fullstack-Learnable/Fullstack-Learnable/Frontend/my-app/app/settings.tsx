import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../contexts/AuthContext';
import { getThemeColors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';

const Settings = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const Colors = getThemeColors(isDarkMode);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignOut = () => {
    setShowSignOutModal(true);
  };

  const confirmSignOut = () => {
    setShowSignOutModal(false);
    logout();
    router.replace('/auth/login');
  };

  const themePreview = isDarkMode
    ? ['#23272f', '#333', '#fff']
    : ['#fff', '#e0e7ff', '#222'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}>
      {/* Back Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.icon} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.text }]}>Settings</Text>
      </View>

      {/* Appearance */}
      <Animated.View style={[styles.card, { opacity: fadeAnim, backgroundColor: Colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: Colors.text }]}>Appearance</Text>
        <View style={styles.row}>
          <Ionicons name="moon-outline" size={30} color={Colors.icon} />
          <Text style={[styles.rowText, { color: Colors.text }]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            thumbColor={isDarkMode ? Colors.primary : '#ccc'}
            trackColor={{ false: '#ccc', true: Colors.primarySoft }}
          />
        </View>
        <View style={styles.row}>
          <Ionicons name="sunny-outline" size={30} color={Colors.icon} />
          <Text style={[styles.rowText, { color: Colors.text }]}>Light Mode</Text>
        </View>
        <View style={styles.themePreviewRow}>
          {themePreview.map((color, i) => (
            <View key={i} style={[styles.themePreview, { backgroundColor: color }]} />
          ))}
        </View>
      </Animated.View>
      <View style={[styles.divider, { backgroundColor: Colors.border || '#e5e7eb' }]} />

      {/* Add your other cards here (Calendar, Downloads, Notifications, Language, Account, Support, Legal) */}

      {/* Modals */}
      <Modal
        visible={showSignOutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSignOutModal(false)}
      >
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: Colors.modalOverlay || 'rgba(0,0,0,0.3)' }]}
          onPress={() => setShowSignOutModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: Colors.surface }]}>
            <Text style={[styles.modalTitle, { color: Colors.text }]}>Sign Out?</Text>
            <Text style={[styles.modalDescription, { color: Colors.muted }]}>
              Are you sure you want to sign out?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowSignOutModal(false)} style={styles.modalBtn}>
                <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmSignOut} style={[styles.modalBtn, { marginLeft: 12 }]}>
                <Text style={{ color: 'red', fontWeight: 'bold' }}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: Colors.modalOverlay || 'rgba(0,0,0,0.3)' }]}
          onPress={() => setShowDeleteModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: Colors.surface }]}>
            <Text style={[styles.modalTitle, { color: Colors.text }]}>Delete Account?</Text>
            <Text style={[styles.modalDescription, { color: Colors.muted }]}>
              Are you sure you want to delete your account? This action cannot be undone.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)} style={styles.modalBtn}>
                <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)} style={[styles.modalBtn, { marginLeft: 12 }]}>
                <Text style={{ color: 'red', fontWeight: 'bold' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#00000010',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  divider: {
    height: 1,
    marginVertical: 10,
    borderRadius: 1,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rowText: {
    fontSize: 16,
    marginLeft: 10,
    flexShrink: 1,
  },
  themePreviewRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 5,
    gap: 8,
  },
  themePreview: {
    width: 32,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    padding: 28,
    width: 300,
    shadowColor: '#00000030',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#e0e7ff',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default Settings;
