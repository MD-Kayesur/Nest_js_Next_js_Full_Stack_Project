import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'User email',
        required: false
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({
        example: 'John',
        description: 'User first name',
        required: false
    })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({
        example: 'Doe',
        description: 'User last name',
        required: false
    })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({
        example: 'https://example.com/profile.jpg',
        description: 'User profile image',
        required: false
    })
    @IsOptional()
    @IsString()
    profileImage?: string;

    @ApiProperty({
        example: 'Software Developer',
        description: 'User biography',
        required: false
    })
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiProperty({
        example: '123 Main St',
        description: 'User address',
        required: false
    })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({
        example: '+1234567890',
        description: 'User phone number',
        required: false
    })
    @IsOptional()
    @IsString()
    phoneNumber?: string;
}