import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
 

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) { }

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
    return user;
}
}
