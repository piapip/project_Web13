const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    sdt: { type: String },
    password: { type: String, required: true },
    gymJoin: {
        gymID: { type: Schema.Types.ObjectId, ref: "Gym" },
        active: { type: Boolean, default: false } 
    },
    chosenPT: {
        PT: { type: Schema.Types.ObjectId, refPath: "gymJoin.PT" },
        active: { type: Boolean, default: false }
    }
}, {
        timestamps: true
    });

UserSchema.pre("save", function (next) {
    bcrypt
        .genSalt(12)
        .then(salt => bcrypt.hash(this.password, salt))
        .then(hash => {
            this.password = hash;
            next()
        })
        .catch(err => next(err));
})

module.exports = mongoose.model("User", UserSchema);