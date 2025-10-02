import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../tasks.controller';
import { TasksService } from '../tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TaskStatus } from '../dto/tasks.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockGuard = { canActivate: jest.fn().mockReturnValue(true) };
  const user = { id: 1 };

  it('deve carregar a suíte de testes do controller', () => {
    expect(true).toBe(true);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockTasksService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<TasksController>(TasksController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    const dto = {
      title: 'Nova Tarefa',
      description: 'Desc',
      status: TaskStatus.PENDENTE as TaskStatus,
    };
    const created = {
      id: 1,
      ...dto,
      authorId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('deve criar e retornar wrapper de sucesso', async () => {
      mockTasksService.create.mockResolvedValue(created);

      const result = await controller.create(dto as any, user);

      expect(result).toEqual({
        success: true,
        message: 'Tarefa criada com sucesso',
        data: created,
      });
      expect(mockTasksService.create).toHaveBeenCalledWith({
        ...dto,
        authorId: user.id,
      });
    });

    it('deve mapear P2003 para BadRequestException (Autor não existe)', async () => {
      const err: any = new Error('FK');
      err.code = 'P2003';
      mockTasksService.create.mockRejectedValue(err);

      await expect(controller.create(dto as any, user)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('deve retornar wrapper de sucesso com lista', async () => {
      const list = [{ id: 1, title: 'A', status: TaskStatus.PENDENTE as TaskStatus }];
      mockTasksService.findAll.mockResolvedValue(list);

      const result = await controller.findAll(user);

      expect(result).toEqual({
        success: true,
        message: 'Tarefas recuperadas com sucesso',
        data: list,
      });
      expect(mockTasksService.findAll).toHaveBeenCalledWith(user.id);
    });
  });

  describe('findOne', () => {
    it('deve retornar wrapper de sucesso quando existe', async () => {
      const task = { id: 1, title: 'A', status: TaskStatus.PENDENTE as TaskStatus };
      mockTasksService.findOne.mockResolvedValue(task);

      const result = await controller.findOne(1, user);

      expect(result).toEqual({
        success: true,
        message: 'Tarefa recuperada com sucesso',
        data: task,
      });
      expect(mockTasksService.findOne).toHaveBeenCalledWith(1, user.id);
    });

    it('deve lançar NotFoundException quando não existir', async () => {
      mockTasksService.findOne.mockResolvedValue(null);
      await expect(controller.findOne(1, user)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar e retornar wrapper de sucesso', async () => {
      const dto = { title: 'Atualizada', status: TaskStatus.CONCLUIDA as TaskStatus };
      const updated = { id: 1, ...dto };
      mockTasksService.update.mockResolvedValue(updated);

      const result = await controller.update(1, dto as any, user);

      expect(result).toEqual({
        success: true,
        message: 'Tarefa atualizada com sucesso',
        data: updated,
      });
      expect(mockTasksService.update).toHaveBeenCalledWith(1, dto, user.id);
    });
  });

  describe('remove', () => {
    it('deve excluir e retornar wrapper de sucesso', async () => {
      mockTasksService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1, user);

      expect(result).toEqual({
        success: true,
        message: 'Tarefa excluída com sucesso',
      });
      expect(mockTasksService.remove).toHaveBeenCalledWith(1, user.id);
    });
  });
});
