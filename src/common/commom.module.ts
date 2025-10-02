import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [AuthModule, DatabaseModule],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class CommonModule {}
