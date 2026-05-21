import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-products.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()


export class ProductsService {

    createProduct(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
        
        
        
        throw new Error('Method not implemented.');
    }
}
