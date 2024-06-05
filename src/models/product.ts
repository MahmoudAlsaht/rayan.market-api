import { model, Schema } from 'mongoose';
import Image, { TImage } from './image';
import { TCategory } from './category';
import { TBrand } from './brand';
import { TLabel } from './label';
import { TProductOption } from './productOption';

export type TProduct = {
	_id: string;
	name: string;
	productImage?: TImage | null;
	createdAt: Date;
	lastModified: Date;
	price?: number | null;
	newPrice?: number | null;
	quantity?: number | null;
	category?: TCategory | null;
	brand?: TBrand | null;
	isOffer?: boolean;
	isEndDate?: boolean;
	offerExpiresDate?: number;
	startOfferDate?: string | null;
	endOfferDate?: string | null;
	remaining?: number;
	views: number;
	numberOfPurchases: number;
	labels?: TLabel[] | null;
	productType: string;
	productOptions?: TProductOption[] | null;
	description?: string | null;
};

const ProductSchema = new Schema<TProduct>({
	name: {
		type: String,
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
	price: Number,
	newPrice: Number,
	quantity: { type: Number, required: true },
	isOffer: { type: Boolean, default: false },
	isEndDate: { type: Boolean, default: false },
	offerExpiresDate: { type: Number, default: 0 },
	startOfferDate: String,
	endOfferDate: String,
	remaining: Number,
	views: { type: Number, default: 0 },
	numberOfPurchases: { type: Number, default: 0 },
	labels: [{ type: Schema.Types.ObjectId, ref: 'Label' }],
	productType: { type: String, default: 'normal' },
	productOptions: [
		{
			type: Schema.Types.ObjectId,
			ref: 'ProductOption',
		},
	],
	description: String,
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
