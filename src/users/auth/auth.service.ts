import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signupAuth({ email, password }: { email: string; password: string }) {
    const existingUser = await this.usersService.find({ email });

    if (existingUser.length > 0) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    // hashing password

    const salt = randomBytes(8).toString('hex');
    const hashedPassword = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hashedPassword.toString('hex');

    const user = await this.usersService.create({
      email,
      password: result,
    });

    return user;
  }

  async signinAuth({ email, password }: { email: string; password: string }) {
    const [user] = await this.usersService.find({ email });

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.CONFLICT);
    }

    const [salt, storedHash] = user.password.split('.');
    const hashedInputPassword = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hashedInputPassword.toString('hex')) {
      throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
}
