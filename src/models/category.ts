import { model, Schema } from 'mongoose';

export type TCategory = {
	id: string;
	name: string;
	products?: string[];
	createdAt: Date;
};

const CategorySchema = new Schema<TCategory>({
	name: {
		type: 'string',
		required: true,
		unique: true,
	},
	// products: [{}]
	createdAt: Date,
});

const Category = model<TCategory>('Category', CategorySchema);

export default Category;
