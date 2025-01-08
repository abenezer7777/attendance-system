export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export interface AttendanceRecord {
  id: string;
  checkIn: Date;
  checkOut?: Date;
  status: 'PRESENT' | 'LATE' | 'ABSENT';
  location: Location;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
}