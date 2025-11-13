import { UserRole } from "src/constant/enum";

export class StudentResponseDto {
  user_id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  dateOfBirth?: Date;
  gender?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(student: any) {
    this.user_id = student.user_id;
    this.email = student.email;
    this.full_name = student.full_name;
    this.phone = student.phone;
    this.address = student.address;
    this.avatar = student.avatar;
    this.role = student.role;
    this.isActive = student.isActive;
    this.dateOfBirth = student.dateOfBirth;
    this.gender = student.gender;
    this.createdAt = student.createdAt;
    this.updatedAt = student.updatedAt;
  }
}

