"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabel = exports.getLabels = exports.createLabel = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const label_1 = __importDefault(require("../models/label"));
const utils_1 = require("../utils");
const createLabel = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const { labelValue } = req.body;
        let label;
        label =
            (await label_1.default.findOne({ value: labelValue })) ||
                new label_1.default({ value: labelValue });
        await label.save();
        res.status(200).send(label);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.createLabel = createLabel;
const getLabels = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAdmin)(user) || !(0, utils_1.isEditor)(user))
            throw new Error('YOU ARE NOT AUTHORIZED');
        const labels = await label_1.default.find().populate({
            path: 'products',
            populate: 'productImage',
        });
        res.status(200).send(labels);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.getLabels = getLabels;
const getLabel = async (req, res, next) => {
    try {
        const { label_id } = req.params;
        const label = await label_1.default.findById(label_id).populate({
            path: 'products',
            populate: 'productImage',
        });
        res.status(200).send(label);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.getLabel = getLabel;
//# sourceMappingURL=label.js.map