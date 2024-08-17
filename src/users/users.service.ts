import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
  ) {}

  /**
   * Creates a new user.
   *
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @returns The saved user entity.
   */
  create({ email, password }: { email: string; password: string }) {
    const user = this.repo.create({ email, password }); // create instance of UserEntity

    return this.repo.save(user); // actually save instance of UserEntity
  }

  /**
   * Finds a user by their ID.
   *
   * @param id - The ID of the user.
   * @returns The found user entity or throws an error if not found.
   */
  async findOne({ id }: { id: number }) {
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  /**
   * Finds users by their email.
   *
   * @param email - The email of the users.
   * @returns An array of found user entities.
   */
  find({ email }: { email: string }) {
    return this.repo.find({ where: { email } });
  }

  /**
   * Updates a user by their ID.
   *
   * @param id - The ID of the user.
   * @param userObject - The updated user object.
   * @returns The updated user entity or throws an error if not found.
   */
  async update({
    id,
    userObject,
  }: {
    id: number;
    userObject: Partial<UserEntity>;
  }) {
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    Object.assign(user, userObject);
    return this.repo.save(user);
  }

  /**
   * Removes a user by their ID.
   *
   * @param id - The ID of the user.
   * @returns The removed user entity or throws an error if not found.
   */
  async remove({ id }: { id: number }) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.repo.remove(user);
  }
}
