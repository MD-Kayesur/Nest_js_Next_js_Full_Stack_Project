import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { type } from "os";

//query category dto
export class QueryCategoryDto  {
     @ApiProperty({
        example: true,
        description: 'Category status',
        required:false,
        default:true
    }) 
    @Transform(({value}) => {
        if (value === 'true' || value === '1') return true;
        if (value === 'false' || value === '0') return undefined;
        
    
    
    })
    @IsBoolean()
    @IsOptional()
    isActive?:boolean;







@ApiPropertyOptional({
        example: '1',
        description: 'Category search',
        
        default:1,
        minimum:1
    })
    @IsString()
    @type(()=>number )
    @IsOptional()
@IsNumbe()
@Min(1)
@IsOptional()
limit:10;
page?:number;


    search?:string;


}