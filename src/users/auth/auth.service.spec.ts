import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users.service';
import { UserEntity } from '../../entity/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

// it('can create an instance of the auth service', async () => {
//   // create a fake copy of the users service

//   /**
//    * - we create find and create because there the the only methods used in the service
//    * - we use promise.resolve because the service is asynchronous
//    *
//    */
//   const fakeUsersService: Partial<UsersService> = {
//     find: () => Promise.resolve([]),
//     create: ({ email, password }) =>
//       Promise.resolve({ id: 1, email, password } as UserEntity),
//   };

//   const module: TestingModule = await Test.createTestingModule({
//     providers: [
//       AuthService,
//       {
//         provide: UsersService,
//         useValue: fakeUsersService,
//       },
//     ],
//   }).compile();

//   const service = module.get(AuthService);

//   expect(service).toBeDefined();
// });

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create a fake copy of the users service

    /**
     * - we create find and create because there the the only methods used in the service
     * - we use promise.resolve because the service is asynchronous
     */
    const users: UserEntity[] = [];
    fakeUsersService = {
      find: ({ email }: { email: string }) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: ({ email, password }) => {
        const newUser = users.push({
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as UserEntity);
        return Promise.resolve(users[newUser - 1]);
      },
    };

    // const fakeUsersService: Partial<UsersService> = {
    //   find: () => Promise.resolve([]),
    //   create: ({ email, password }) =>
    //     Promise.resolve({ id: 1, email, password } as UserEntity),
    // }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of the auth service', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signupAuth({
      email: 'foo@bar.com',
      password: 'password',
    });

    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signupAuth({
      email: 'foo@bar.com',
      password: 'password',
    });
    await expect(
      service.signupAuth({
        email: 'foo@bar.com',
        password: 'password',
      }),
    ).rejects.toThrow(
      new HttpException('Email already exists', HttpStatus.CONFLICT),
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signinAuth({
        email: 'foo@bar.com',
        password: 'password',
      }),
    ).rejects.toThrow(
      new HttpException('User does not exist', HttpStatus.CONFLICT),
    );
  });

  it('throws if an invalid password is provided', async () => {
    await service.signupAuth({
      email: 'foo@bar.com',
      password: 'password',
    });
    await expect(
      service.signinAuth({ email: 'foo@bar.com', password: 'http' }),
    ).rejects.toThrow(
      new HttpException('Incorrect password', HttpStatus.BAD_REQUEST),
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signupAuth({
      email: 'foo@bar.com',
      password: 'password',
    });

    const user = await service.signinAuth({
      email: 'foo@bar.com',
      password: 'password',
    });
    expect(user).toBeDefined();
  });
});
