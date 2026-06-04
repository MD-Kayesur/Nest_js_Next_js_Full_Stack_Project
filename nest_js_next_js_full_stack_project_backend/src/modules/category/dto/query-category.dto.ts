import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from "class-validator";

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
        example: 10,
        description: 'Limit',
        default: 10,
        minimum: 1
    })
    @Type(()=>Number)
    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?:number;

    @ApiPropertyOptional({
        example: 1,
        description: 'Page',
        default: 1,
        minimum: 1
    })
    @Type(()=>Number)
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?:number;

    @ApiPropertyOptional({
        example: 'electronics',
        description: 'Search string',
    })
    @IsOptional()
    @IsString()
    search?:string;


}