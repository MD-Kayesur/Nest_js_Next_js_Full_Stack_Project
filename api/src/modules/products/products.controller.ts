import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-products.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from '@prisma/client';

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
        status:409,
        description:'Conflict',
    })
    @HttpCode(HttpStatus.OK)
    async create (@Body() createProductDto:CreateProductDto):Promise<ProductResponseDto>{
        return this.productsService.createProduct(createProductDto);
    }
}
