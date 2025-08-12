import { Colors, getThemeColors } from '@/constants/Colors';
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
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router'; 

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
    question: 'Who is a software engineer and give me the roadmap to become one'
  },
  {
    title: 'DevOps Engineer',
    description: 'Automate and improve development pipelines.',
    likes: ['CI/CD', 'Infrastructure', 'Cloud'],
    category: 'Software Engineering & IT',
    icon: 'server',
    question: 'Who is a DevOps engineer and give me the roadmap to become one'

  },
  {
    title: 'Frontend Developer',
    description: 'Create user-facing components.',
    likes: ['React', 'HTML/CSS', 'Animations'],
    category: 'Software Engineering & IT',
    icon: 'monitor',
        question: 'Who is a Frontend Developer and give me the roadmap to become one'

  },
  {
    title: 'Backend Developer',
    description: 'Build server-side logic and databases.',
    likes: ['Databases', 'Node.js', 'APIs'],
    category: 'Software Engineering & IT',
    icon: 'database',
     question: 'Who is a Backend Developer and give me the roadmap to become one'

  },
  {
    title: 'QA Engineer',
    description: 'Test and ensure software quality.',
    likes: ['Testing', 'Automation', 'Debugging'],
    category: 'Software Engineering & IT',
    icon: 'bug',
        question: 'Who is a QA engineer and give me the roadmap to become one'

  },

  // BUSINESS (5)
  {
    title: 'Business Analyst',
    description: 'Bridge the gap between business and IT.',
    likes: ['Analysis', 'Requirements', 'Stakeholder Management'],
    category: 'Business',
    icon: 'chart-bar',
        question: 'What skills are required for a business Analyst'

  },
  {
    title: 'Operations Manager',
    description: 'Oversee daily business operations.',
    likes: ['Efficiency', 'Leadership', 'Strategy'],
    category: 'Business',
    icon: 'cogs',
        question: 'What is the role of an operations manager and requirements to become one'

  },
  {
    title: 'Entrepreneur',
    description: 'Build and grow your own business.',
    likes: ['Risk-taking', 'Innovation', 'Leadership'],
    category: 'Business',
    icon: 'lightbulb-on',
        question: 'How do i become an entrepreneur'

  },
  {
    title: 'Strategy Consultant',
    description: 'Provide advice for business growth.',
    likes: ['Market research', 'Planning', 'Analysis'],
    category: 'Business',
    icon: 'account-tie',
        question: 'Who is a strategy consult'

  },
  {
    title: 'Product Manager',
    description: 'Guide product development and strategy.',
    likes: ['Roadmapping', 'User Research', 'Prioritization'],
    category: 'Business',
    icon: 'view-dashboard-outline',
        question: 'Outlines steps to become a project manager'

  },

  // SALES & MARKETING (5)
  {
    title: 'Digital Marketer',
    description: 'Promote brands via digital channels.',
    likes: ['SEO', 'Content', 'Analytics'],
    category: 'Sales & Marketing',
    icon: 'google-ads',
        question: 'What are the essentials to become a digital markerter'

  },
  {
    title: 'Sales Representative',
    description: 'Drive revenue through direct sales.',
    likes: ['Pitching', 'Follow-ups', 'CRM'],
    category: 'Sales & Marketing',
    icon: 'sale',
        question: 'How do i become a sales representative'

  },
  {
    title: 'Social Media Manager',
    description: 'Manage brand presence on social media.',
    likes: ['Instagram', 'Engagement', 'Content'],
    category: 'Sales & Marketing',
    icon: 'instagram',
        question: 'List the skills required to become a social media manager'

  },
  {
    title: 'PPC Specialist',
    description: 'Manage pay-per-click advertising campaigns.',
    likes: ['Google Ads', 'Analytics', 'ROI'],
    category: 'Sales & Marketing',
    icon: 'google-ads',
        question: 'What are the requirements to be a PPC Specialist'

  },
  {
    title: 'Content Marketing Manager',
    description: 'Develop and manage content strategy.',
    likes: ['Writing', 'SEO', 'Content Calendar'],
    category: 'Sales & Marketing',
    icon: 'file-document-outline',
        question: 'What are the qualities of a content Marketing manager'

  },

  // DATA SCIENCE & ANALYTICS (5)
  {
    title: 'Data Scientist',
    description: 'Build predictive models using data.',
    likes: ['Python', 'Statistics', 'AI'],
    category: 'Data Science & Analytics',
    icon: 'brain',
        question: 'List the things i need to become a data scientist'

  },
  {
    title: 'Data Analyst',
    description: 'Interpret data to drive decisions.',
    likes: ['Excel', 'SQL', 'Dashboards'],
    category: 'Data Science & Analytics',
    icon: 'chart-line',
        question: 'Give a detailed roadmap to be a data analyst'

  },
  {
    title: 'Business Intelligence Analyst',
    description: 'Create visual dashboards and reports.',
    likes: ['Power BI', 'ETL', 'KPIs'],
    category: 'Data Science & Analytics',
    icon: 'chart-donut',
        question: 'Who is a Business Intelligence Analyst'

  },
  {
    title: 'Data Engineer',
    description: 'Build pipelines to process data.',
    likes: ['Spark', 'Hadoop', 'ETL'],
    category: 'Data Science & Analytics',
    icon: 'database-sync',
        question: 'Give me the roadmap to become a data engineer'

  },
  {
    title: 'Statistician',
    description: 'Apply statistics to real-world data.',
    likes: ['Sampling', 'Models', 'Forecasts'],
    category: 'Data Science & Analytics',
    icon: 'sigma',
        question: 'What are the skills and education required to become a Statistician'

  },

  // HEALTHCARE (5)
  {
    title: 'Registered Nurse',
    description: 'Provide patient care and support in healthcare settings.',
    likes: ['Patient Care', 'Medical Knowledge', 'Compassion'],
    category: 'Healthcare',
    icon: 'hospital-box',
        question: 'How do i become a nurse'

  },
  {
    title: 'Physician',
    description: 'Diagnose and treat medical conditions.',
    likes: ['Diagnosis', 'Treatment', 'Patient Care'],
    category: 'Healthcare',
    icon: 'stethoscope',
        question: 'What education do i require to become a Physician'

  },
  {
    title: 'Physical Therapist',
    description: 'Help patients recover from injuries and improve movement.',
    likes: ['Rehabilitation', 'Exercise', 'Patient Care'],
    category: 'Healthcare',
    icon: 'human-wheelchair',
        question: 'What do i need to do before becoming a Physical Therapist'

  },
  {
    title: 'Pharmacist',
    description: 'Dispense medications and provide expertise on drug use.',
    likes: ['Medications', 'Patient Safety', 'Consultation'],
    category: 'Healthcare',
    icon: 'medical-bag', // or 'pill'
        question: 'Who is a Pharmacist and give me the roadmap to become one'

  },
  {
    title: 'Medical Laboratory Scientist',
    description: 'Perform tests to analyze body fluids and cells.',
    likes: ['Lab Work', 'Research', 'Analysis'],
    category: 'Healthcare',
    icon: 'microscope',
        question: 'Who is a Medical Laboratory Scientist and give me the roadmap to become one'

  },

  // FINANCE (5)
  {
    title: 'Financial Analyst',
    description: 'Help companies raise capital and provide financial advice.',
    likes: ['Deals', 'Markets', 'Analysis'],
    category: 'Finance',
    icon: 'trending-up',
        question: 'How do i become a financial analyst'

  },
  {
    title: 'Accountant',
    description: 'Prepare and examine financial records.',
    likes: ['Numbers', 'Taxes', 'Reports'],
    category: 'Finance',
    icon: 'calculator',
        question: 'Give me the outline on becoming an Accountant'

  },
  {
    title: 'Financial Planner',
    description: 'Help clients manage their finances and plan for the future.',
    likes: ['Retirement', 'Investments', 'Planning'],
    category: 'Finance',
    icon: 'finance',
        question: 'Who is a Financial Planner and give me the roadmap to become one'

  },
  {
    title: 'Risk Manager',
    description: 'Identify and mitigate financial risks.',
    likes: ['Analysis', 'Strategy', 'Compliance'],
    category: 'Finance',
    icon: 'shield-alert',
        question: 'Who is a Risk Manager and give me the roadmap to become one'

  },
  {
    title: 'Wealth Manager',
    description: 'Provide financial advice to high-net-worth clients.',
    likes: ['Investments', 'Estate Planning', 'Tax'],
    category: 'Finance',
    icon: 'currency-usd',
        question: 'Who is a Wealth Manager and give me the roadmap to become one'

  },

  // EDUCATION (5)
  {
    title: 'High School Teacher',
    description: 'Educate students in a high school setting.',
    likes: ['Teaching', 'Mentoring', 'Subject Matter'],
    category: 'Education',
    icon: 'school',
        question: 'Give me the roadmap to become a high school teacher and their average salary'

  },
  {
    title: 'College Professor',
    description: 'Teach and conduct research at the college level.',
    likes: ['Research', 'Teaching', 'Publishing'],
    category: 'Education',
    icon: 'account-tie',
        question: 'Give me the roadmap to become a College Professor and their average salary'

  },
  {
    title: 'Special Education Teacher',
    description: 'Work with students who have special needs.',
    likes: ['Patience', 'Adaptation', 'Support'],
    category: 'Education',
    icon: 'human-child',
        question: 'Give me the roadmap to become a Special Education teacher and their average salary'

  },
  {
    title: 'School Counselor',
    description: 'Help students with academic and social development.',
    likes: ['Guidance', 'Support', 'Advising'],
    category: 'Education',
    icon: 'account-heart',
        question: 'Give me the roadmap to become a School Counselor and their average salary'

  },
  {
    title: 'Curriculum Developer',
    description: 'Create educational materials and programs.',
    likes: ['Instructional Design', 'Content Creation', 'Education'],
    category: 'Education',
    icon: 'book-open-page-variant',
        question: 'Who is a Curriculum Developer and give me the roadmap to become one'

  },

  // ART & DESIGN (5)
  {
    title: 'Graphic Designer',
    description: 'Create visual concepts using software.',
    likes: ['Adobe Creative Suite', 'Typography', 'Layout'],
    category: 'Art & Design',
    icon: 'palette',
        question: 'What skills do i need to be a graphics designer and the average salary'

  },
  {
    title: 'Industrial Designer',
    description: 'Develop concepts for manufactured products.',
    likes: ['3D Modeling', 'Product Design', 'Sketching'],
    category: 'Art & Design',
    icon: 'palette-outline',
        question: 'What skills do i need to be a industrial designer and the average salary'

  },
  {
    title: 'Fashion Designer',
    description: 'Create clothing and accessory designs.',
    likes: ['Sketching', 'Fashion Trends', 'Textiles'],
    category: 'Art & Design',
    icon: 'hanger',
        question: 'What skills do i need to be a fashion designer and the average salary'

  },
  {
    title: 'Interior Designer',
    description: 'Design functional and aesthetic indoor spaces.',
    likes: ['Space Planning', 'Color Theory', 'Decor'],
    category: 'Art & Design',
    icon: 'sofa',
        question: 'What skills do i need to be a interior designer and the average salary'

  },
  {
    title: 'Game Designer',
    description: 'Create video game concepts and mechanics.',
    likes: ['Storytelling', 'Level Design', 'Gameplay'],
    category: 'Art & Design',
    icon: 'gamepad-variant',
        question: 'What skills do i need to be a game designer and the average salary'

  },

  // NON-PROFIT (5)
  {
    title: 'Fundraiser',
    description: 'Raise funds for non-profit organizations.',
    likes: ['Donor Relations', 'Event Planning', 'Marketing'],
    category: 'Non-profit',
    icon: 'hand-heart',
        question: 'How do i become a professional fundraiser'

  },
  {
    title: 'Community Organizer',
    description: 'Mobilize and support communities for causes.',
    likes: ['Advocacy', 'Leadership', 'Communication'],
    category: 'Non-profit',
    icon: 'account-group',
        question: 'How do i become a community organizer'

  },
  {
    title: 'Grant Writer',
    description: 'Write proposals to secure funding.',
    likes: ['Writing', 'Research', 'Attention to Detail'],
    category: 'Non-profit',
    icon: 'file-document',
        question: 'Who is a Grant writer and give me the roadmap to become one'

  },
  {
    title: 'Volunteer Coordinator',
    description: 'Manage volunteer recruitment and activities.',
    likes: ['Organization', 'Communication', 'People Skills'],
    category: 'Non-profit',
    icon: 'account-multiple',
        question: 'Who is a volunteer coordinator and give me the roadmap to become one'

  },
  {
    title: 'Program Manager',
    description: 'Oversee non-profit projects and programs.',
    likes: ['Planning', 'Budgeting', 'Leadership'],
    category: 'Non-profit',
    icon: 'clipboard-check',
        question: 'How do i become a Program Manager'

  },
];

