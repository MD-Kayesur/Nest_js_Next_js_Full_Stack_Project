import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
 
import { Prisma } from '@prisma/client';
 
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {


  constructor(
    private prisma: PrismaService,
  ) {}

  
  // create category
 async create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
  try {
    const { name, description, imageUrl, slug, isActive } = createCategoryDto;

    const categorySlug=slug ?? name.toLowerCase().split(' ').join('-');

    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    if (existingCategory) {
      throw new ConflictException('Category already exists '+categorySlug);
    }

    const category = await this.prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        imageUrl: imageUrl?.trim(),
        slug: categorySlug.trim(),
        isActive: isActive ?? true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        slug: true,
        isActive: true,
        products: {
          select: {
            id: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    const categoryResponse: CategoryResponseDto = {
      ...category,
      productCount: (category as any).products.length,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
    return categoryResponse;
  } catch (error) {
    throw error;
  }
 }




//get all categories
async findAll(queryDto:QueryCategoryDto):Promise<{data:CategoryResponseDto[] ,meta:{total:number,page:number,limit:number,totalPage:number}}>{
  const {page = 1, limit = 10, search, isActive}=queryDto;
 const where :Prisma.CategoryWhereInput={};

 if(isActive){
  where.isActive=isActive;
 }

if(search){
  where.OR=[{name:{contains:search,mode:'insensitive'}},{description:{contains:search,mode:'insensitive'}}];
}
const total =await this.prisma.category.count({where});
 
const categories= await this.prisma.category.findMany({
  where,
  skip:(page-1)*limit,
  take:limit,
  orderBy:{createdAt:'desc'},
  include:{
    _count:{
      select:{
        products:true,
      },
    },
  },
});

return {data:categories.map((category)=>this.formateCategory(category,category._count.products)),
  meta:{total,page,limit,totalPage:Math.ceil(total/limit)}}
}



//get category by id
async findOne(id: string): Promise<CategoryResponseDto> {
  try {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

return this.formateCategory(category,Number(category._count.products));
  } catch (error) {
    throw error;
  }
}


//get category by slug
async findBySlug(slug: string): Promise<CategoryResponseDto> {
  try {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

return this.formateCategory(category,Number(category._count.products));
}
catch (error) {
  throw error;
}
}


// update category
async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {

 const existingCategory = await this.prisma.category.findUnique({
  where: { id },
});

if(!existingCategory){
  throw new NotFoundException('Category not found');
}


if (updateCategoryDto.slug && updateCategoryDto.slug !== existingCategory.slug) {
  
const slugTaken=await this.prisma.category.findUnique({
  where:{slug:updateCategoryDto.slug},
});
if(slugTaken){
  throw new ConflictException(`Category slug already exists ${updateCategoryDto.slug} `);
}

}

const updatedCategory = await this.prisma.category.update({
  where: { id },
  data: updateCategoryDto,
  include: {
    _count: {
      select: {
        products: true,
      },
    },
  },
});

return this.formateCategory(updatedCategory,Number(updatedCategory._count.products));


}

// remove category
async remove(id: string): Promise<{ message: string }> {
  try {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
      include:{
        _count:{
          select:{
            products:true,
          },
        },
      },
    });

if(!existingCategory){
throw new NotFoundException("Category not found");
}
 
if(existingCategory._count.products>0){
  await this.prisma.product.deleteMany({
    where: { categoryId: id }
  });
}

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  } catch (error) {
    throw error;
  }
}






//format category response 
  private formateCategory(category: any,productCount?: number): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
      slug: category.slug,
      isActive: category.isActive,
      productCount: productCount ?? 0,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
}
}




