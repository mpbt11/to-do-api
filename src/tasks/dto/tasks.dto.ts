import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum TaskStatus {
  PENDENTE = 'pendente',
  EM_ANDAMENTO = 'em_andamento',
  CONCLUIDA = 'concluida',
}

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: `status must be one of the following values: ${Object.values(TaskStatus).join(', ')}`,
  })
  status?: TaskStatus;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: `status must be one of the following values: ${Object.values(TaskStatus).join(', ')}`,
  })
  status?: TaskStatus;
}
