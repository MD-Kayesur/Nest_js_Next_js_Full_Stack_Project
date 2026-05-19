import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dto/uesr-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) { }

//get user profile by id
async getMe(userId: string): Promise<UserResponseDto> {
    return this.findOne(userId);
}

//find single user by id
async findOne(userId: string): Promise<UserResponseDto> {
    const user = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            phoneNumber: true,
            address: true,
            bio: true,
            profileImage: true,
            createdAt: true,
            updatedAt: true,
        }
    });
     if(!user){
        throw new NotFoundException('User not found');
     }
     return user;
}

//get all users
async findAll():Promise<UserResponseDto[]>{
  return await this.prismaService.user.findMany({
    select:{
        id:true,
        email:true,
        firstName:true,
        lastName:true,
        role:true,
        phoneNumber:true,
        address:true,
        bio:true,
        profileImage:true,
        createdAt:true,
        updatedAt:true,
    },
    orderBy:{
        createdAt: 'desc',
    }
  });
}

//update user profile
async update(id: string, currentUserId: string, body: UpdateUserDto) {
    const user = await this.prismaService.user.findUnique({
        where: { id: currentUserId },
    });
    if (!user) {
        throw new NotFoundException('User not found');
    }
    if (user.id !== id && user.role !== 'ADMIN') {
        throw new UnauthorizedException('Unauthorized');
    }
    return this.prismaService.user.update({
        where: { id },
        data: body,
    });
}
}
