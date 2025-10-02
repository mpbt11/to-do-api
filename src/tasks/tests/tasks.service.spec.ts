import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { PrismaService } from '../../database/prisma.service';
import { TaskNotFoundException } from '../../common/exceptions';
import { TaskStatus } from 'src/tasks/dto/tasks.dto';

describe('TasksService', () => {
  let service: TasksService;

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createTaskDto = {
      title: 'Tarefa Teste',
      description: 'Descrição da Tarefa',
      authorId: 1,
    };

    const expectedTask = {
      id: 1,
      ...createTaskDto,
      status: TaskStatus.PENDENTE as TaskStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: { id: 1, email: 'teste@exemplo.com', name: 'Usuário Teste' },
    };

    it('deve criar uma tarefa com sucesso', async () => {
      mockPrismaService.task.create.mockResolvedValue(expectedTask);

      const result = await service.create(createTaskDto);

      expect(result).toEqual(expectedTask);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: createTaskDto,
        include: {
          author: { select: { id: true, email: true, name: true } },
        },
      });
    });

    it('deve lançar erro de banco de dados ao criar tarefa', async () => {
      const dbError = new Error('Falha na conexão com o banco de dados');
      mockPrismaService.task.create.mockRejectedValue(dbError);

      await expect(service.create(createTaskDto)).rejects.toThrow(dbError);
    });
  });

  describe('findAll', () => {
    const authorId = 1;
    const expectedTasks = [
      {
        id: 1,
        title: 'Tarefa 1',
        description: 'Descrição 1',
        status: TaskStatus.PENDENTE as TaskStatus,
        authorId,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: 1, email: 'test@example.com', name: 'Test User' },
      },
    ];

    it('deve retornar todas as tarefas de um usuário', async () => {
      mockPrismaService.task.findMany.mockResolvedValue(expectedTasks);

      const result = await service.findAll(authorId);

      expect(result).toEqual(expectedTasks);
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        where: { authorId },
        include: {
          author: { select: { id: true, email: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('deve retornar array vazio quando usuário não tem tarefas', async () => {
      mockPrismaService.task.findMany.mockResolvedValue([]);

      const result = await service.findAll(authorId);
      expect(result).toEqual([]);
    });

    it('deve lançar erro de banco de dados ao buscar tarefas', async () => {
      const dbError = new Error('Falha na conexão com o banco de dados');
      mockPrismaService.task.findMany.mockRejectedValue(dbError);

      await expect(service.findAll(authorId)).rejects.toThrow(dbError);
    });
  });

  describe('findOne', () => {
    const taskId = 1;
    const authorId = 1;
    const expectedTask = {
      id: taskId,
      title: 'Tarefa Teste',
      description: 'Descrição da Tarefa',
      status: TaskStatus.PENDENTE as TaskStatus,
      authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: { id: 1, email: 'teste@exemplo.com', name: 'Usuário Teste' },
    };

    it('deve retornar uma tarefa quando encontrada', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(expectedTask);

      const result = await service.findOne(taskId, authorId);

      expect(result).toEqual(expectedTask);
      expect(mockPrismaService.task.findFirst).toHaveBeenCalledWith({
        where: { id: taskId, authorId },
        include: {
          author: { select: { id: true, email: true, name: true } },
        },
      });
    });

    it('deve retornar null quando a tarefa não for encontrada', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(null);

      const result = await service.findOne(taskId, authorId);
      expect(result).toBeNull();
    });

    it('deve lançar erro de banco de dados ao buscar uma tarefa', async () => {
      const dbError = new Error('Falha na conexão com o banco de dados');
      mockPrismaService.task.findFirst.mockRejectedValue(dbError);

      await expect(service.findOne(taskId, authorId)).rejects.toThrow(dbError);
    });
  });

  describe('update', () => {
    const taskId = 1;
    const authorId = 1;
    const updateTaskDto = {
      title: 'Tarefa Atualizada',
      status: TaskStatus.EM_ANDAMENTO as TaskStatus,
    };

    const existingTask = {
      id: taskId,
      title: 'Tarefa Original',
      description: 'Descrição Original',
      status: TaskStatus.PENDENTE as TaskStatus,
      authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: { id: 1, email: 'teste@exemplo.com', name: 'Usuário Teste' },
    };

    const updatedTask = {
      ...existingTask,
      ...updateTaskDto,
      updatedAt: new Date(),
    };

    it('deve atualizar uma tarefa com sucesso', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(existingTask);
      mockPrismaService.task.update.mockResolvedValue(updatedTask);

      const result = await service.update(taskId, updateTaskDto, authorId);

      expect(result).toEqual(updatedTask);
      expect(mockPrismaService.task.findFirst).toHaveBeenCalledWith({
        where: { id: taskId, authorId },
        include: {
          author: { select: { id: true, email: true, name: true } },
        },
      });
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: updateTaskDto,
        include: {
          author: { select: { id: true, email: true, name: true } },
        },
      });
    });

    it('deve lançar TaskNotFoundException quando a tarefa não for encontrada', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(null);

      await expect(service.update(taskId, updateTaskDto, authorId)).rejects.toThrow(
        TaskNotFoundException,
      );
      expect(mockPrismaService.task.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro de banco de dados ao atualizar tarefa', async () => {
      const dbError = new Error('Falha na conexão com o banco de dados');
      mockPrismaService.task.findFirst.mockResolvedValue(existingTask);
      mockPrismaService.task.update.mockRejectedValue(dbError);

      await expect(service.update(taskId, updateTaskDto, authorId)).rejects.toThrow(dbError);
    });
  });

  describe('remove', () => {
    const taskId = 1;
    const authorId = 1;
    const existingTask = {
      id: taskId,
      title: 'Tarefa para Excluir',
      description: 'Descrição',
      status: TaskStatus.PENDENTE as TaskStatus,
      authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: { id: 1, email: 'teste@exemplo.com', name: 'Usuário Teste' },
    };

    it('deve excluir uma tarefa com sucesso', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(existingTask);
      mockPrismaService.task.delete.mockResolvedValue(existingTask);

      const result = await service.remove(taskId, authorId);

      expect(result).toEqual(existingTask);
      expect(mockPrismaService.task.findFirst).toHaveBeenCalledWith({
        where: { id: taskId, authorId },
        include: {
          author: { select: { id: true, email: true, name: true } },
        },
      });
      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({
        where: { id: taskId },
      });
    });

    it('deve lançar TaskNotFoundException quando a tarefa não for encontrada', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(null);

      await expect(service.remove(taskId, authorId)).rejects.toThrow(TaskNotFoundException);
      expect(mockPrismaService.task.delete).not.toHaveBeenCalled();
    });

    it('deve lançar erro de banco de dados ao excluir tarefa', async () => {
      const dbError = new Error('Falha na conexão com o banco de dados');
      mockPrismaService.task.findFirst.mockResolvedValue(existingTask);
      mockPrismaService.task.delete.mockRejectedValue(dbError);

      await expect(service.remove(taskId, authorId)).rejects.toThrow(dbError);
    });
  });
});
