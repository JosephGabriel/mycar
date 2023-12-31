import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';

import { User } from './users.entity';

let service: AuthService;
let fakeUsersService: Partial<UsersService>;

describe('Auth Service', () => {
  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => email === user.email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as unknown as User;

        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('can create new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'password');

    expect(user.password).not.toEqual('password');

    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'password');

    await expect(service.signup('asdf@asdf.com', 'password')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin('asdf@asdf.com', 'password')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('asdf@asdf.com', 'password');

    await expect(service.signin('asdf@asdf.com', 'password1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    const newUser = await service.signup('asdf@asdf.com', 'password');

    const user = await service.signin(newUser.email, 'password');

    expect(user).toBeDefined();
  });
});
