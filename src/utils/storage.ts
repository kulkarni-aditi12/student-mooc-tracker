import { AppData, User, Course, Deadline, Settings } from '../types';

const STORAGE_KEY = 'mooc_tracker_data';

const defaultData: AppData = {
  users: [],
  currentUser: null,
  courses: [],
  deadlines: [],
  settings: {
    theme: 'purple',
    profile: {
      name: '',
      email: ''
    }
  }
};

export const getStorageData = (): AppData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultData;
  } catch {
    return defaultData;
  }
};

export const setStorageData = (data: AppData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const addUser = (user: Omit<User, 'id'>): User => {
  const data = getStorageData();
  const newUser: User = {
    ...user,
    id: Date.now()
  };
  data.users.push(newUser);
  setStorageData(data);
  return newUser;
};

export const authenticateUser = (username: string, password: string): User | null => {
  const data = getStorageData();
  const user = data.users.find(u => u.username === username && u.password === password);
  if (user) {
    data.currentUser = user.id;
    setStorageData(data);
  }
  return user || null;
};

export const getCurrentUser = (): User | null => {
  const data = getStorageData();
  if (!data.currentUser) return null;
  return data.users.find(u => u.id === data.currentUser) || null;
};

export const logout = (): void => {
  const data = getStorageData();
  data.currentUser = null;
  setStorageData(data);
};

export const addCourse = (course: Omit<Course, 'id'>): void => {
  const data = getStorageData();
  const newCourse: Course = {
    ...course,
    id: Date.now()
  };
  data.courses.push(newCourse);
  setStorageData(data);
};

export const updateCourse = (courseId: number, updates: Partial<Course>): void => {
  const data = getStorageData();
  const index = data.courses.findIndex(c => c.id === courseId);
  if (index !== -1) {
    data.courses[index] = { ...data.courses[index], ...updates };
    setStorageData(data);
  }
};

export const deleteCourse = (courseId: number): void => {
  const data = getStorageData();
  data.courses = data.courses.filter(c => c.id !== courseId);
  setStorageData(data);
};

export const getUserCourses = (userId: number): Course[] => {
  const data = getStorageData();
  return data.courses.filter(c => c.userId === userId);
};

export const addDeadline = (deadline: Omit<Deadline, 'id'>): void => {
  const data = getStorageData();
  const newDeadline: Deadline = {
    ...deadline,
    id: Date.now()
  };
  data.deadlines.push(newDeadline);
  setStorageData(data);
};

export const getUserDeadlines = (userId: number): Deadline[] => {
  const data = getStorageData();
  return data.deadlines.filter(d => d.userId === userId);
};

export const updateSettings = (settings: Partial<Settings>): void => {
  const data = getStorageData();
  data.settings = { ...data.settings, ...settings };
  setStorageData(data);
};