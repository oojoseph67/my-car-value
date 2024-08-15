import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
  ) {}

  create({ email, password }: { email: string; password: string }) {
    const user = this.repo.create({ email, password }); // create instance of UserEntity

    return this.repo.save(user); // actually save instance of UserEntity
  }
}
