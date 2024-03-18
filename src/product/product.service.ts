import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FilterProductDTO } from './dto/filter-product.dto';
import { Product, ProductDocument } from './product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async getFilteredProducts(
    filterProductDTO: FilterProductDTO,
  ): Promise<Product[]> {
    const { category, search } = filterProductDTO;
    let products = await this.getAllProducts();

    if (search) {
      products = products.filter(
        (product) =>
          product.name.includes(search) || product.description.includes(search),
      );
    }

    if (category) {
      products = products.filter((product) => product.category === category);
    }

    return products;
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
    products.map((product) => this.productImageUrl(product));
    return products;
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    return product;
  }

  async addProduct(
    createProductDTO: CreateProductDto,
    file: Express.Multer.File,
  ): Promise<Product> {
    createProductDTO.image = file.filename;
    const newProduct = await this.productModel.create(createProductDTO);
    return this.productImageUrl(await newProduct.save());
  }

  async productImageUrl(product: Product) {
    product.image = `http://localhost:3000/public/img/${product.image}`;
    return product;
  }

  async updateProduct(
    id: string,
    createProductDTO: CreateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      createProductDTO,
      { new: true },
    );
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<any> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id);
    return deletedProduct;
  }
}
