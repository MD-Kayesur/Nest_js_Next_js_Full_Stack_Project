import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword, IsString, MinLength } from "class-validator";



export class loginDto{
   
    @ApiProperty({
        example: 'marco@example.com',
        description: 'Please enter valid email address',
    })
    @IsEmail({}, {message:'Please enter valid email address'})
    @IsNotEmpty({message:'Email is required'})
    email:string
   
    @ApiProperty({
        example: 'StrongPass123!',
        description: 'The password of the user',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @IsStrongPassword({minLength:6,minLowercase:1,minUppercase:1,minNumbers:1,minSymbols:1})
    password:string;
}