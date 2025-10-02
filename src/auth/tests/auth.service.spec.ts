import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserAlreadyExistsException, InvalidCredentialsException } from '../../common/exceptions';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('register (cadastro)', () => {
    const dadosCadastro = {
      email: 'teste@teste.com',
      password: 'teste123',
      name: 'Usuário Teste',
    };

    it('deve registrar um novo usuário com sucesso', async () => {
      const senhaHash = 'hashedTest123';
      const mockUser = {
        id: 1,
        email: dadosCadastro.email,
        password: senhaHash,
        name: dadosCadastro.name,
        role: 'USUARIO',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockToken = 'jwt-token';

      (bcrypt.hash as jest.Mock).mockResolvedValue(senhaHash);
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.register(dadosCadastro);

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
        token: mockToken,
      });
    });

    it('deve lançar UserAlreadyExistsException quando o usuário já existir', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: dadosCadastro.email,
      });

      await expect(service.register(dadosCadastro)).rejects.toThrow(UserAlreadyExistsException);
    });

    it('deve lançar erro ao falhar no banco de dados durante criação', async () => {
      const dbError = new Error('Falha na conexão com o banco de dados');
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockRejectedValue(dbError);

      await expect(service.register(dadosCadastro)).rejects.toThrow(dbError);
    });

    it('deve lançar erro ao falhar no hash da senha', async () => {
      const hashError = new Error('Falha na criptografia da senha');
      (bcrypt.hash as jest.Mock).mockRejectedValue(hashError);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.register(dadosCadastro)).rejects.toThrow(hashError);
    });
  });

  describe('login', () => {
    const dadosLogin = {
      email: 'teste@teste.com',
      password: 'teste123',
    };

    const mockUser = {
      id: 1,
      email: dadosLogin.email,
      password: 'hashedTest123',
      name: 'Usuário Teste',
      role: 'USUARIO',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('deve logar um usuário com credenciais válidas', async () => {
      const mockToken = 'jwt-token';

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(dadosLogin);

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
        token: mockToken,
      });
    });

    it('deve lançar InvalidCredentialsException quando o usuário não existir', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(dadosLogin)).rejects.toThrow(InvalidCredentialsException);
    });

    it('deve lançar InvalidCredentialsException quando a senha for inválida', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dadosLogin)).rejects.toThrow(InvalidCredentialsException);
    });

    it('deve lançar erro ao falhar no banco de dados durante login', async () => {
      const dbError = new Error('Falha na conexão com o banco de dados');
      mockPrismaService.user.findUnique.mockRejectedValue(dbError);

      await expect(service.login(dadosLogin)).rejects.toThrow(dbError);
    });

    it('deve lançar erro ao falhar na verificação da senha', async () => {
      const compareError = new Error('Falha na verificação da senha');
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockRejectedValue(compareError);

      await expect(service.login(dadosLogin)).rejects.toThrow(compareError);
    });
  });

  describe('validateUser', () => {
    const userId = 1;
    const mockUser = {
      id: userId,
      email: 'teste@teste.com',
      name: 'Usuário Teste',
      password: 'hashedPassword',
      role: 'USUARIO',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('deve retornar os dados do usuário quando existir', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser(userId);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      });
    });

    it('deve retornar null quando o usuário não existir', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser(userId);

      expect(result).toBeNull();
    });

    it('deve lançar erro ao falhar no banco de dados', async () => {
      const dbError = new Error('Falha na conexão com o banco de dados');
      mockPrismaService.user.findUnique.mockRejectedValue(dbError);

      await expect(service.validateUser(userId)).rejects.toThrow(dbError);
    });
  });
});
