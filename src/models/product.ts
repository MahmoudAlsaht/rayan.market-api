import { model, Schema } from 'mongoose';
import Image, { TImage } from './image';
import { TCategory } from './category';

export type TProduct = {
	_id: string;
	name: string;
	productImages?: TImage[] | null;
	createdAt: Date;
	price: number;
	newPrice?: number;
	quantity: number;
	category: TCategory;
	isOffer?: boolean;
};

const ProductSchema = new Schema<TProduct>({
	name: {
		type: 'string',
		required: true,
	},
	productImages: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Image',
		},
	],
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
	},
	createdAt: {
		type: Date,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	newPrice: Number,
	quantity: { type: Number, required: true },
	isOffer: { type: Boolean, default: false },
});

const Product = model<TProduct>('Product', ProductSchema);

ProductSchema.pre(
	'deleteOne',
	{ document: true, query: false },
	async function () {
		await Image.deleteMany({
			_id: {
				$in: this.productImages,
			},
		});
	},
);

export default Product;
