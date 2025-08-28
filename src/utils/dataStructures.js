// Data structures and constants for the application

export const SEMESTER_STRUCTURE = {
  1: ['Mathematics', 'Physics', 'Chemistry', 'Programming'],
  2: ['Mathematics', 'Physics', 'Chemistry', 'Programming', 'Computer Science'],
  3: ['Data Structures', 'Mathematics', 'Computer Networks', 'Database Systems'],
  4: ['Algorithms', 'Software Engineering', 'Operating Systems', 'Web Development'],
  5: ['Machine Learning', 'Mobile Development', 'Database Systems', 'Software Engineering'],
  6: ['Computer Networks', 'Artificial Intelligence', 'Web Development', 'Software Engineering'],
  7: ['Machine Learning', 'Artificial Intelligence', 'Mobile Development', 'Software Engineering'],
  8: ['Machine Learning', 'Artificial Intelligence', 'Software Engineering', 'Web Development']
};

export const RESOURCE_TYPES = [
  'Past Paper',
  'Notes',
  'Assignment',
  'Reference Material',
  'Tips and Suggestions'
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const ALL_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Computer Science',
  'Programming',
  'Data Structures',
  'Algorithms',
  'Database Systems',
  'Computer Networks',
  'Software Engineering',
  'Operating Systems',
  'Web Development',
  'Mobile Development',
  'Machine Learning',
  'Artificial Intelligence'
];

// Utility functions
export const getSubjectsForSemester = (semester) => {
  return SEMESTER_STRUCTURE[semester] || [];
};

export const getAllSemesters = () => {
  return Object.keys(SEMESTER_STRUCTURE).map(Number).sort();
};

export const getResourceTypeColor = (type) => {
  const colorMap = {
    'Past Paper': 'error',
    'Notes': 'primary',
    'Assignment': 'warning',
    'Reference Material': 'success',
    'Tips and Suggestions': 'info'
  };
  return colorMap[type] || 'default';
};

export const formatDate = (date) => {
  if (!date) return 'Unknown';
  
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  
  return date.toLocaleDateString();
};

export const organizeResourcesByHierarchy = (resources) => {
  const organized = {};
  
  resources.forEach(resource => {
    const { semester, subject, type } = resource;
    
    if (!organized[semester]) {
      organized[semester] = {};
    }
    
    if (!organized[semester][subject]) {
      organized[semester][subject] = {};
    }
    
    if (!organized[semester][subject][type]) {
      organized[semester][subject][type] = [];
    }
    
    organized[semester][subject][type].push(resource);
  });
  
  return organized;
};

export const getResourceStats = (resources) => {
  const stats = {
    total: resources.length,
    byType: {},
    bySemester: {},
    bySubject: {},
    recent: resources.filter(r => {
      const daysDiff = (new Date() - new Date(r.createdAt)) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length
  };
  
  resources.forEach(resource => {
    // By type
    stats.byType[resource.type] = (stats.byType[resource.type] || 0) + 1;
    
    // By semester
    stats.bySemester[resource.semester] = (stats.bySemester[resource.semester] || 0) + 1;
    
    // By subject
    stats.bySubject[resource.subject] = (stats.bySubject[resource.subject] || 0) + 1;
  });
  
  return stats;
};