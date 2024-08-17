import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users.service';
import { UserEntity } from '../../entity/user.entity';

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

  beforeEach(async () => {
    // create a fake copy of the users service

    /**
     * - we create find and create because there the the only methods used in the service
     * - we use promise.resolve because the service is asynchronous
     *
     */
    const fakeUsersService: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      create: ({ email, password }) =>
        Promise.resolve({ id: 1, email, password } as UserEntity),
    };

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
});
