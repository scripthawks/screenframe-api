import { Test } from '@nestjs/testing';
import { UsersController } from '../../../src/user-accounts/users/api/users.controller';
import { UsersService } from '../../../src/user-accounts/users/application/users.service';

const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
};

describe('unit-UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
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
