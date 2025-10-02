import { NotFoundException } from '@nestjs/common';

export class TaskNotFoundException extends NotFoundException {
  constructor() {
    super('Tarefa não encontrada');
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('Usuário não encontrado');
  }
}
