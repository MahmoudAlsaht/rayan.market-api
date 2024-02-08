import { model, Schema } from 'mongoose';
import Image, { TImage } from './image';

export type TBanner = {
	_id: string;
	name: string;
	bannerImages?: TImage[] | null;
	createdAt: Date;
	active: boolean;
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
	active: {
		type: Boolean,
		default: false,
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
