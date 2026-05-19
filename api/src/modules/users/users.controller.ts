import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UsersService } from './users.service';
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorators';
import { UserResponseDto } from './dto/uesr-response.dto';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
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
@ApiResponse({status:409,description:'user already exists',type:Error})
@HttpCode(HttpStatus.OK)


async updateProfile( userId: string,@Body() UpdateUserDto: UpdateUserDto , @Req() req:RequestWithUser):Promise<UserResponseDto>{
    return await this.usersService.update(userId,UpdateUserDto);
}

//change currnt user password
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
 
@HttpCode(HttpStatus.OK)

async changePassword( @GetUser('id') userId:string, @Body() changePasswordDto:ChangePasswordDto ):Promise<{message:string}>{
    return await this.usersService.changePassword(userId,changePasswordDto);
}
}

//Delete user (for admin purposes)
@Delete("me")
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary:'delete user',
  description:'delete user'
})
@ApiResponse({
  status:200,
  description:'user deleted',
  type:UserResponseDto
})
@ApiResponse({status:401,description:'unauthorized',type:Error})
@ApiResponse({status:409,description:'user already exists',type:Error})
@HttpCode(HttpStatus.OK)

async deleteUser( @GetUser('id') userId:string, :Promise<{message:string}>{
    return await this.usersService.remove(userId,);
}




//Delete user by id
@Delete(':id')
@Roles(Role.ADMIN)
@HttpCode(HttpStatus.OK)
@ApiOperation({
  summary:'delete user',
  description:'delete user'
})
@ApiResponse({
  status:200,
  description:'user deleted',
  type:UserResponseDto
})
@ApiResponse({status:401,description:'unauthorized',type:Error})
@ApiResponse({status:409,description:'user already exists',type:Error})
@HttpCode(HttpStatus.OK)

async deleteUser( @GetUser('id') userId:string, :Promise<{message:string}>{
    return await this.usersService.remove(userId,);
}





// @HttpCode(HttpStatus.OK)
//     async getMe(@GetUser('id') userId: string) {
//        return this.usersService.getMe(userId);
//      }
}
