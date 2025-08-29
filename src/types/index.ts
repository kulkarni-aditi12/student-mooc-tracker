export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface Course {
  id: number;
  userId: number;
  courseName: string;
  platform: string;
  startDate: string;
  deadline: string;
  progress: number;
}

export interface Deadline {
  id: number;
  userId: number;
  title: string;
  date: string;
}

export interface Settings {
  theme: string;
  profile: {
    name: string;
    email: string;
  };
}

export interface AppData {
  users: User[];
  currentUser: number | null;
  courses: Course[];
  deadlines: Deadline[];
  settings: Settings;
}