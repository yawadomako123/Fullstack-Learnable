// data/universitiesData.ts

export interface Course {
  id: string;
  title: string;
}

export interface University {
  id: string; // unique, URL-friendly
  name: string;
  logo: any; // consider ImageSourcePropType from 'react-native' if needed
  description: string;
  url: string;
  courses: Course[];
}

export const universitiesData: University[] = [
  {
    id: 'harvard',
    name: 'Harvard University',
    logo: require('../assets/images/havard.jpeg'),
    description: 'A world-renowned Ivy League university offering a wide range of online courses.',
    url: 'https://online-learning.harvard.edu/',
    courses: [
      { id: 'cs50', title: 'CS50x: Introduction to Computer Science' },
      { id: 'ethics-ai', title: 'Ethics in AI' },
    ],
  },
  {
    id: 'mit',
    name: 'MIT',
    logo: require('../assets/images/MIT.jpeg'),
    description: 'MIT offers thousands of open access courses, especially strong in science and engineering.',
    url: 'https://ocw.mit.edu/',
    courses: [
      { id: 'intro-python', title: 'Introduction to Computer Science and Programming in Python' },
      { id: 'ml', title: 'Machine Learning with Python' },
    ],
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    logo: require('../assets/images/Stanford.png'),
    description: 'Stanford Online provides free and paid courses across cutting-edge technology and science fields.',
    url: 'https://online.stanford.edu/',
    courses: [
      { id: 'ai', title: 'Artificial Intelligence: Principles and Techniques' },
      { id: 'health', title: 'Introduction to Health Data Science' },
    ],
  },
  {
    id: 'oxford',
    name: 'Oxford University',
    logo: require('../assets/images/oxford.jpg'),
    description: 'Oxford offers accessible short courses covering diverse disciplines from humanities to tech.',
    url: 'https://www.conted.ox.ac.uk/',
    courses: [
      { id: 'history', title: 'The History of the English Language' },
      { id: 'ai-society', title: 'AI and Society' },
    ],
  },
  {
    id: 'yale',
    name: 'Yale University',
    logo: require('../assets/images/yale.jpg'),
    description: 'Yale provides high-quality online learning on topics like psychology, ethics, and public health.',
    url: 'https://online.yale.edu/',
    courses: [
      { id: 'psych101', title: 'The Science of Well-Being' },
      { id: 'bioethics', title: 'Introduction to Bioethics' },
    ],
  },
  {
    id: 'cambridge',
    name: 'University of Cambridge',
    logo: require('../assets/images/Cambridge.jpg'),
    description: 'Cambridge delivers flexible online courses for career and personal development.',
    url: 'https://www.cam.ac.uk/online-learning',
    courses: [
      { id: 'writing', title: 'Creative Writing for Beginners' },
      { id: 'sci-phil', title: 'Science and Philosophy' },
    ],
  },
  {
    id: 'princeton',
    name: 'Princeton University',
    logo: require('../assets/images/princeton.jpeg'),
    description: 'Princeton’s online courses focus on global issues, tech, and society through major platforms.',
    url: 'https://online.princeton.edu/',
    courses: [
      { id: 'networks', title: 'Networks: Friends, Money, and Bytes' },
      { id: 'crypto', title: 'Bitcoin and Cryptocurrency Technologies' },
    ],
  },
  {
    id: 'berkeley',
    name: 'University of California, Berkeley',
    logo: require('../assets/images/california.jpeg'),
    description: 'UC Berkeley’s online courses emphasize innovation in technology, data, and leadership.',
    url: 'https://online.berkeley.edu/',
    courses: [
      { id: 'blockchain', title: 'Blockchain Fundamentals' },
      { id: 'stats', title: 'Foundations of Data Science' },
    ],
  },
  {
    id: 'columbia',
    name: 'Columbia University',
    logo: require('../assets/images/columbia.jpeg'),
    description: 'Columbia Online spans finance, cloud computing, and global education programs.',
    url: 'https://online.columbia.edu/',
    courses: [
      { id: 'cloud', title: 'Cloud Computing Applications' },
      { id: 'business', title: 'Introduction to Corporate Finance' },
    ],
  },
  {
    id: 'cornell',
    name: 'Cornell University',
    logo: require('../assets/images/cornell.jpeg'),
    description: 'eCornell delivers career-centered certificate programs with Ivy League rigor.',
    url: 'https://ecornell.cornell.edu/',
    courses: [
      { id: 'hr', title: 'Human Resources Essentials' },
      { id: 'leadership', title: 'Executive Leadership' },
    ],
  },
  {
    id: 'uchicago',
    name: 'University of Chicago',
    logo: require('../assets/images/chicago.jpeg'),
    description: 'UChicago offers online learning with a research-based, interdisciplinary focus.',
    url: 'https://online.uchicago.edu/',
    courses: [
      { id: 'econ', title: 'The Global Economy' },
      { id: 'philosophy', title: 'Philosophy of Science' },
    ],
  },
  {
    id: 'upenn',
    name: 'University of Pennsylvania',
    logo: require('../assets/images/uPenn.jpeg'),
    description: 'Penn delivers online courses in neuroscience, finance, and digital innovation.',
    url: 'https://online.upenn.edu/',
    courses: [
      { id: 'neuro', title: 'Fundamentals of Neuroscience' },
      { id: 'fintech', title: 'Fintech: Foundations & Applications' },
    ],
  },
];
