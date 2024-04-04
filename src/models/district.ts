import { Schema, model } from 'mongoose';

export type TDistrict = {
	_id: string;
	name: string;
	shippingFees: number;
};

const DistrictSchema = new Schema<TDistrict>({
	name: { type: String, unique: true },
	shippingFees: { type: Number, default: 2 },
});

const District = model<TDistrict>('District', DistrictSchema);

export default District;
