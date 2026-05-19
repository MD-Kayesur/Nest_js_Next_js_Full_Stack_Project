import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dto/uesr-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) { }

//get user profile by id
async getMe(userId: string) {
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

//find single user by id
async findOne(userId: string): Promise<UserResponseDto> {
    return this.getMe(userId);
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
async update(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.prismaService.user.findUnique({
        where: { id: userId },
    });
    if (!existingUser) {
        throw new NotFoundException('User not found');
    }

    if (updateUserDto?.email && updateUserDto.email !== existingUser.email) {
        const emailTaken = await this.prismaService.user.findUnique({
            where: { email: updateUserDto.email },
        });
        if (emailTaken) {
            throw new NotFoundException('Email already exists');
        }
    }

    //update user profile 
    const updateUser = await this.prismaService.user.update({
        where: { id: userId },
        data: updateUserDto,
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
        }
    });

    return updateUser;
}

//change password
async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{message:string}>{
    const {currentPassword, newPassword} = changePasswordDto;
    const user = await this.prismaService.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new NotFoundException('Invalid current password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prismaService.user.update({
        where: { id: userId },
        data: {
            password: hashedPassword,
        }
    });
    return {message:"Password changed successfully"};
}

async remove(userId: string): Promise<{message:string}>{
    const user = await this.prismaService.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new NotFoundException('User not found');
    }
    await this.prismaService.user.delete({
        where: { id: userId },
    });
    return {message:"User deleted successfully"};
}
}

























    // const updatedUser = await this.prismaService.user.update({
    //     where: { id: userId },
    //     data: {
    //         password: hashedPassword,
    //     },
    //     select: {
    //         id: true,
    //         email: true,
    //         firstName: true,
    //         lastName: true,
    //         role: true,

    //         createdAt: true,
    //         updatedAt: true,

    //         password: false,
    //     }
    // });
    // return updatedUser;
// }


