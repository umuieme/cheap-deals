import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

export type ItemDocument = Item & Document;

export class Item {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Product' })
  productId: string;
  @Prop()
  name: string;
  @Prop()
  quantity: number;
  @Prop()
  price: number;
  @Prop()
  subTotalPrice: number;
}
export const ItemSchema = SchemaFactory.createForClass(Item);
