"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabel = exports.getLabels = exports.createLabel = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const label_1 = __importDefault(require("../models/label"));
const createLabel = async (req, res, next) => {
    try {
        const { labelValue } = req.body;
        let label;
        label =
            (await label_1.default.findOne({ value: labelValue })) ||
                new label_1.default({ value: labelValue });
        await label.save();
        res.status(200).send(label);
    }
    catch (e) {
        console.log(e.message);
        next(new expressError_1.default(e.message, 404));
    }
};
exports.createLabel = createLabel;
const getLabels = async (req, res, next) => {
    try {
        const labels = await label_1.default.find().populate({
            path: 'products',
            populate: 'productImage',
        });
        res.status(200).send(labels);
    }
    catch (e) {
        console.log(e.message);
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
        console.log(e.message);
        next(new expressError_1.default(e.message, 404));
    }
};
exports.getLabel = getLabel;
//# sourceMappingURL=label.js.map