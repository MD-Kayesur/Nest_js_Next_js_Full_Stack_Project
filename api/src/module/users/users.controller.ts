import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorators';
 

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard,RolesGuard
)
@Controller('users')
export class UsersController {
constructor(private usersService:UsersService){}


@Get('me')
@ApiOperation({
  summary:'get user profile',
  description:'get user profile'
})
@HttpCode(HttpStatus.OK)
    async getMe(@GetUser('id') userId: string) {
       return this.usersService.getMe(userId);
     }


}
