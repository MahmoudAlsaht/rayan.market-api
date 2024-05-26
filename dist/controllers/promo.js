"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePromo = exports.updatePromo = exports.getPromo = exports.createPromo = exports.getPromos = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const promoCode_1 = __importDefault(require("../models/promoCode"));
const utils_1 = require("../utils");
const getPromos = async (req, res, next) => {
    try {
        const promos = await promoCode_1.default.find();
        const sendPromos = [];
        for (const promo of promos) {
            if (promo?.expired) {
                promo.expired = true;
                promo.startDate = null;
                promo.endDate = null;
                await promo.save();
            }
            if (!(0, utils_1.checkIfDateInBetween)(promo?.startDate, promo?.endDate)) {
                promo.expired = true;
                promo.startDate = null;
                promo.endDate = null;
                await promo.save();
            }
            sendPromos.push(promo);
        }
        res.status(200).json(sendPromos);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.getPromos = getPromos;
const createPromo = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { code, discount, startDate, endDate, promoType } = req.body;
        const promo = new promoCode_1.default({
            code,
            discount,
            startDate: startDate || null,
            endDate: endDate || null,
            promoType,
        });
        await promo.save();
        res.status(200).send(promo);
    }
    catch (e) {
        console.error(e);
        next(new expressError_1.default(e.message, 404));
    }
};
exports.createPromo = createPromo;
const getPromo = async (req, res, next) => {
    try {
        const { promoCode } = req.params;
        const promo = await promoCode_1.default.findOne({
            code: promoCode,
        });
        if (promo?.expired) {
            promo.startDate = null;
            promo.endDate = null;
            await promo.save();
        }
        if (!(0, utils_1.checkIfDateInBetween)(promo?.startDate, promo?.endDate)) {
            promo.expired = true;
            promo.startDate = null;
            promo.endDate = null;
            await promo.save();
        }
        res.status(200).send(promo);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.getPromo = getPromo;
const updatePromo = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { promo_id } = req.params;
        const { code, discount, startDate, endDate, expired } = req.body;
        const promo = await promoCode_1.default.findById(promo_id);
        promo.code = code;
        promo.discount = discount;
        promo.startDate = startDate || null;
        promo.endDate = endDate || null;
        promo.expired = expired;
        await promo.save();
        res.status(200).send(promo);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.updatePromo = updatePromo;
const deletePromo = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { promo_id } = req.params;
        await promoCode_1.default.findByIdAndDelete(promo_id);
        res.sendStatus(200);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.deletePromo = deletePromo;
//# sourceMappingURL=promo.js.map