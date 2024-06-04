import { model, Schema } from 'mongoose';
import { TProduct } from './product';
import { TBanner } from './banner';

export type TImage = {
	_id: string;
	filename: string;
	path: string;
	imageType: string;
	doc?: TProduct | TBanner;
	link?: string;
	showForMobile?: boolean;
};

const ImageSchema = new Schema<TImage>({
	filename: {
		type: String,
		required: true,
	},
	path: {
		type: String,
		required: true,
	},
	imageType: {
		type: String,
		required: true,
	},
	doc: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: function () {
			return this.imageType === 'productImage'
				? 'Product'
				: this.imageType === 'bannerImage'
				? 'Banner'
				: this.imageType === 'CategoryImage'
				? 'Category'
				: this.imageType === 'BrandImage' && 'Brand';
		},
	},
	link: String,
	showForMobile: { type: Boolean, default: false },
});

const Image = model<TImage>('Image', ImageSchema);

export default Image;
