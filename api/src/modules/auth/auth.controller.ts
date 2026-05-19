import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { authResponseDto } from './dto/authResponse.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorators';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { loginDto as LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

//registration api
@Post('register')
@HttpCode(201)

@ApiOperation({
  summary:'register',
  description:'register new user'
})
@ApiResponse({
  status:201,
  description:'User registered successfully',
  type:authResponseDto,
})
@ApiResponse({
  status:400,
  description:'Invalid request',
})
@ApiResponse({
  status:500,
  description:'Internal server error',
})
@ApiResponse({
  status:401,
  description:'Unauthorized',
})
@ApiResponse({
  status:409,
  description:'Conflict',
})



@UseGuards(RefreshTokenGuard)
 async register( @Body() registerDto: RegisterDto) : Promise<authResponseDto> {
console.log('registerDto', registerDto)
  return this.authService.register(registerDto);
 }
 //refresh access token 
 @Post('refresh')
 @HttpCode(HttpStatus.OK)
 @UseGuards(RefreshTokenGuard)
 @ApiOperation({
  summary:'refresh access token',
  description:'refresh access token'
})
@ApiResponse({
  status:200,
  description:'Access token refreshed successfully',
  type:authResponseDto,
})
@ApiResponse({
  status:400,
  description:'Invalid request',
})
@ApiResponse({
  status:500,
  description:'Internal server error',
})
@ApiResponse({
  status:401,
  description:'Unauthorized',
})
@ApiResponse({
  status:409,
  description:'Conflict',
})
 @UseGuards(RefreshTokenGuard)
 @HttpCode(HttpStatus.CREATED)
 async refresh (@GetUser('id') userid:string) : Promise<authResponseDto> {
  return this.authService.refreshToken(userid);
 }
//logout user and invalidate refresh token
@Post('logout')
@UseGuards(JwtAuthGuard)
@ApiOperation({
  summary:'logout user',
  description:'logout user'
})
@ApiResponse({
  status:200,
  description:'User logged out successfully',
  type:authResponseDto,
})
@ApiResponse({
  status:400,
  description:'Invalid request',
})
@ApiResponse({
  status:500,
  description:'Internal server error',
})
@ApiResponse({
  status:401,
  description:'Unauthorized',
})
@ApiResponse({
  status:409,
  description:'Conflict',
})
@HttpCode(HttpStatus.CREATED)
 async logout (@GetUser('id') userid:string) : Promise<{message:string}> {
  await this.authService.logout(userid);
  return {message:'Logout successfully'};
 }

 //login
 @Post('login')
@HttpCode(HttpStatus.CREATED)
@ApiOperation({
  summary:'login user',
  description:'login user'
})
@ApiResponse({
  status:200,
  description:'User logged in successfully',
  type:authResponseDto,
})
@ApiResponse({
  status:400,
  description:'Invalid request',
})
@ApiResponse({
  status:500,
  description:'Internal server error',
})
@ApiResponse({
  status:401,
  description:'Unauthorized',
})
@ApiResponse({
  status:409,
  description:'Conflict',
})
 async login(@Body() loginDto: LoginDto) : Promise<authResponseDto> {
  return await this.authService.login(loginDto);
 }

 









//   @Post('signup')
//   async signUp(@Body() createUserDto: CreateUserDto) {
//     return this.authService.signUp(createUserDto);
//   }

//   @Post('signin')
//   async signIn(@Body() signInDto: CreateUserDto) {
//     return this.authService.signIn(signInDto);
//   }
}
