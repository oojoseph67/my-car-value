import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';
import { UserEntity } from '@src/entity/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne({ id }: { id: number }) {
        return Promise.resolve({
          id,
          email: 'test@example.com',
          password: 'test',
        } as UserEntity);
      },
      find({ email }: { email: string }): Promise<UserEntity[]> {
        return Promise.resolve([
          { id: 1, email, password: '48goodlucKK@3' } as UserEntity,
        ]);
      },
    };

    fakeAuthService = {
      signinAuth({ email, password }) {
        return Promise.resolve({ id: 1, email, password } as UserEntity);
      },

      signupAuth({ email, password }) {
        return Promise.resolve({ id: 1, email, password } as UserEntity);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find user by id', async () => {
    const user = await controller.findOneUser(1);
    expect(user).toBeDefined();
  });

  it('finds all users', async () => {
    const email = 'foobar@foo.com';
    const users = await controller.findUser(email);
    expect(users).toBeDefined();
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(email);
  });

  // it('findUser and throws error if not found', async () => {
  //   fakeUsersService.findOne = () => Promise.resolve(null);

  //   const user = await controller.findOneUser(1);
  //   console.log({ user });
  //   await expect(user).rejects.toThrow(
  //     new HttpException('User not found', 404),
  //   );
  // });

  it('signs user in', async () => {
    const session = { userId: -10 };
    const user = await controller.signIn(
      { email: 'user@example.com', password: 'password' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
