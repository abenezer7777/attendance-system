export interface Building {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export interface AttendanceRecord {
  id: string;
  // employeeid:string
  checkIn: Date;
  checkOut?: Date;
  status: "PRESENT" | "LATE" | "ABSENT" | "AUTOCHECKOUT";
  building: Building;
}
export type Ability = {
  subject: string;
  action: string;
};

export type Role = {
  name: string;
  abilities: Ability[];
};
// export interface User {
//   // id: string;
//   fullname: string;
//   email: string;
//   role: string;
//   roleId: string;
// }
