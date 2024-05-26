"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.updateContact = exports.getContact = exports.createContact = exports.getContacts = void 0;
const expressError_1 = __importDefault(require("../middlewares/expressError"));
const profile_1 = __importDefault(require("../models/profile"));
const contact_1 = __importDefault(require("../models/contact"));
const district_1 = __importDefault(require("../models/district"));
const utils_1 = require("../utils");
const getContacts = async (req, res, next) => {
    try {
        const { profile_id } = req.params;
        const profile = await profile_1.default.findById(profile_id).populate({
            path: 'contacts',
            populate: { path: 'district' },
        });
        res.status(200).send(profile?.contacts);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
};
exports.getContacts = getContacts;
const createContact = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAuthenticated)(user))
            throw new Error('YOU ARE NOT A USER');
        const { profile_id } = req.params;
        const { district, contactNumber } = req.body;
        const profile = await profile_1.default.findById(profile_id);
        const foundDistrict = await district_1.default.findById(district);
        const contact = await new contact_1.default({
            district: foundDistrict,
            contactNumber,
            profile,
        });
        profile.contacts.push(contact);
        await profile.save();
        await contact.save();
        res.status(200).send(contact);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
    }
};
exports.createContact = createContact;
const getContact = async (req, res, next) => {
    try {
        const { contact_id } = req.params;
        const contact = await contact_1.default.findById(contact_id).populate('district');
        res.status(200).send(contact);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
};
exports.getContact = getContact;
const updateContact = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAuthenticated)(user))
            throw new Error('YOU ARE NOT A USER');
        const { contact_id } = req.params;
        const { district, contactNumber } = req.body;
        const contact = await contact_1.default.findById(contact_id);
        if (district)
            contact.district = district;
        if (contactNumber)
            contact.contactNumber = contactNumber;
        await contact.save();
        res.status(200).send(contact);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
};
exports.updateContact = updateContact;
const deleteContact = async (req, res, next) => {
    try {
        const { user } = req;
        if (!(0, utils_1.isAuthenticated)(user))
            throw new Error('YOU ARE NOT A USER');
        const { profile_id, contact_id } = req.params;
        const profile = await profile_1.default.findById(profile_id);
        const contact = await contact_1.default.findById(contact_id);
        await profile.updateOne({
            $pull: { contacts: contact_id },
        });
        await profile.save();
        await contact.deleteOne();
        res.status(200).send(contact_id);
    }
    catch (e) {
        next(new expressError_1.default(e.message, 404));
        res.status(404);
    }
};
exports.deleteContact = deleteContact;
//# sourceMappingURL=contact.js.map