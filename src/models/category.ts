import { model, Schema } from 'mongoose';
import { TProduct } from './product';
import { TImage } from './image';

export type TCategory = {
	_id: string;
	name: string;
	products: TProduct[];
	createdAt: Date;
	image: TImage | null;
};

const CategorySchema = new Schema<TCategory>({
	name: {
		type: 'string',
		required: true,
		unique: true,
	},
	products: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Product',
		},
	],
	image: {
		type: Schema.Types.ObjectId,
		ref: 'Image',
	},
	createdAt: Date,
});

const Category = model<TCategory>('Category', CategorySchema);

export default Category;
