import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FilterProductDTO } from './dto/filter-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('product')
export default class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  async getProducts(@Query() filterProductDTO?: FilterProductDTO | null) {
    if (Object.keys(filterProductDTO).length) {
      const filteredProducts =
        await this.productService.getFilteredProducts(filterProductDTO);
      return filteredProducts;
    } else {
      const allProducts = await this.productService.getAllProducts();
      return allProducts;
    }
  }

  @Get('/:id')
  async getProduct(@Param('id') id: string) {
    const product = await this.productService.getProduct(id);
    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }

  @Post('/')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/img',
        filename: (req, file, cb) => {
          const uniqueFilename = `${Date.now()}${extname(file.originalname)}`;
          cb(null, uniqueFilename);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  async addProduct(
    @Body() createProductDTO: CreateProductDto,
    @UploadedFile(
      'file',
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const product = await this.productService.addProduct(
      createProductDTO,
      file,
    );
    return product;
  }

  // @Post('/image')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: 'public/img',
  //       filename: (req, file, cb) => {
  //         cb(null, file.originalname);
  //       },
  //     }),
  //   }),
  // )
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   required: true,
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // async uploadProduct(
  //   @UploadedFile(
  //     'file',
  //     new ParseFilePipe({
  //       validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  // }

  @Put('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() createProductDTO: CreateProductDto,
  ) {
    const product = await this.productService.updateProduct(
      id,
      createProductDTO,
    );
    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    const product = await this.productService.deleteProduct(id);
    if (!product) throw new NotFoundException('Product does not exist');
    return product;
  }
}
