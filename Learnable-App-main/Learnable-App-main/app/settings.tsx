import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
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

const Settings = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  // Animation for section cards
  const fadeAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
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
    router.replace('/login');
  };

  // Theme preview colors
  const themePreview = darkMode
    ? ['#23272f', '#333', '#fff']
    : ['#fff', '#e0e7ff', '#222'];

  return (
    <ScrollView style={styles.container} accessible accessibilityLabel="Settings screen">
      {/* Appearance Section */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.row}>
          <Ionicons name="moon-outline" size={30} color="#333" accessibilityLabel="Dark mode icon" />
          <Text style={styles.rowText}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? "#6366F1" : "#ccc"}
            trackColor={{ false: "#ccc", true: "#a5b4fc" }}
            accessibilityLabel="Toggle dark mode"
          />
        </View>
        <View style={styles.row}>
          <Ionicons name="sunny-outline" size={30} color="#333" accessibilityLabel="Light mode icon" />
          <Text style={styles.rowText}>Light Mode</Text>
        </View>
        {/* Theme Preview */}
        <View style={styles.themePreviewRow} accessible accessibilityLabel="Theme preview">
          {themePreview.map((color, i) => (
            <View key={i} style={[styles.themePreview, { backgroundColor: color }]} />
          ))}
        </View>
      </Animated.View>
      <View style={styles.divider} />

      {/* Calendar Section */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Calendar</Text>
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={30} color="#333" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.rowTitle}>Sync to my calendar</Text>
            <Text style={styles.description}>
              Automatically sync all the deadlines and other related items to your calendar
            </Text>
          </View>
          <Switch thumbColor="#6366F1" trackColor={{ true: "#a5b4fc", false: "#ccc" }} />
        </View>
      </Animated.View>
      <View style={styles.divider} />

      {/* Downloads Section */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Downloads</Text>
        <View style={styles.item}>
          <Ionicons name="download-outline" size={30} color="#333" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.rowTitle}>Downloads</Text>
            <Text style={styles.description}>Manage all of your offline content</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Ionicons name="wifi-outline" size={30} color="#333" />
          <Text style={styles.rowText}>Download over Wi-Fi only</Text>
          <Switch thumbColor="#6366F1" trackColor={{ true: "#a5b4fc", false: "#ccc" }} />
        </View>
        <View style={styles.item}>
          <Ionicons name="square-outline" size={30} color="#333" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.rowTitle}>Video download quality</Text>
            <Text style={styles.description}>Always ask</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Ionicons name="folder-outline" size={30} color="#333" />
          <Text style={styles.rowText}>Download Location</Text>
        </View>
      </Animated.View>
      <View style={styles.divider} />

      {/* Push Notification Section */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Push Notification</Text>
        <View style={styles.row}>
          <Ionicons name="notifications-outline" size={30} color="#333" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.rowTitle}>Course-related</Text>
            <Text style={styles.description}>
              Receive notifications about course progress and activities
            </Text>
          </View>
          <Switch thumbColor="#6366F1" trackColor={{ true: "#a5b4fc", false: "#ccc" }} />
        </View>
        <View style={styles.row}>
          <Ionicons name="alarm-outline" size={30} color="#333" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.rowTitle}>Study reminders</Text>
            <Text style={styles.description}>
              Receive notifications that remind you to study at times for yourself
            </Text>
          </View>
          <Switch thumbColor="#6366F1" trackColor={{ true: "#a5b4fc", false: "#ccc" }} />
        </View>
        <View style={styles.row}>
          <Ionicons name="pricetag-outline" size={30} color="#333" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.rowTitle}>Promotions</Text>
            <Text style={styles.description}>Receive notifications on offers and promotions</Text>
          </View>
          <Switch thumbColor="#6366F1" trackColor={{ true: "#a5b4fc", false: "#ccc" }} />
        </View>
      </Animated.View>
      <View style={styles.divider} />

      {/* Language Section */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Language</Text>
        <View style={styles.row}>
          <Ionicons name="globe-outline" size={30} color="#333" />
          <Text style={styles.rowText}>Change Preferred Language</Text>
          <Ionicons name="open-outline" size={25} color="#333" style={{ marginLeft: 'auto' }} />
        </View>
      </Animated.View>
      <View style={styles.divider} />

      {/* Account Section */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.row}>
          <Ionicons name="person-outline" size={30} color="#333" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.rowTitle}>Hello! {user?.name}</Text>
            <Text style={styles.description}>Signed in as {user?.email}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.row}
          onPress={handleSignOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={30} color="#333" />
          <Text style={styles.rowText}>Sign Out</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <Ionicons name="mail-outline" size={30} color="#333" />
          <Text style={styles.rowText}>Add a Recovery Email</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="receipt-outline" size={30} color="#333" />
          <Text style={styles.rowText}>My subscriptions</Text>
        </View>
        <View style={styles.row}>
          <FontAwesome name="google" size={30} color="#DB4437" />
          <Text style={styles.rowText}>Unlink Google Account</Text>
        </View>
      </Animated.View>
      <View style={styles.divider} />

      {/* Support Section */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.row}>
          <Ionicons name="help-circle-outline" size={30} color="#000" />
          <Text style={styles.rowText}>Learner Help Center</Text>
        </View>
      </Animated.View>
      <View style={styles.divider} />

      {/* Legal Section */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <View style={styles.row}>
          <Ionicons name="document-outline" size={30} color="#000" />
          <Text style={styles.rowText}>Terms</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="document-lock-outline" size={30} color="#000" />
          <Text style={styles.rowText}>Privacy Policy</Text>
        </View>
      </Animated.View>
      <View style={styles.divider} />

      {/* Delete Account with confirmation modal */}
      <View style={[styles.row, { justifyContent: 'flex-start', paddingVertical: 10 }]}>
        <Ionicons name="trash-outline" size={30} color="#000" />
        <TouchableOpacity
          onPress={() => setShowDeleteModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Delete Account"
        >
          <Text style={[styles.rowText, { color: 'red', marginLeft: 10 }]}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowDeleteModal(false)}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Delete Account?</Text>
            <Text style={{ color: '#666', marginBottom: 16 }}>
              Are you sure you want to delete your account? This action cannot be undone.
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)} style={styles.modalBtn}>
                <Text style={{ color: '#6366F1', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowDeleteModal(false);
                  // Add your delete logic here
                }}
                style={[styles.modalBtn, { marginLeft: 12 }]}
              >
                <Text style={{ color: 'red', fontWeight: 'bold' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Sign Out confirmation modal */}
      <Modal
        visible={showSignOutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSignOutModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowSignOutModal(false)}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Sign Out?</Text>
            <Text style={{ color: '#666', marginBottom: 16 }}>
              Are you sure you want to sign out?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setShowSignOutModal(false)} style={styles.modalBtn}>
                <Text style={{ color: '#6366F1', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmSignOut}
                style={[styles.modalBtn, { marginLeft: 12 }]}
              >
                <Text style={{ color: 'red', fontWeight: 'bold' }}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Version & Credits */}
      <View style={{ marginVertical: 20, alignItems: 'center' }}>
        <Text style={{ color: '#666' }}>
          Learnova v1.0{'\n'}
          <Text style={{ fontWeight: 'bold' }}>Mobile Dev G48 ©2025</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    paddingHorizontal: 10,
    paddingTop: 60,
  },
  card: {
    backgroundColor: '#fff',
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
    backgroundColor: '#e5e7eb',
    marginVertical: 10,
    borderRadius: 1,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rowText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flexShrink: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
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
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
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
});

export default Settings;