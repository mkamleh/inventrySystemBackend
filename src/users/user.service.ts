import { Injectable } from '@nestjs/common';
import { Role } from 'src/enums/roles';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'manager@manager.com',
      password: '12345678',
      roles: [Role.Manager],
    },
    {
      userId: 2,
      username: 'admin@admin.com',
      password: '12345678',
      roles: [Role.Admin, Role.Manager],
    },
    {
      userId: 3,
      username: 'user@user.com',
      password: '12345678',
      roles: [Role.User],
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
