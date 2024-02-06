import { model, Schema } from 'mongoose';

export type TImage = {
	id: string;
	filename: string;
	path: string;
	imageType: string;
	doc?: any;
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
