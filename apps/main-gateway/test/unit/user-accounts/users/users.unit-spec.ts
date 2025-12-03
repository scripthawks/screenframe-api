import { UsersController } from '../../../../src/user-accounts/users/api/users.controller';
import { UsersService } from '../../../../src/user-accounts/users/application/users.service';
import { TestAppFactory } from '../../../core/factories/test-app.factory';

const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
};

describe('unit-UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    usersController = await TestAppFactory.createUnit(UsersController, [
      {
        provide: UsersService,
        useValue: mockUsersService,
      },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('UsersController.getAll', () => {
    it('should return "Users found"', () => {
      const result = usersController.getAll();
      expect(result).toBe('Users found');
    });
  });
});
