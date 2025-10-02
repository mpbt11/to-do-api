import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto, @CurrentUser() user: { id: number }) {
    try {
      const task = await this.tasksService.create({
        ...dto,
        authorId: Number(user.id),
      });
      return {
        success: true,
        message: 'Tarefa criada com sucesso',
        data: task,
      };
    } catch (error: any) {
      if (error?.code === 'P2003') {
        throw new BadRequestException('Autor não existe');
      }
      throw error;
    }
  }

  @Get()
  async findAll(@CurrentUser() user: { id: number }) {
    const tasks = await this.tasksService.findAll(Number(user.id));
    return {
      success: true,
      message: 'Tarefas recuperadas com sucesso',
      data: tasks,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    const task = await this.tasksService.findOne(id, Number(user.id));
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    return {
      success: true,
      message: 'Tarefa recuperada com sucesso',
      data: task,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: { id: number },
  ) {
    const task = await this.tasksService.update(id, dto, Number(user.id));
    return {
      success: true,
      message: 'Tarefa atualizada com sucesso',
      data: task,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    await this.tasksService.remove(id, Number(user.id));
    return {
      success: true,
      message: 'Tarefa excluída com sucesso',
    };
  }
}
