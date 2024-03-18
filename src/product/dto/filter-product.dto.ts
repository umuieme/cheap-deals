import { ApiProperty } from '@nestjs/swagger';

export class FilterProductDTO {
  @ApiProperty({ required: false })
  search?: string | null;
  @ApiProperty({ required: false })
  category?: string;
}
