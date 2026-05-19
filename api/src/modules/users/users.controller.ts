import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UsersService } from './users.service';
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorators';
import { UserResponseDto } from './dto/uesr-response.dto';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
 

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
@ApiResponse({
  status:200,
  description:'user profile',
  type:UserResponseDto
})
@ApiResponse({status:401,description:'unauthorized',type:Error})
 async getProfile (@Req() req:RequestWithUser):Promise<UserResponseDto>{
return await this.usersService.findOne(req.user.id)
 }  


//get all users (for admin purposes)
@Get( )
@Role(Role.ADMIN)
@ApiOperation({
  summary:'get all users',
  description:'get all users'
})
@ApiResponse({
  status:200,
  description:'all users',
  type:UserResponseDto
})
@ApiResponse({status:401,description:'unauthorized',type:[UserResponseDto]})
@ApiResponse({ status:401,description:'Unauthorized'})
@HttpCode(HttpStatus.OK)


async findAll():Promise<UserResponseDto[]>{

  return  await this.usersService.findAll();
}


//get user by ID (for admin purpose)

@Get(':id')
@Role(Role.ADMIN)
@ApiOperation({
  summary:'get user by ID',
  description:'get user by ID'
})
@ApiResponse({
  status:200,
  description:'user by ID',
  type:UserResponseDto
})
@ApiResponse({status:401,description:'unauthorized',type:[UserResponseDto]})
@ApiResponse({ status:401,description:'Unauthorized'})
@HttpCode(HttpStatus.OK)

async findOne(@Param('id') id: string):Promise<UserResponseDto[]>{

  return  await this.usersService.findOne(id);
}

//update user profile (for admin)
@Patch('me')
// @Role(Role.ADMIN)
@ApiOperation({
  summary:'update user profile',
  description:'update user profile'
})
@ApiResponse({
  status:200,
  description:'user profile',
  type:UserResponseDto
})
@ApiResponse({status:401,description:'unauthorized',type:Error})
@HttpCode(HttpStatus.OK)
async update(@Param('id') id: string,@Req() req:RequestWithUser):Promise<UserResponseDto>{
    return await this.usersService.update(id,req.user.id,req.body);

















// @HttpCode(HttpStatus.OK)
//     async getMe(@GetUser('id') userId: string) {
//        return this.usersService.getMe(userId);
//      }
}
