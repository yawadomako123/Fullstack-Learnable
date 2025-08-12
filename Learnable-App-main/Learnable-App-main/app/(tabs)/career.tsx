import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const filters = [
  'All',
  'Software Engineering & IT',
  'Business',
  'Sales & Marketing',
  'Data Science & Analytics',
  'Healthcare',
  'Finance',
  'Education',
  'Art & Design',
  'Non-profit',
];

const careers = [
  // SOFTWARE ENGINEERING & IT (5)
  {
    title: 'Software Engineer',
    description: 'Develop software applications and systems.',
    likes: ['Coding', 'Problem-solving', 'APIs'],
    category: 'Software Engineering & IT',
    icon: 'code-tags',
  },
  {
    title: 'DevOps Engineer',
    description: 'Automate and improve development pipelines.',
    likes: ['CI/CD', 'Infrastructure', 'Cloud'],
    category: 'Software Engineering & IT',
    icon: 'server',
  },
  {
    title: 'Frontend Developer',
    description: 'Create user-facing components.',
    likes: ['React', 'HTML/CSS', 'Animations'],
    category: 'Software Engineering & IT',
    icon: 'monitor',
  },
  {
    title: 'Backend Developer',
    description: 'Build server-side logic and databases.',
    likes: ['Databases', 'Node.js', 'APIs'],
    category: 'Software Engineering & IT',
    icon: 'database',
  },
  {
    title: 'QA Engineer',
    description: 'Test and ensure software quality.',
    likes: ['Testing', 'Automation', 'Debugging'],
    category: 'Software Engineering & IT',
    icon: 'bug',
  },

  // BUSINESS (5)
  {
    title: 'Business Analyst',
    description: 'Bridge the gap between business and IT.',
    likes: ['Analysis', 'Requirements', 'Stakeholder Management'],
    category: 'Business',
    icon: 'chart-bar',
  },
  {
    title: 'Operations Manager',
    description: 'Oversee daily business operations.',
    likes: ['Efficiency', 'Leadership', 'Strategy'],
    category: 'Business',
    icon: 'cogs',
  },
  {
    title: 'Entrepreneur',
    description: 'Build and grow your own business.',
    likes: ['Risk-taking', 'Innovation', 'Leadership'],
    category: 'Business',
    icon: 'lightbulb-on',
  },
  {
    title: 'Strategy Consultant',
    description: 'Provide advice for business growth.',
    likes: ['Market research', 'Planning', 'Analysis'],
    category: 'Business',
    icon: 'account-tie',
  },
  {
    title: 'Product Manager',
    description: 'Guide product development and strategy.',
    likes: ['Roadmapping', 'User Research', 'Prioritization'],
    category: 'Business',
    icon: 'view-dashboard-outline',
  },

  // SALES & MARKETING (5)
  {
    title: 'Digital Marketer',
    description: 'Promote brands via digital channels.',
    likes: ['SEO', 'Content', 'Analytics'],
    category: 'Sales & Marketing',
    icon: 'google-ads',
  },
  {
    title: 'Sales Representative',
    description: 'Drive revenue through direct sales.',
    likes: ['Pitching', 'Follow-ups', 'CRM'],
    category: 'Sales & Marketing',
    icon: 'sale',
  },
  {
    title: 'Social Media Manager',
    description: 'Manage brand presence on social media.',
    likes: ['Instagram', 'Engagement', 'Content'],
    category: 'Sales & Marketing',
    icon: 'instagram',
  },
  {
    title: 'PPC Specialist',
    description: 'Manage pay-per-click advertising campaigns.',
    likes: ['Google Ads', 'Analytics', 'ROI'],
    category: 'Sales & Marketing',
    icon: 'google-ads',
  },
  {
    title: 'Content Marketing Manager',
    description: 'Develop and manage content strategy.',
    likes: ['Writing', 'SEO', 'Content Calendar'],
    category: 'Sales & Marketing',
    icon: 'file-document-outline',
  },

  // DATA SCIENCE & ANALYTICS (5)
  {
    title: 'Data Scientist',
    description: 'Build predictive models using data.',
    likes: ['Python', 'Statistics', 'AI'],
    category: 'Data Science & Analytics',
    icon: 'brain',
  },
  {
    title: 'Data Analyst',
    description: 'Interpret data to drive decisions.',
    likes: ['Excel', 'SQL', 'Dashboards'],
    category: 'Data Science & Analytics',
    icon: 'chart-line',
  },
  {
    title: 'Business Intelligence Analyst',
    description: 'Create visual dashboards and reports.',
    likes: ['Power BI', 'ETL', 'KPIs'],
    category: 'Data Science & Analytics',
    icon: 'chart-donut',
  },
  {
    title: 'Data Engineer',
    description: 'Build pipelines to process data.',
    likes: ['Spark', 'Hadoop', 'ETL'],
    category: 'Data Science & Analytics',
    icon: 'database-sync',
  },
  {
    title: 'Statistician',
    description: 'Apply statistics to real-world data.',
    likes: ['Sampling', 'Models', 'Forecasts'],
    category: 'Data Science & Analytics',
    icon: 'sigma',
  },

  // HEALTHCARE (5)
  {
    title: 'Registered Nurse',
    description: 'Provide patient care and support in healthcare settings.',
    likes: ['Patient Care', 'Medical Knowledge', 'Compassion'],
    category: 'Healthcare',
    icon: 'hospital-box',
  },
  {
    title: 'Physician',
    description: 'Diagnose and treat medical conditions.',
    likes: ['Diagnosis', 'Treatment', 'Patient Care'],
    category: 'Healthcare',
    icon: 'stethoscope',
  },
  {
    title: 'Physical Therapist',
    description: 'Help patients recover from injuries and improve movement.',
    likes: ['Rehabilitation', 'Exercise', 'Patient Care'],
    category: 'Healthcare',
    icon: 'human-wheelchair',
  },
  {
    title: 'Pharmacist',
    description: 'Dispense medications and provide expertise on drug use.',
    likes: ['Medications', 'Patient Safety', 'Consultation'],
    category: 'Healthcare',
    icon: 'pharmacy',
  },
  {
    title: 'Medical Laboratory Scientist',
    description: 'Perform tests to analyze body fluids and cells.',
    likes: ['Lab Work', 'Research', 'Analysis'],
    category: 'Healthcare',
    icon: 'microscope',
  },

  // FINANCE (5)
  {
    title: 'Financial Analyst',
    description: 'Help companies raise capital and provide financial advice.',
    likes: ['Deals', 'Markets', 'Analysis'],
    category: 'Finance',
    icon: 'trending-up',
  },
  {
    title: 'Accountant',
    description: 'Prepare and examine financial records.',
    likes: ['Numbers', 'Taxes', 'Reports'],
    category: 'Finance',
    icon: 'calculator',
  },
  {
    title: 'Financial Planner',
    description: 'Help clients manage their finances and plan for the future.',
    likes: ['Retirement', 'Investments', 'Planning'],
    category: 'Finance',
    icon: 'finance',
  },
  {
    title: 'Risk Manager',
    description: 'Identify and mitigate financial risks.',
    likes: ['Analysis', 'Strategy', 'Compliance'],
    category: 'Finance',
    icon: 'shield-alert',
  },
  {
    title: 'Wealth Manager',
    description: 'Provide financial advice to high-net-worth clients.',
    likes: ['Investments', 'Estate Planning', 'Tax'],
    category: 'Finance',
    icon: 'currency-usd',
  },

  // EDUCATION (5)
  {
    title: 'High School Teacher',
    description: 'Educate students in a high school setting.',
    likes: ['Teaching', 'Mentoring', 'Subject Matter'],
    category: 'Education',
    icon: 'school',
  },
  {
    title: 'College Professor',
    description: 'Teach and conduct research at the college level.',
    likes: ['Research', 'Teaching', 'Publishing'],
    category: 'Education',
    icon: 'account-tie',
  },
  {
    title: 'Special Education Teacher',
    description: 'Work with students who have special needs.',
    likes: ['Patience', 'Adaptation', 'Support'],
    category: 'Education',
    icon: 'human-child',
  },
  {
    title: 'School Counselor',
    description: 'Help students with academic and social development.',
    likes: ['Guidance', 'Support', 'Advising'],
    category: 'Education',
    icon: 'account-heart',
  },
  {
    title: 'Curriculum Developer',
    description: 'Create educational materials and programs.',
    likes: ['Instructional Design', 'Content Creation', 'Education'],
    category: 'Education',
    icon: 'book-open-page-variant',
  },

  // ART & DESIGN (5)
  {
    title: 'Graphic Designer',
    description: 'Create visual concepts using software.',
    likes: ['Adobe Creative Suite', 'Typography', 'Layout'],
    category: 'Art & Design',
    icon: 'palette',
  },
  {
    title: 'Industrial Designer',
    description: 'Develop concepts for manufactured products.',
    likes: ['3D Modeling', 'Product Design', 'Sketching'],
    category: 'Art & Design',
    icon: 'palette-outline',
  },
  {
    title: 'Fashion Designer',
    description: 'Create clothing and accessory designs.',
    likes: ['Sketching', 'Fashion Trends', 'Textiles'],
    category: 'Art & Design',
    icon: 'hanger',
  },
  {
    title: 'Interior Designer',
    description: 'Design functional and aesthetic indoor spaces.',
    likes: ['Space Planning', 'Color Theory', 'Decor'],
    category: 'Art & Design',
    icon: 'sofa',
  },
  {
    title: 'Game Designer',
    description: 'Create video game concepts and mechanics.',
    likes: ['Storytelling', 'Level Design', 'Gameplay'],
    category: 'Art & Design',
    icon: 'gamepad-variant',
  },

  // NON-PROFIT (5)
  {
    title: 'Fundraiser',
    description: 'Raise funds for non-profit organizations.',
    likes: ['Donor Relations', 'Event Planning', 'Marketing'],
    category: 'Non-profit',
    icon: 'hand-heart',
  },
  {
    title: 'Community Organizer',
    description: 'Mobilize and support communities for causes.',
    likes: ['Advocacy', 'Leadership', 'Communication'],
    category: 'Non-profit',
    icon: 'account-group',
  },
  {
    title: 'Grant Writer',
    description: 'Write proposals to secure funding.',
    likes: ['Writing', 'Research', 'Attention to Detail'],
    category: 'Non-profit',
    icon: 'file-document',
  },
  {
    title: 'Volunteer Coordinator',
    description: 'Manage volunteer recruitment and activities.',
    likes: ['Organization', 'Communication', 'People Skills'],
    category: 'Non-profit',
    icon: 'account-multiple',
  },
  {
    title: 'Program Manager',
    description: 'Oversee non-profit projects and programs.',
    likes: ['Planning', 'Budgeting', 'Leadership'],
    category: 'Non-profit',
    icon: 'clipboard-check',
  },
];

