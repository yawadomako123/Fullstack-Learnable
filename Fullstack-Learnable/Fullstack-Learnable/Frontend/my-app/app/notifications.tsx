import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Notification = {
  id: string;
  title: string;
  date: string;
  message: string;
  isNew: boolean;
};

const NotificationScreen = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'previous'>('new');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Add expanded state for each notification
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});

  const newNotifications: Notification[] = [];

  // Updated, app-relevant notifications
  const previousNotifications: Notification[] = [
    {
      id: '1',
      title: 'Course Completed!',
      date: 'Jun 20, 2025',
      message: 'Congratulations! You have successfully completed the "React Native for Beginners" course. Check your profile to download your certificate.',
      isNew: false,
    },
    {
      id: '2',
      title: 'New Course Recommendation',
      date: 'Jun 18, 2025',
      message: 'Based on your interests, we recommend "Advanced JavaScript Concepts". Start learning today and boost your skills!',
      isNew: false,
    },
    {
      id: '3',
      title: 'Assignment Due Reminder',
      date: 'Jun 15, 2025',
      message: 'Don\'t forget! Your assignment for "UI/UX Design Basics" is due tomorrow. Submit your work to stay on track.',
      isNew: false,
    },
    {
      id: '4',
      title: 'Welcome to Learnova!',
      date: 'Jun 10, 2025',
      message: 'Welcome to Learnova, your personalized learning platform. Explore courses, track your progress, and achieve your goals!',
      isNew: false,
    },
  ];

  const handleEnableNotifications = () => {
    setNotificationsEnabled(true);
  };

  // Toggle expand/collapse for a notification
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'new' && styles.activeTab]}
          onPress={() => setActiveTab('new')}
        >
          <Text style={[styles.tabText, activeTab === 'new' && styles.activeTabText]}>
            New
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'previous' && styles.activeTab]}
          onPress={() => setActiveTab('previous')}
        >
          <Text style={[styles.tabText, activeTab === 'previous' && styles.activeTabText]}>
            Previously
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'new' && !notificationsEnabled && (
          <View style={styles.enableNotificationsContainer}>
            <Text style={styles.enableNotificationsTitle}>Get notified about important stuff</Text>
            <Text style={styles.enableNotificationsSubtitle}>
              We will notify you when
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletPoint}>• Your course progress updates</Text>
              <Text style={styles.bulletPoint}>• New course recommendations</Text>
              <Text style={styles.bulletPoint}>• Assignment deadlines</Text>
              <Text style={styles.bulletPoint}>• Special offers and announcements</Text>
            </View>
            <Text style={styles.settingsNote}>You can adjust these settings later.</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Later</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handleEnableNotifications}>
                <Text style={styles.primaryButtonText}>Get notified</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'new' && notificationsEnabled && newNotifications.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Customize your notifications!</Text>
            <Text style={styles.emptyStateText}>No notifications yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Your notification will appear here once you ve received them.
            </Text>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkText}>Missing notifications?</Text>
              <Text style={styles.linkAction}>Go to historical notifications.</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'previous' && (
          <View style={styles.previousNotifications}>
            <Text style={styles.sectionTitle}>Previously</Text>
            {previousNotifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={styles.notificationCard}
                onPress={() => toggleExpand(notification.id)}
                activeOpacity={0.8}
              >
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationDate}>{notification.date}</Text>
                </View>
                {expanded[notification.id] && (
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                )}
                <Text style={{ color: '#007AFF', marginTop: 6, fontSize: 13 }}>
                  {expanded[notification.id] ? 'Hide details ▲' : 'Show details ▼'}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkText}>Missing notifications?</Text>
              <Text style={styles.linkAction}>Go to historical notifications.</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#8e8e93',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  enableNotificationsContainer: {
    marginTop: 24,
  },
  enableNotificationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  enableNotificationsSubtitle: {
    fontSize: 16,
    marginBottom: 12,
    color: '#8e8e93',
  },
  bulletList: {
    marginLeft: 16,
    marginBottom: 24,
  },
  bulletPoint: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
  },
  settingsNote: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#eaeaea',
    padding: 16,
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  emptyState: {
    marginTop: 48,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8e8e93',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8e8e93',
    marginTop: 16,
    marginBottom: 8,
  },
  previousNotifications: {
    paddingBottom: 32,
  },
  notificationCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  notificationDate: {
    fontSize: 14,
    color: '#8e8e93',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
fontSize: 14,
    color: '#8e8e93',
  },
  linkAction: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
  },
});

export default NotificationScreen;
