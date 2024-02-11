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
exports.deleteContact = exports.updateContact = exports.getContact = exports.createContact = exports.getContacts = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const profile_1 = __importDefault(require("../models/profile"));
const contact_1 = __importDefault(require("../models/contact"));
const getContacts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profile_id } = req.params;
        const profile = yield profile_1.default.findById(profile_id).populate('contacts');
        res.status(200).send(profile === null || profile === void 0 ? void 0 : profile.contacts);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.getContacts = getContacts;
const createContact = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profile_id } = req.params;
        const { city, street, contactNumber } = req.body;
        const profile = yield profile_1.default.findById(profile_id);
        const contact = yield new contact_1.default({
            address: { city, street },
            contactNumber,
            profile,
        });
        profile.contacts.push(contact);
        yield profile.save();
        yield contact.save();
        res.status(200).send(contact);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.createContact = createContact;
const getContact = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contact_id } = req.params;
        const contact = yield contact_1.default.findById(contact_id);
        res.status(200).send(contact);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.getContact = getContact;
const updateContact = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contact_id } = req.params;
        const { city, street, contactNumber } = req.body;
        const contact = yield contact_1.default.findById(contact_id);
        if (city)
            contact.address.city = city;
        if (street)
            contact.address.street = street;
        if (contactNumber)
            contact.contactNumber = contactNumber;
        yield contact.save();
        res.status(200).send(contact);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.updateContact = updateContact;
const deleteContact = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profile_id, contact_id } = req.params;
        const profile = yield profile_1.default.findById(profile_id);
        const contact = yield contact_1.default.findById(contact_id);
        yield profile.updateOne({
            $pull: { contacts: contact_id },
        });
        yield profile.save();
        yield contact.deleteOne();
        res.status(200).send(contact_id);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
});
exports.deleteContact = deleteContact;
//# sourceMappingURL=contact.js.map