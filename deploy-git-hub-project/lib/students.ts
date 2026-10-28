export type StudentProfile = {
  id: string
  label: string
  summary: string
  programme: string
  batch: string
  currentSemester: number
  creditsEarned: number
  cgpa: number
  attendancePercent: number
  passed: string[]
  failed: string[]
  inProgress: string[]
  minor: string | null
  notes: string
}

export const STUDENTS: StudentProfile[] = [
  {
    id: 'student-a',
    label: 'Student A',
    summary: 'Sem 4 DS, failed Data Structures',
    programme: 'B.Tech Computer Science (Data Science)',
    batch: '2024',
    currentSemester: 4,
    creditsEarned: 72,
    cgpa: 7.4,
    attendancePercent: 82,
    passed: ['Linear Algebra', 'Programming in Python', 'Communication Skills', 'Environmental Studies and Sustainability', 'Probability and Statistics'],
    failed: ['Data Structures'],
    inProgress: ['Object Oriented Programming', 'Operating Systems'],
    minor: null,
    notes: 'Wants to take Machine Learning next semester.',
  },
  {
    id: 'student-b',
    label: 'Student B',
    summary: 'Sem 6, strong record, minor pending',
    programme: 'B.Tech Computer Science',
    batch: '2023',
    currentSemester: 6,
    creditsEarned: 118,
    cgpa: 8.9,
    attendancePercent: 91,
    passed: ['Data Structures', 'Exploratory Data Analysis', 'Machine Learning', 'Analysis of Algorithms', 'Databases Management', 'Artificial Intelligence'],
    failed: [],
    inProgress: ['Deep Learning', 'Cloud Computing'],
    minor: 'Undecided — interested in a management/business minor',
    notes: 'Asking about honours track and capstone eligibility.',
  },
  {
    id: 'student-c',
    label: 'Student C',
    summary: 'Sem 3, low attendance (68%)',
    programme: 'B.Tech Computer Science (Data Science)',
    batch: '2025',
    currentSemester: 3,
    creditsEarned: 38,
    cgpa: 6.1,
    attendancePercent: 68,
    passed: ['Communication Skills', 'Programming in Python'],
    failed: ['Linear Algebra', 'Calculus'],
    inProgress: ['Data Structures', 'Analytical Academic Writing'],
    minor: null,
    notes: 'Worried about exam eligibility and backlog re-registration.',
  },
  {
    id: 'student-d',
    label: 'Student D',
    summary: 'Sem 8, checking graduation credits',
    programme: 'B.Tech Computer Science',
    batch: '2022',
    currentSemester: 8,
    creditsEarned: 152,
    cgpa: 7.9,
    attendancePercent: 88,
    passed: ['All Sem 1–7 core courses', 'Machine Learning', 'Natural Language Processing', 'Big Data Framework'],
    failed: [],
    inProgress: ['Capstone Project/Industrial Internship'],
    minor: 'Partially completed (2 of 4 courses)',
    notes: 'Wants to know if they can graduate this semester.',
  },
  {
    id: 'none',
    label: 'No profile',
    summary: 'Anonymous question, no record',
    programme: 'Unknown',
    batch: 'Unknown',
    currentSemester: 0,
    creditsEarned: 0,
    cgpa: 0,
    attendancePercent: 0,
    passed: [],
    failed: [],
    inProgress: [],
    minor: null,
    notes: 'No student data available.',
  },
]

export function getStudent(id?: string) {
  return STUDENTS.find((s) => s.id === id) ?? STUDENTS[0]
}
