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
  status: "PRESENT" | "LATE" | "ABSENT" | "AUTOCHECKOUT";
  location: Location;
}

export interface User {
  // id: string;
  fullname: string;
  email: string;
  role: string;
  roleId: string;
}
