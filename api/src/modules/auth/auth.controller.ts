import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { authResponseDto } from './dto/authResponse.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

//registration api
@Post('register')
@@HttpCode(HttpStatus.CREATED)
@UseGuards(RefreshTokenGuard)
 async register( @Body() registerDto: RegisterDto) : Promise<authResponseDto> {
console.log('registerDto', registerDto)
  return this.authService.register(registerDto);
 }
 //refresh access token 
 @UseGuards(RefreshTokenGuard)
 @@HttpCode(HttpStatus.CREATED)
  async refreshAccessToken( @Body() refreshTokenDto: refreshTokenDto) : Promise<authResponseDto> {
    return this.authService.refreshAccessToken(refreshTokenDto);
  }

 @UseGuards(RefreshTokenGuard)
 @@HttpCode(HttpStatus.CREATED)
 async refresh (@GetUser('id') userid:string) : Promise<authResponseDto> {
  return this.authService.refreshToken(userid);
 }
//logout user and invalidate refresh token
@Post('logout')
@UseGuards(JwtAuthGuard)
@@HttpCode(HttpStatus.CREATED)
 async logout (@GetUser('id') userid:string) : Promise<{message:string}> {
  await this.authService.logout(userid);
  return {message:'Logout successfully'};
 }

 //login
 @Post('login')
@@HttpCode(HttpStatus.CREATED)
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
