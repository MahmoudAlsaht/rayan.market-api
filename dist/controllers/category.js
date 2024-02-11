"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryProducts = exports.getCategory = exports.getCategories = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const category_1 = __importDefault(require("../models/category"));
const getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_1.default.find();
        res.status(200).send(categories);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.getCategories = getCategories;
const getCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category_id } = req.params;
        const category = yield category_1.default.findById(category_id);
        res.status(200).send(category);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.getCategory = getCategory;
const getCategoryProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category_id } = req.params;
        const category = yield category_1.default.findById(category_id).populate('products');
        res.status(200).send(category === null || category === void 0 ? void 0 : category.products);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.getCategoryProducts = getCategoryProducts;
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const category = yield new category_1.default({
            name,
            createdAt: new Date(),
        });
        yield category.save();
        res.status(200).send(category);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const { category_id } = req.params;
        const category = yield category_1.default.findById(category_id);
        if (name && (name === null || name === void 0 ? void 0 : name.length) > 0)
            category.name = name;
        yield category.save();
        res.status(200).send(category);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const { category_id } = req.params;
        const category = yield category_1.default.findById(category_id);
        yield category.deleteOne();
        res.sendStatus(200);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(400);
    }
});
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.js.map