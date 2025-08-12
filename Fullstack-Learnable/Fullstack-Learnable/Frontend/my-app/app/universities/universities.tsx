import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../constants/Colors';

const universities = [
  { id: 'harvard', name: 'Harvard University', logo: require('../../assets/images/havard.jpeg') },
  { id: 'mit', name: 'MIT', logo: require('../../assets/images/MIT.jpeg') },
  { id: 'stanford', name: 'Stanford University', logo: require('../../assets/images/Stanford.png') },
  { id: 'oxford', name: 'Oxford University', logo: require('../../assets/images/oxford.jpg') },
  { id: 'yale', name: 'Yale University', logo: require('../../assets/images/yale.jpg') },
  { id: 'cambridge', name: 'University of Cambridge', logo: require('../../assets/images/Cambridge.jpg') },
  { id: 'princeton', name: 'Princeton University', logo: require('../../assets/images/princeton.jpeg') },
  { id: 'berkeley', name: 'University of California, Berkeley', logo: require('../../assets/images/california.jpeg') },
  { id: 'columbia', name: 'Columbia University', logo: require('../../assets/images/columbia.jpeg') },
  { id: 'cornell', name: 'Cornell University', logo: require('../../assets/images/cornell.jpeg') },
  { id: 'uchicago', name: 'University of Chicago', logo: require('../../assets/images/chicago.jpeg') },
  { id: 'upenn', name: 'University of Pennsylvania', logo: require('../../assets/images/uPenn.jpeg') },
];

const UniversitiesScreen = () => {
  const { isDarkMode } = useTheme();
  const Colors = getThemeColors(isDarkMode);

  const handleNavigate = (id: string) => {
    router.push({
      pathname: '/universities/[id]',
      params: { id },
    });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: Colors.background }]}>
      <Text style={[styles.header, { color: Colors.text }]}>Top Universities</Text>
      {universities.map((uni) => (
        <TouchableOpacity
          key={uni.id}
          style={[styles.card, { backgroundColor: Colors.surface, shadowColor: Colors.muted }]}
          onPress={() => handleNavigate(uni.id)}
        >
          <Image source={uni.logo} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.name, { color: Colors.text }]}>{uni.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    alignItems: 'center',
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  logo: {
    width: 100,
    height: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default UniversitiesScreen;
