import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);

/**
 * AuthService is responsible for handling user authentication and registration.
 * It interacts with the UsersService to perform these operations.
 */
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  /**
   * Handles user signup by validating email uniqueness, hashing the password,
   * and storing the user in the database.
   *
   * @param email - The email of the user to be registered.
   * @param password - The password of the user to be registered.
   *
   * @throws HttpException - If the email already exists in the database.
   *
   * @returns The newly created user object.
   */
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

  /**
   * Handles user signin by validating the user's existence and password,
   * and returning the user object if successful.
   *
   * @param email - The email of the user attempting to sign in.
   * @param password - The password of the user attempting to sign in.
   *
   * @throws HttpException - If the user does not exist or the password is incorrect.
   *
   * @returns The user object if the signin is successful.
   */
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
