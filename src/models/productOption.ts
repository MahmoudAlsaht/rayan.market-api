import { model, Schema } from 'mongoose';
import { TProduct } from './product';

export type TProductOption = {
	_id: string;
	type: string;
	optionName: string;
	price?: number | null;
	quantity?: number | null;
	product: TProduct;
};

const ProductOptionSchema = new Schema<TProductOption>({
	type: {
		type: String,
		required: true,
	},
	optionName: String,
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
	},
	price: {
		type: Number,
	},
	quantity: { type: Number },
});

const ProductOption = model<TProductOption>(
	'ProductOption',
	ProductOptionSchema,
);

export default ProductOption;
