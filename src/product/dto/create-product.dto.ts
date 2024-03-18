import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  category: string;
  @ApiProperty()
  // @ApiProperty({ type: 'string', format: 'binary', required: true })
  // file: Express.Multer.File;
  image: string;
}
