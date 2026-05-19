//dto for user response

import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

export class UserResponseDto {
    @ApiProperty({description:"User id",example:"123e4567-e89b-12d3-a456-426614174000"})
    id:string;
    @ApiProperty({description:"User email",example:"[EMAIL_ADDRESS]"})
    email:string;
    @ApiProperty({description:"User role",example:"USER"})
    role:Role;
    @ApiProperty({description:"User first name",example:"John"})
    firstName:string|null;
    @ApiProperty({description:"User last name",example:"Doe"})
    lastName:string|null;
    @ApiProperty({description:"User phone number",example:"1234567890"})
    phoneNumber:string|null;
    @ApiProperty({description:"User address",example:"123 Main St, Anytown, USA"})
    address:string|null;
    @ApiProperty({description:"User bio",example:"User bio"})
    bio:string|null;
    @ApiProperty({description:"User profile image",example:"profileImage.jpg"})
    profileImage:string|null;
    @ApiProperty({description:"User created at",example:"2022-01-01T00:00:00.000Z"})
    createdAt:Date;
    @ApiProperty({description:"User updated at",example:"2022-01-01T00:00:00.000Z"})
    updatedAt:Date;
}