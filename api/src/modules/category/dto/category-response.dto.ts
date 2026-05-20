//dto for category response
import { ApiProperty } from "@nestjs/swagger";
export class CategoryResponseDto {

    @ApiProperty({
        description: 'Category ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    id: string;
    @ApiProperty({
        description: 'Category Name',
        example: 'Electronics',
    })
    name: string;
    @ApiProperty({
        description: 'Category Description',
        example: 'This is a category description',
    })
    description: string;

    @ApiProperty({
        description: 'Category Image',
        example: 'Category Image',
    })
    imageUrl?: string;
    @ApiProperty({
        description: 'Category Slug',
        example: 'Category Slug',
    })
    slug?: string;
    @ApiProperty({
        description: 'Category Status',
        example: true,
    })
    isActive: boolean;

    @ApiProperty({
        description: 'Product Count',
        example: 10,
    })
    productCount:number;



    @ApiProperty({
        description: 'Category Created At',
        example: '2022-01-01T00:00:00.000Z',
    })
    createdAt: Date;
    @ApiProperty({
        description: 'Category Updated At',
        example: '2022-01-01T00:00:00.000Z',
    })
    updatedAt: Date;
}
