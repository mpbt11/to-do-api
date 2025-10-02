import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  if (!req.user) {
    throw new UnauthorizedException('Não autenticado');
  }
  return req.user as { id: number; email?: string; name?: string };
});
