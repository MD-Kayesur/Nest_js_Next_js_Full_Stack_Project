//dto for change password

import { ApiParam, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class ChangePasswordDto{

    @ApiProperty({
        description: 'New Password for the user',
        example: 'StrongPass123!',
    })
    @IsString()
    @IsNotEmpty({message:'Current Password is required'})
    currentPassword:string;

    @ApiProperty({
        description: 'New Password for the user',
        example: 'StrongPass123!',
        minLength:6,
    })
    @IsString()
    @IsNotEmpty({message:'New Password is required'})
    @MinLength(6)
    @IsStrongPassword({minLength:6,minLowercase:1,minUppercase:1,minNumbers:1,minSymbols:1})
    newPassword:string;

    @ApiProperty({
        description: 'New Password for the user',
        example: 'StrongPass123!',
    })
    @IsString()
    @IsNotEmpty()
    confirmPassword:string;
}