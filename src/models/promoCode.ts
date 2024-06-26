import { Schema, model } from 'mongoose';

export type TPromoCode = {
	_id: string;
	promoType: string;
	code: string;
	discount: number;
	expired: boolean;
	startDate: string | null;
	endDate: string | null;
};

const PromoSchema = new Schema<TPromoCode>({
	code: { type: String, unique: true },
	discount: Number,
	expired: { type: Boolean, default: false },
	promoType: { type: String, default: 'product' },
	startDate: String,
	endDate: String,
});

const PromoCode = model<TPromoCode>('PromoCode', PromoSchema);

export default PromoCode;
