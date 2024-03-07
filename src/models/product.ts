import { model, Schema } from 'mongoose';
import Image, { TImage } from './image';
import { TCategory } from './category';
import { TBrand } from './brand';

export type TProduct = {
	_id: string;
	name: string;
	productImage?: TImage | null;
	createdAt: Date;
	lastModified: Date;
	price: number;
	newPrice?: number;
	quantity: number;
	category: TCategory;
	brand: TBrand;
	isOffer?: boolean;
	offerExpiresDate?: number;
	remaining?: number;
};

const ProductSchema = new Schema<TProduct>({
	name: {
		type: 'string',
		required: true,
	},
	productImage: {
		type: Schema.Types.ObjectId,
		ref: 'Image',
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
	},
	brand: {
		type: Schema.Types.ObjectId,
		ref: 'Brand',
	},
	createdAt: Date,
	lastModified: Date,
	price: {
		type: Number,
		required: true,
	},
	newPrice: Number,
	quantity: { type: Number, required: true },
	isOffer: { type: Boolean, default: false },
	offerExpiresDate: { type: Number, default: 0 },
	remaining: Number,
});

const Product = model<TProduct>('Product', ProductSchema);

ProductSchema.pre(
	'deleteOne',
	{ document: true, query: false },
	async function () {
		await Image.deleteOne({
			_id: {
				$in: this.productImage,
			},
		});
	},
);

export default Product;
