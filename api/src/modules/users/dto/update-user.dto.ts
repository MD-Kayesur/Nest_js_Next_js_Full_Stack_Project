import { ApiProperty } from "@nestjs/swagger"

export class UpdateUserDto {
    @ApiProperty({
        example:'[EMAIL_ADDRESS]',
        description:'User email',
        required:false
    })
 email?:string
 @ApiProperty({
    example:'John',
    description:'User first name',
    required:false
 })
 firstName?:string
 @ApiProperty({
    example:'Doe',
    description:'User last name',
    required:false
 })
 lastName?:string
 @ApiProperty({
    example:'https://example.com/profile.jpg',
    description:'User profile image',
    required:false
 })
 profileImage?:string
 @ApiProperty({
    example:'1234567890',
    description:'User phone number',
    required:false
 })
 bio?:string
 
   
}