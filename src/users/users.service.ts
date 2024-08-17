import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
  ) {}

  create({ email, password }: { email: string; password: string }) {
    const user = this.repo.create({ email, password }); // create instance of UserEntity

    return this.repo.save(user); // actually save instance of UserEntity
  }

  async findOne({ id }: { id: number }) {
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  find({ email }: { email: string }) {
    return this.repo.find({ where: { email } });
  }

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

  async remove({ id }: { id: number }) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.repo.remove(user);
  }
}
