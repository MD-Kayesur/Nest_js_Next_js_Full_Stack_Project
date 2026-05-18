import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { authResponseDto } from './dto/authResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

//registration api
 async register( @Body() registerDto: RegisterDto) : Promise<authResponseDto> {
console.log('registerDto', registerDto)
  return this.authService.register(registerDto);
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
