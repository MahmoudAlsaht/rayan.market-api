"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDistrict = exports.updateDistrict = exports.getDistrict = exports.createDistrict = exports.getDistricts = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const district_1 = __importDefault(require("../models/district"));
const utils_1 = require("../utils");
const getDistricts = async (req, res, next) => {
    try {
        const districts = await district_1.default.find();
        res.status(200).send(districts);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.getDistricts = getDistricts;
const createDistrict = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { name, shippingFees } = req.body;
        const district = new district_1.default({
            name,
            shippingFees: shippingFees || '2',
        });
        await district.save();
        res.status(200).send(district);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.createDistrict = createDistrict;
const getDistrict = async (req, res, next) => {
    try {
        const { district_id } = req.params;
        const district = await district_1.default.findById(district_id);
        res.status(200).send(district);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.getDistrict = getDistrict;
const updateDistrict = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { district_id } = req.params;
        const { name, shippingFees } = req.body;
        const district = await district_1.default.findById(district_id);
        if (name)
            district.name = name;
        if (shippingFees)
            district.shippingFees = shippingFees;
        await district.save();
        res.status(200).send(district);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.updateDistrict = updateDistrict;
const deleteDistrict = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { district_id } = req.params;
        await district_1.default.findByIdAndDelete(district_id);
        res.status(200).send(district_id);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.deleteDistrict = deleteDistrict;
//# sourceMappingURL=district.js.map