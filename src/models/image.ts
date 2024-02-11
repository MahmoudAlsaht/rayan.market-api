import { model, Schema } from 'mongoose';
import { TProfile } from './profile';
import { TProduct } from './product';
import { TBanner } from './banner';

export type TImage = {
	_id: string;
	filename: string;
	path: string;
	imageType: string;
	doc?: TProfile | TProduct | TBanner;
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
			return this.imageType === 'profileImage'
				? 'Profile'
				: this.imageType === 'productImage'
				? 'Product'
				: 'Banner';
		},
	},
});

const Image = model<TImage>('Image', ImageSchema);

export default Image;