export default function CareerScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const router = useRouter();

 const handleCareerPress = (question: string) => {
  router.push({
    pathname: '/Ai',
    params: { q: question },  // pass as "q" to match Ai.tsx
  });
};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>Explore Careers</Text>
      <Text style={[styles.subheader, { color: colors.text }]}>
        Discover roles that match your skills and interests.
      </Text>

      <View style={[styles.filtersContainer, { backgroundColor: colors.surface }]}>
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
                {
                  backgroundColor:
                    selectedFilter === filter ? colors.primary : colors.surface,
                  borderColor:
                    selectedFilter === filter ? colors.primary : colors.border,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      selectedFilter === filter ? colors.background : colors.muted,
                    fontWeight: selectedFilter === filter ? '600' : '500',
                  },
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
            (career) =>
              selectedFilter === 'All' || career.category === selectedFilter
          )
          .map((career, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              activeOpacity={0.85}
              onPress={() => handleCareerPress(career.question)}
            >
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons
                  name={career.icon as any}
                  size={30}
                  color={colors.primary}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {career.title}
                  </Text>
                  <Text style={[styles.categoryTag, { color: colors.muted }]}>
                    {career.category}
                  </Text>
                </View>
              </View>
              <Text style={[styles.cardDescription, { color: colors.text }]}>
                {career.description}
              </Text>
              <View style={styles.likesContainer}>
                {career.likes.map((like, i) => (
                  <View
                    key={i}
                    style={[
                      styles.likeTag,
                      {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.likeText, { color: colors.primary }]}>
                      {like}
                    </Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  filtersContainer: {
    height: 56,
    width: '100%',
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
    paddingVertical: 10,
    alignItems: 'center',
    height: '100%',
    flexDirection: 'row',
  },
  filterButton: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    flexShrink: 0,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
  },
  cardContainer: {
    paddingBottom: 80,
    paddingTop: 8,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#0056',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  categoryTag: {
    fontSize: 12,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  likesContainer: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 12,
  },
  likeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    borderWidth: 1,
    alignSelf: 'flex-start',
    fontWeight: '500',
  },
  likeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
