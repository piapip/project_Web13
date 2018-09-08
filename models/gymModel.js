const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PTSchema = new Schema({
    name: { type: String, required: true },
    profile: { type: String },
    imgUrl: { type: String }
})                                              

const GymSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    address: { type: String, required: true },
    imgUrl: { type: [String], default: [] },
    price: { type: [String], required: true },
    PT: { type: [PTSchema], default: [] },
    diadiem: { type: Schema.Types.ObjectId, ref: "DiaDiem", required: true }         //VD ha noi, da nang
});

module.exports = mongoose.model("Gym", GymSchema);