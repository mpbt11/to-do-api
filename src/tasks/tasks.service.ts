import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';
import { TaskNotFoundException } from '../common/exceptions';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto & { authorId: number }) {
    return this.prisma.task.create({
      data: createTaskDto,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(authorId: number) {
    return this.prisma.task.findMany({
      where: { authorId },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, authorId: number) {
    return this.prisma.task.findFirst({
      where: { id, authorId },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, authorId: number) {
    const task = await this.findOne(id, authorId);
    if (!task) {
      throw new TaskNotFoundException();
    }

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: number, authorId: number) {
    const task = await this.findOne(id, authorId);
    if (!task) {
      throw new TaskNotFoundException();
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
