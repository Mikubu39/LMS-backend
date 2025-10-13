import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './database/user.entity';
import { RegisterAuthDto } from './dtos/register-auth.dto';
import { LoginAuthDto } from './dtos/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto): Promise<User> {
    const { email, password, full_name, phone } = registerAuthDto;

    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      full_name,
      phone,
    });

    await this.usersRepository.save(newUser);
    delete newUser.password;
    return newUser;
  }

  async login(loginAuthDto: LoginAuthDto): Promise<{ accessToken: string }> {
    const { email, password } = loginAuthDto;

    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.user_id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ user_id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    Object.assign(user, updateProfileDto);
    await this.usersRepository.save(user);
    delete user.password;
    return user;
  }

  async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatching = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Old password is not correct');
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);

    await this.usersRepository.save(user);
    return { message: 'Password changed successfully' };
  }
}