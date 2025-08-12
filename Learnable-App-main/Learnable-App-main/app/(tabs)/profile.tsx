import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

const lightTheme = {
  background: '#FDF6F0',
  card: '#FFFFFF',
  primary: '#6366F1',
  accent: '#F97316',
  text: '#1F2937',
  muted: '#6B7280',
  border: '#E5E7EB',
  tag: '#DBEAFE',
};

const progressData = {
  completedCourses: 5,
  inProgressCourses: 2,
  recentCourses: ['Web Development', 'UI/UX Design', 'Python Programming'],
  skills: ['JavaScript', 'Design Thinking', 'React Native', 'Data Analysis'],
};

const badges = [
  { icon: 'star', label: 'Pro Learner', color: '#facc15' },
  { icon: 'flame', label: 'Streak 7d', color: '#f97316' },
];

const socialLinks = [
  { icon: 'logo-linkedin', label: 'LinkedIn', url: 'https://linkedin.com/', color: '#0A66C2' },
  { icon: 'logo-github', label: 'GitHub', url: 'https://github.com/', color: '#333' },
];

export default function ProfileScreen() {
  const theme = lightTheme;
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState<string | null>('https://i.pravatar.cc/150?img=47');
  const [bio, setBio] = useState('Aspiring developer and lifelong learner.');
  const [showSkillInfo, setShowSkillInfo] = useState<string | null>(null);

  // Avatar animation
  const avatarAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(avatarAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, []);

  const toggleEdit = () => {
    if (isEditing) {
      // Optionally update user info in context here if you want to allow editing
      // For now, just log
      console.log('Saved:', { name, email, profileImage });
    }
    setIsEditing(!isEditing);
  };

  const pickImage = async () => {
    if (!isEditing) return;
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need gallery permissions to change your profile picture!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (e) {
      console.error('Image picker error:', e);
    }
  };

  // Progress bar calculation
  const totalCourses = progressData.completedCourses + progressData.inProgressCourses;
  const completedPercent = totalCourses ? progressData.completedCourses / totalCourses : 0;
  const inProgressPercent = totalCourses ? progressData.inProgressCourses / totalCourses : 0;

  // Profile completion calculation
  const profileFields = [name, email, bio, profileImage];
  const profileCompletion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

  return (
    <LinearGradient
      colors={['#e0e7ff', '#fff']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
        {/* Settings Icon */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 20 }}>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={30} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Avatar with accent background and animation */}
          <View style={styles.header}>
            <View style={styles.avatarAccent}>
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: avatarAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.7, 1],
                      }),
                    },
                  ],
                  shadowColor: '#6366F1',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.18,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <TouchableOpacity activeOpacity={0.7} onPress={pickImage}>
                  <Animated.Image
                    source={{ uri: profileImage! }}
                    style={styles.avatar}
                  />
                  {isEditing && (
                    <View style={[styles.cameraIconWrapper, { backgroundColor: theme.primary }]}>
                      <Ionicons name="camera" size={18} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>
            <Text style={[styles.name, { color: theme.text }]}>{user?.name || 'Guest User'}</Text>
            <Text style={[styles.email, { color: theme.muted }]}>{user?.email || 'guest@example.com'}</Text>
            <TouchableOpacity style={[styles.editBtn, { borderColor: theme.primary }]} onPress={toggleEdit}>
              <Ionicons name={isEditing ? 'save-outline' : 'create-outline'} size={18} color={theme.primary} />
              <Text style={[styles.editText, { color: theme.primary }]}>
                {isEditing ? 'Save' : 'Edit Profile'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Account Info Card */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Account Info</Text>
            <View style={styles.info}>
              <Text style={[styles.label, { color: theme.muted }]}>Name</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, { borderColor: theme.border, color: theme.text }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={theme.muted}
                />
              ) : (
                <Text style={[styles.value, { color: theme.text }]}>{name}</Text>
              )}
            </View>
            <View style={styles.info}>
              <Text style={[styles.label, { color: theme.muted }]}>Email</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, { borderColor: theme.border, color: theme.text }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Your email"
                  placeholderTextColor={theme.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={[styles.value, { color: theme.text }]}>{email}</Text>
              )}
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressCard}>
            <Text style={[styles.cardTitle, { color: theme.text, marginBottom: 10 }]}>Course Progress</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { backgroundColor: theme.primary, width: `${completedPercent * 100}%` }]} />
              <View style={[styles.progressBarFill, { backgroundColor: theme.accent, width: `${inProgressPercent * 100}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={[styles.progressLabel, { color: theme.primary }]}>Completed: {progressData.completedCourses}</Text>
              <Text style={[styles.progressLabel, { color: theme.accent }]}>In Progress: {progressData.inProgressCourses}</Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: theme.tag }]}>
              <Ionicons name="checkmark-circle-outline" size={26} color={theme.text} />
              <Text style={[styles.statValue, { color: theme.text }]}>{progressData.completedCourses}</Text>
              <Text style={[styles.statLabel, { color: theme.muted }]}>Completed</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.tag }]}>
              <Ionicons name="time-outline" size={26} color={theme.text} />
              <Text style={[styles.statValue, { color: theme.text }]}>{progressData.inProgressCourses}</Text>
              <Text style={[styles.statLabel, { color: theme.muted }]}>In Progress</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Skills Card */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Skills</Text>
            <View style={styles.tagsContainer}>
              {progressData.skills.map((skill, i) => (
                <View key={i} style={[styles.tag, { backgroundColor: theme.tag }]}>
                  <Text style={[styles.tagText, { color: theme.primary }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recently Viewed Card */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Recently Viewed</Text>
            {progressData.recentCourses.map((course, i) => (
              <View key={i} style={styles.recent}>
                <Ionicons name="book-outline" size={18} color={theme.accent} />
                <Text style={[styles.recentText, { color: theme.text }]}>{course}</Text>
              </View>
            ))}
          </View>

          {/* Badges Row */}
          <View style={styles.badgeRow}>
            {badges.map(badge => (
              <View key={badge.label} style={[styles.badge, { backgroundColor: badge.color + '22' }]}>
                <Ionicons name={badge.icon as any} size={18} color={badge.color} />
                <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
              </View>
            ))}
          </View>

          {/* Profile Completion Meter */}
          <View style={styles.profileCompletionCard}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Profile Completion</Text>
            <View style={styles.profileCompletionRow}>
              <AnimatedCircularProgress
                size={60}
                width={7}
                fill={profileCompletion}
                tintColor={theme.primary}
                backgroundColor="#e5e7eb"
                rotation={0}
                lineCap="round"
              >
                {() => (
                  <Text style={{ fontWeight: 'bold', color: theme.primary }}>{profileCompletion}%</Text>
                )}
              </AnimatedCircularProgress>
              <View style={{ marginLeft: 18 }}>
                <Text style={{ color: theme.text, fontWeight: '600', fontSize: 16 }}>
                  {profileCompletion === 100 ? 'Profile Complete!' : 'Almost there!'}
                </Text>
                {profileCompletion < 100 && (
                  <Text style={{ color: theme.muted, fontSize: 13 }}>
                    Add more info to complete your profile.
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Editable Bio Section */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Bio</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text, minHeight: 60 }]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                placeholderTextColor={theme.muted}
                multiline
              />
            ) : (
              <Text style={[styles.value, { color: theme.text }]}>{bio}</Text>
            )}
          </View>

          {/* Social Links */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Social Links</Text>
            <View style={styles.socialRow}>
              {socialLinks.map(link => (
                <TouchableOpacity
                  key={link.label}
                  style={[styles.socialBtn, { borderColor: link.color }]}
                  onPress={() => Linking.openURL(link.url)}
                >
                  <Ionicons name={link.icon as any} size={20} color={link.color} />
                  <Text style={[styles.socialText, { color: link.color }]}>{link.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Animated Progress Circles for Courses */}
          <View style={styles.progressCirclesRow}>
            <View style={styles.progressCircleItem}>
              <AnimatedCircularProgress
                size={70}
                width={8}
                fill={completedPercent * 100}
                tintColor={theme.primary}
                backgroundColor="#e5e7eb"
                rotation={0}
                lineCap="round"
              >
                {() => (
                  <Text style={{ fontWeight: 'bold', color: theme.primary, fontSize: 16 }}>
                    {progressData.completedCourses}
                  </Text>
                )}
              </AnimatedCircularProgress>
              <Text style={{ color: theme.text, marginTop: 6, fontWeight: '600' }}>Completed</Text>
            </View>
            <View style={styles.progressCircleItem}>
              <AnimatedCircularProgress
                size={70}
                width={8}
                fill={inProgressPercent * 100}
                tintColor={theme.accent}
                backgroundColor="#e5e7eb"
                rotation={0}
                lineCap="round"
              >
                {() => (
                  <Text style={{ fontWeight: 'bold', color: theme.accent, fontSize: 16 }}>
                    {progressData.inProgressCourses}
                  </Text>
                )}
              </AnimatedCircularProgress>
              <Text style={{ color: theme.text, marginTop: 6, fontWeight: '600' }}>In Progress</Text>
            </View>
          </View>

          {/* Animated Skill Tags (clickable) */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Skills</Text>
            <View style={styles.tagsContainer}>
              {progressData.skills.map((skill, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.tag, { backgroundColor: theme.tag }]}
                  onPress={() => setShowSkillInfo(skill)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tagText, { color: theme.primary }]}>{skill}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {showSkillInfo && (
            <View style={styles.skillModal}>
              <View style={styles.skillModalContent}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>{showSkillInfo}</Text>
                <Text style={{ color: theme.muted, marginBottom: 16 }}>
                  {showSkillInfo} is one of your top skills!
                </Text>
                <TouchableOpacity onPress={() => setShowSkillInfo(null)} style={styles.closeSkillBtn}>
                  <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Recent Activity Timeline */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Recent Activity</Text>
            <View style={styles.timeline}>
              <View style={styles.timelineDot} />
              <Text style={styles.timelineText}>Completed "Python Programming" course</Text>
            </View>
            <View style={styles.timeline}>
              <View style={styles.timelineDot} />
              <Text style={styles.timelineText}>Added "React Native" to skills</Text>
            </View>
            <View style={styles.timeline}>
              <View style={styles.timelineDot} />
              <Text style={styles.timelineText}>Viewed "UI/UX Design"</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  scroll: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 30, position: 'relative' },
  avatarAccent: {
    backgroundColor: '#e0e7ff',
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#f3f4f6',
  },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    padding: 6,
    borderRadius: 20,
  },
  name: { fontSize: 24, fontWeight: '700', marginTop: 6 },
  email: { fontSize: 15, marginBottom: 8 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 8,
    backgroundColor: '#f3f4f6',
  },
  editText: { marginLeft: 6, fontWeight: '600', fontSize: 15 },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 18,
    opacity: 0.7,
    borderRadius: 1,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#00000010',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    backgroundColor: '#fff',
  },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  info: { marginBottom: 14 },
  label: { fontSize: 14, marginBottom: 6 },
  value: { fontSize: 16, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f3f4f6',
  },
  progressCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#00000010',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  progressBarBg: {
    flexDirection: 'row',
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#e0e7ff',
    elevation: 1,
  },
  statValue: { fontSize: 22, fontWeight: '700', marginTop: 8 },
  statLabel: { fontSize: 14, marginTop: 4 },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontWeight: '600',
    fontSize: 14,
  },
  recent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  recentText: { marginLeft: 10, fontSize: 15, fontWeight: '500' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  badgeText: {
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 13,
  },
  profileCompletionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#00000010',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  profileCompletionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    backgroundColor: '#f3f4f6',
  },
  socialText: {
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 15,
  },
  progressCirclesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    marginTop: 10,
  },
  progressCircleItem: {
    alignItems: 'center',
  },
  skillModal: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  skillModalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    width: 280,
    shadowColor: '#00000030',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  closeSkillBtn: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#e0e7ff',
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366F1',
    marginRight: 12,
  },
  timelineText: {
    fontSize: 15,
    color: '#222',
  },
});
//# sourceMappingURL=index.js.map