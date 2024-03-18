import { model, Schema } from 'mongoose';
import { TProduct } from './product';
import { TImage } from './image';
import { TBanner } from './banner';

export type TBrand = {
	_id: string;
	name: string;
	products: TProduct[];
	createdAt: Date;
	image: TImage | null;
	banner?: TBanner | null;
};

const BrandSchema = new Schema<TBrand>({
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
	banner: {
		type: Schema.Types.ObjectId,
		ref: 'Banner',
	},
	createdAt: Date,
});

const Brand = model<TBrand>('Brand', BrandSchema);

export default Brand;
