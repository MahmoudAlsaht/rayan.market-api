import { Schema, model } from 'mongoose';

type TPromoCode = {
	_id: string;
	code: string;
	discount: number;
	expired: boolean;
	startDate: string | null;
	endDate: string | null;
};

const PromoSchema = new Schema<TPromoCode>({
	code: String,
	discount: Number,
	expired: { type: Boolean, default: false },
	startDate: String,
	endDate: String,
});

const PromoCode = model<TPromoCode>('PromoCode', PromoSchema);

export default PromoCode;
