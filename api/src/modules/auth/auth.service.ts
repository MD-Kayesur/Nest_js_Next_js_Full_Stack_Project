import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { authResponseDto } from './dto/authResponse.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private readonly prismaService: PrismaService,private readonly jwtService:JwtService) { }


    async register(registerDto: RegisterDto): Promise<authResponseDto> {
        console.log('registerDto', registerDto)

        const {email, password, firstName, lastName} = registerDto;
        const existingUser = await this.prismaService.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new ConflictException('User already exists');
        }
  try{
const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prismaService.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
            },
             select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                phoneNumber:true,
                address:true,
                bio:true,
                profileImage:true,
            password:false,
          
            
            },
        });
        //Generate Access Token
        const tokens = await this.generateTokens(user.id,user.email);
        await this.updateRefreshToken(user.id,tokens.refreshToken);

        return {
            message: 'User registered successfully',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user
        };
  }catch(error){
    throw new InternalServerErrorException('Failed to register user');
  }



    
     
}


//generate access and refresh tokens
private async generateTokens(userId:string,email:string):Promise<{accessToken:string,refreshToken:string}>{
    const payload={sub:userId,email}

const refreshId = randomBytes(32).toString('hex');
const  [accessToken,refreshToken]=await Promise.all([
    this.jwtService.signAsync(payload,{expiresIn:'15m'}),
    this.jwtService.signAsync({id:userId,refreshId},{expiresIn:'7d'}),
]);

return {accessToken,refreshToken}
 
}

//update refresh token
 async updateRefreshToken(userId:string,refreshToken:string){
    await this.prismaService.user.update({
        where:{
            id:userId,
        },
        data:{
           refreshToken:refreshToken,
        }
    })
}

//refresh access token and generate new refresh token
async refreshToken(userId:string,):Promise<authResponseDto>{
    const user = await this.prismaService.user.findUnique({
        where:{id:userId},
        select:{
            id:true,
            email:true,
            firstName:true,
            lastName:true,
            role:true,
             
        }
    });
    if(!user || !user.refreshToken){
        throw new UnauthorizedException('Invalid refresh token');
    }
    // const refreshTokenMatch = await bcrypt.compare(refreshToken,user.refreshToken);
    // if(!refreshTokenMatch){
    //     throw new UnauthorizedException('Invalid refresh token');
    // }
    const tokens = await this.generateTokens(user.id,user.email);
    await this.updateRefreshToken(user.id,tokens.refreshToken);
    return {
        ...tokens,user
    };
}




//logout user and invalidate refresh token
async logout(userId:string):Promise<void>{
    await this.prismaService.user.update({
        where:{
            id:userId,
        },
        data:{
           refreshToken:null,
        }
    })
}












}
