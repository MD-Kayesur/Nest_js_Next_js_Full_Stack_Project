import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UsersService } from './users.service';
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorators';
import { UserResponseDto } from './dto/uesr-response.dto';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
 

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
@Roles(Role.ADMIN)
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
@Roles(Role.ADMIN)
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

async findOne(@Param('id') id: string): Promise<UserResponseDto> {
  return await this.usersService.findOne(id);
}

//update user profile
@Patch('me')
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
@ApiResponse({status:409,description:'user already exists',type:Error})
@HttpCode(HttpStatus.OK)
async updateProfile(@GetUser('id') userId: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return await this.usersService.update(userId, updateUserDto);
}

//change current user password
@Patch('me/password')
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary:'change current user password',
  description:'change current user password'
})
@ApiResponse({
  status:200,
  description:'user password changed',
  type:UserResponseDto
})
@ApiResponse({status:401,description:'unauthorized',type:Error})
async changePassword(@GetUser('id') userId: string, @Body() changePasswordDto: ChangePasswordDto): Promise<{message:string}>{
    return await this.usersService.changePassword(userId, changePasswordDto);
}

//Delete user (for current user)
@Delete("me")
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary:'delete user profile',
  description:'delete user profile'
})
@ApiResponse({
  status:200,
  description:'user deleted successfully'
})
@ApiResponse({status:401,description:'unauthorized',type:Error})
async deleteMe(@GetUser('id') userId: string): Promise<{message:string}>{
    return await this.usersService.remove(userId);
}

//Delete user by id (for admin purposes)
@Delete(':id')
@Roles(Role.ADMIN)
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary:'delete user by ID',
  description:'delete user by ID'
})
@ApiResponse({
  status:200,
  description:'user deleted successfully'
})
@ApiResponse({status:401,description:'unauthorized',type:Error})
async deleteUser(@Param('id') id: string): Promise<{message:string}>{
    return await this.usersService.remove(id);
}
}
