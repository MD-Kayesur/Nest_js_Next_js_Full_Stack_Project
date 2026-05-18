import { IsEmail, IsNotEmpty, IsStrongPassword, isString, MinLength } from "class-validator";



export class loginDto{
   
    @IsEmail({message:'Please enter valid email address'})
    @IsNotEmpty({message:'Email is required'})
    email:string
   
    @isString()
    @IsNotEmpty()
    @MinLength(6)
    @IsStrongPassword({minLength:6,minLowercase:1,minUppercase:1,minNumbers:1,minSymbols:1})
    password:string;
}