import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @HttpCode(201)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createNewProduct(createProductDto);
  }

  @HttpCode(200)
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.productsService.getAllProducts(query);
  }

  @HttpCode(200)
  @Get('/name/:name')
  findOne(@Param('name') name: string) {
    return this.productsService.getProductByName(name);
  }

  @HttpCode(200)
  @Get('/id/:id')
  findOneById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @HttpCode(204)
  @Patch('prices/update')
  updateAll() {
    return this.productsService.updateProductsPrices();
  }

  @HttpCode(200)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  @Post('import-excel')
  uploadExcel(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({
            fileType:
              /^(application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|application\/vnd\.ms-excel|text\/csv)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.productsService.importProductsFromExcel(file);
  }
}
