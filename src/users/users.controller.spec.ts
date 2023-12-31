import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      // create(email, password) {},
      find(email) {
        return Promise.resolve([
          { id: '1', email, password: 'password' } as unknown as User,
        ]);
      },
      findOne(id) {
        return Promise.resolve({
          id,
          email: 'email@email.com',
          password: 'password',
        } as unknown as User);
      },
      // remove(id) {},
      // update(id, attrs) {},
    };
    fakeAuthService = {
      signin(email, password) {
        return Promise.resolve({ id: '1', email, password } as unknown as User);
      },
      // signup(email, password) {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers return a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asdf@asdf.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it('findUser return a list of users with the given email', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;

    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = {
      userId: -10,
    };

    const user = await controller.signin(
      {
        email: 'email@email.com',
        password: 'password',
      },
      session,
    );

    expect(user.id).toEqual('1');
    expect(session.userId).toEqual('1');
  });
});
