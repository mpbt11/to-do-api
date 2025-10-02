import { UnauthorizedException } from '@nestjs/common';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('Credenciais inválidas');
  }
}

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super('Token inválido');
  }
}

export class TokenExpiredException extends UnauthorizedException {
  constructor() {
    super('Token expirado');
  }
}
