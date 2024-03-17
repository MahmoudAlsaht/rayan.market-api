import { model, Schema } from 'mongoose';
import Image, { TImage } from './image';
import { TCategory } from './category';
import { TBrand } from './brand';

export type TBanner = {
	_id: string;
	name: string;
	bannerImages?: TImage[] | null;
	createdAt: Date;
	bannerType?: string;
	doc?: TCategory | TBrand;
};

const BannerSchema = new Schema<TBanner>({
	name: {
		type: 'string',
		required: true,
	},
	bannerImages: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Image',
		},
	],
	createdAt: {
		type: Date,
		required: true,
	},
	bannerType: {
		type: String,
		default: 'normal',
	},
	doc: {
		type: Schema.Types.ObjectId,
		ref: function () {
			return this.bannerType === 'brand'
				? 'Brand'
				: this.bannerType === 'category'
				? 'Category'
				: null;
		},
	},
});

const Banner = model<TBanner>('Banner', BannerSchema);

BannerSchema.pre(
	'deleteOne',
	{ document: true, query: false },
	async function () {
		await Image.deleteMany({
			_id: {
				$in: this.bannerImages,
			},
		});
	},
);

export default Banner;
