import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './module/users/users.module';

@Module({
  imports: [PrismaModule, AuthModule,ConfigModule.forRoot({
    isGlobal:true,
    envFilePath:'.env',
  }), UsersModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
