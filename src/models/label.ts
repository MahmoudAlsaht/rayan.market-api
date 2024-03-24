import { model, Schema } from 'mongoose';
import { TProduct } from './product';

export type TLabel = {
	_id: string;
	value: string;
	products: TProduct[] | null;
};

const LabelSchema = new Schema<TLabel>({
	value: { type: String, unique: true },
	products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

const Label = model<TLabel>('Label', LabelSchema);

export default Label;
