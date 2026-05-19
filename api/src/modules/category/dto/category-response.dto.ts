//dto for category response
import { ApiProperty } from "@nestjs/swagger";
export class CategoryResponseDto {

    @ApiProperty({
        description: 'Category ID',
        example: '1',
    })
    id: string;
    @ApiProperty({
        description: 'Category Name',
        example: 'Electronics',
    })
    name: string;
    @ApiProperty({
        description: 'Category Description',
        example: 'Category Description',
    })
    description: string;
}
