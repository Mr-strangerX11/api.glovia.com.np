"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv_1 = require("dotenv");
const user_schema_1 = require("../database/schemas/user.schema");
(0, dotenv_1.config)();
async function createAdmin() {
    const mongoUri = process.env.DATABASE_URL;
    if (!mongoUri) {
        throw new Error('DATABASE_URL is not set');
    }
    await mongoose.connect(mongoUri);
    const UserModel = mongoose.model('User', user_schema_1.UserSchema);
    const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@glovia.com.np';
    const password = process.env.DEFAULT_ADMIN_PASSWORD || 'AdminPass123!';
    const existing = await UserModel.findOne({ email }).lean();
    const hashedPassword = await bcrypt.hash(password, 10);
    if (existing) {
        await UserModel.findByIdAndUpdate(existing._id, {
            password: hashedPassword,
            role: user_schema_1.UserRole.SUPER_ADMIN,
            isEmailVerified: true,
            isPhoneVerified: true,
        });
        console.log('Admin user updated');
    }
    else {
        await UserModel.create({
            email,
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: user_schema_1.UserRole.SUPER_ADMIN,
            isEmailVerified: true,
            isPhoneVerified: true,
        });
        console.log('Admin user created');
    }
    await mongoose.disconnect();
}
createAdmin().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=create-admin.js.map