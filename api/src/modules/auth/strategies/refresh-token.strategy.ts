//refresh token strategy
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { Request } from "express";
import * as bcrypt from 'bcrypt';
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy,'jwt-refresh'){
    constructor(
        private prisma:PrismaService,
        private config:ConfigService,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_SECRET || 'defaultrefreshsecret2026',
            passReqToCallback:true,
        });
    }
    //validate refresh token
    
    async validate(req:Request,payload: {id:string,email:string}){
        console.log('refresh token payload',payload)
        console.log(req.get('Authorization'))
        const authHeader=req.get('Authorization')
        if(!authHeader){
            console.log('Authorization header not found');
            throw new UnauthorizedException('Authorization header not found');
        }
        const refreshToken = authHeader.replace('Bearer','').trim();
        console.log('refresh token',refreshToken)
        if(!refreshToken){
            console.log('Refresh token not found');
            throw new UnauthorizedException('Refresh token not found');
        }

const user =await this.prisma.user.findUnique({
    where:{id:payload.id},
    select:{
        id:true,
        email:true,
        role:true,
        refreshToken:true,
    }
})
if(!user){
    throw new UnauthorizedException();
}
 
const refreshTokenMatch = await bcrypt.compare(refreshToken,user.refreshToken);
if(!refreshTokenMatch){
    throw new UnauthorizedException('Invalid refresh token');
}

return{
    id:user.id,
    email:user.email,
    role:user.role,
    
}

         
    }
}