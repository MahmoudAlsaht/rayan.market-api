import { model, Schema } from 'mongoose';
import { TProduct } from './product';

export type TCategory = {
	_id: string;
	name: string;
	products?: TProduct[];
	createdAt: Date;
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
	createdAt: Date,
});

const Category = model<TCategory>('Category', CategorySchema);

export default Category;
