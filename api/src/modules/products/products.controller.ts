import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-products.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from '@prisma/client';
import { QueryCategoryDto } from '../category/dto/query-category.dto';
import { QueryProductDto } from './dto/query-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard(),RolesGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({summary:'Create product'})
    @ApiBody({
        type:CreateProductDto,
        description:'Product data'
    })
    @ApiResponse({
        status:201,
        description:'Product created successfully',
        type:ProductResponseDto,
    })
    @ApiResponse({
        status:400,
        description:'Invalid request',
    })
    @ApiResponse({
        status:500,
        description:'Internal server error',
    })
    @ApiResponse({
        status:401,
        description:'Unauthorized',
    })

    @ApiResponse({
        status:403,
        description:'Forbidden_ Admin role required',
    })
    @ApiResponse({
        status:409,
        description:'Conflict',
    })
    @HttpCode(HttpStatus.OK)
    async create (@Body() createProductDto:CreateProductDto):Promise<ProductResponseDto>{
        return await this.productsService.create(createProductDto);
    }



//get all product 

@Get()
@ApiOperation({summary:'Get all products'})
@ApiResponse({
    status:200,
    description: ' All Product list with pagination and filtering',
    schema:{
        
        type:"object",
        properties:{
            data:{
                type:"array",
                items:{
                    $ref:'#/components/schemas/ProductResponseDto'
                }
            },
             meta:{
                type:'object',
                properties:{
                    total:{
                        type:'number',
                       
                        description:'Total number of products'
                    },

                    page:{
                        type:'number',
                        description:'Current page'
                    },
                    limit:{
                        type:'number',
                        description:'Limit per page'
                    },
                    totalPages:{
                        type:'number',
                        description:'Total pages'
                    },
                }
             }
        },
    }
})




@ApiResponse({
    status:500,
    description:'Internal server error',
})
@HttpCode(HttpStatus.OK)
async findAll(@Query() queryDto:QueryProductDto){
    return await this.productsService.findAll(queryDto);
}



//get product by id

@Get(':id')
@ApiOperation({summary:'Get product by id'})
@ApiResponse({
    status:200,
    description:'Product found successfully',
    type:ProductResponseDto,
})
@ApiResponse({
    status:404,
    description:'Product not found',
})
@ApiResponse({
    status:500,
    description:'Internal server error',
})
@HttpCode(HttpStatus.OK)
async findOne (@Param('id') id:string):Promise<ProductResponseDto>{
    return await this.productsService.findOne(id);
}


//update a product

@Patch(':id')
@UseGuards(AuthGuard(),RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth('JWT-auth')
@ApiOperation({summary:'Update a product'})
@ApiBody({
    type:UpdateProductDto,
    description:'Product data',
})
@ApiResponse({
    status:200,
    description:'Product updated successfully',
    type:ProductResponseDto,
})
@ApiResponse({
    status:400,
    description:'Invalid request',
})
@ApiResponse({
    status:500,
    description:'Internal server error',
})
@ApiResponse({
    status:401,
    description:'Unauthorized',
})
@ApiResponse({
    status:403,
    description:'Forbidden_ Admin role required',
})
@ApiResponse({
    status:404,
    description:'Product not found',
})
@ApiResponse({
    status:409,
    description:'Conflict',
})
@HttpCode(HttpStatus.OK)
async update (@Param('id') id:string, @Body() updateProductDto:UpdateProductDto):Promise<ProductResponseDto>{
    return await this.productsService.update(id,updateProductDto);
}







}
