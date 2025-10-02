import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../../database/prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException('Token de autenticação necessário');
    }

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    const userId = Number(payload?.sub);
    if (!userId || Number.isNaN(userId)) {
      throw new UnauthorizedException('Assunto do token inválido');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new UnauthorizedException('Não autorizado');
    }

    (req as any).user = { id: user.id, email: user.email, name: user.name };
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const header = request.headers.authorization ?? '';
    const [type, token] = header.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