export default function CareerScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Explore Careers</Text>
      <Text style={styles.subheader}>
        Discover roles that match your skills and interests.
      </Text>

      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
          keyboardShouldPersistTaps="always"
        >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setSelectedFilter(filter)}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilterButton,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.cardContainer}>
        {careers
          .filter(
            (career) => selectedFilter === 'All' || career.category === selectedFilter
          )
          .map((career, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons
                  name={career.icon}
                  size={30}
                  color="#4F46E5"
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.cardTitle}>{career.title}</Text>
                  <Text style={styles.categoryTag}>{career.category}</Text>
                </View>
              </View>
              <Text style={styles.cardDescription}>{career.description}</Text>
              <View style={styles.likesContainer}>
                {career.likes.map((like, i) => (
                  <View key={i} style={styles.likeTag}>
                    <Text style={styles.likeText}>{like}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  subheader: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
  },
  filtersContainer: {
    height: 56,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  filters: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: 8,
    alignItems: 'center',
    height: '100%',
    flexDirection: 'row',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    flexShrink: 0,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeFilterButton: {
    backgroundColor: '#4338CA',
    borderColor: '#3730A3',
  },
  filterText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cardContainer: {
    paddingBottom: 80,
    paddingTop: 7,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  categoryTag: {
    fontSize: 12,
    color: '#475569',
  },
  cardDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  likesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  likeTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    fontWeight: '500',
  },
  likeText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '500',
  },
});
