const mongoose = require('mongoose');


const otpSchema = mongoose.Schema({
    email: { type: String, require: true },
    otp: { type: String, require: true },
    purpose: { type: String, enum: ['emailVerification', 'passwordReset'], default: 'emailVerification' },
    expireAt: { type: Date, require: true }
}, { timestamps: true });

otpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Otp", otpSchema);