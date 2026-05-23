"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddVendorToProductsMigration = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../database/schemas/product.schema");
const user_schema_1 = require("../database/schemas/user.schema");
let AddVendorToProductsMigration = class AddVendorToProductsMigration {
    constructor(productModel, userModel) {
        this.productModel = productModel;
        this.userModel = userModel;
    }
    async migrate() {
        console.log('🔄 Starting migration: Add vendor info to products...\n');
        try {
            const productsWithoutVendor = await this.productModel.find({
                $or: [{ vendorId: { $exists: false } }, { vendorId: null }],
            });
            console.log(`📊 Found ${productsWithoutVendor.length} products without vendor information\n`);
            if (productsWithoutVendor.length === 0) {
                return {
                    success: 0,
                    failed: 0,
                    message: '✅ All products already have vendor information',
                };
            }
            const defaultVendor = await this.userModel
                .findOne({
                role: 'ADMIN',
            })
                .lean();
            if (!defaultVendor) {
                return {
                    success: 0,
                    failed: productsWithoutVendor.length,
                    message: '❌ No admin user found to assign as default vendor',
                };
            }
            console.log(`👤 Using admin user as default vendor:`);
            console.log(`   Name: ${defaultVendor.firstName} ${defaultVendor.lastName}`);
            console.log(`   Email: ${defaultVendor.email}\n`);
            const vendorName = `${defaultVendor.firstName} ${defaultVendor.lastName}`;
            const vendorEmail = defaultVendor.email;
            const vendorPhone = defaultVendor.phone || null;
            const updateResult = await this.productModel.updateMany({
                $or: [{ vendorId: { $exists: false } }, { vendorId: null }],
            }, {
                $set: {
                    vendorId: new mongoose_2.Types.ObjectId(defaultVendor._id),
                    vendorName,
                    vendorEmail,
                    vendorPhone,
                    uploadedBy: 'admin',
                    uploadedById: new mongoose_2.Types.ObjectId(defaultVendor._id),
                },
            });
            console.log(`✅ Migration Results:`);
            console.log(`   Updated: ${updateResult.modifiedCount} products`);
            console.log(`   Matched: ${updateResult.matchedCount} products\n`);
            const verifyNoVendor = await this.productModel.countDocuments({
                $or: [{ vendorId: { $exists: false } }, { vendorId: null }],
            });
            if (verifyNoVendor === 0) {
                console.log('✨ Migration completed successfully!');
                console.log('   All products now have vendor information\n');
                return {
                    success: updateResult.modifiedCount,
                    failed: 0,
                    message: '✅ Migration completed successfully',
                };
            }
            else {
                console.log(`⚠️  Warning: ${verifyNoVendor} products still missing vendor info\n`);
                return {
                    success: updateResult.modifiedCount,
                    failed: verifyNoVendor,
                    message: `⚠️  Migration partial: ${verifyNoVendor} products still missing vendor`,
                };
            }
        }
        catch (error) {
            console.error('❌ Migration failed:', error.message);
            throw error;
        }
    }
    async validate() {
        console.log('🔍 Validating vendor information consistency...\n');
        const products = await this.productModel.find().lean();
        const invalid = [];
        let validCount = 0;
        for (const product of products) {
            const issues = [];
            if (!product.vendorId) {
                issues.push('Missing vendorId');
            }
            if (!product.vendorName) {
                issues.push('Missing vendorName');
            }
            if (!product.vendorEmail) {
                issues.push('Missing vendorEmail');
            }
            if (issues.length > 0) {
                invalid.push({
                    productId: product._id,
                    name: product.name,
                    issues,
                });
            }
            else {
                validCount++;
            }
        }
        console.log(`✅ Valid: ${validCount} products`);
        console.log(`❌ Invalid: ${invalid.length} products`);
        if (invalid.length > 0) {
            console.log('\nInvalid products:');
            invalid.slice(0, 10).forEach((item) => {
                console.log(`  - ${item.name} (${item.productId}): ${item.issues.join(', ')}`);
            });
            if (invalid.length > 10) {
                console.log(`  ... and ${invalid.length - 10} more`);
            }
        }
        return {
            valid: validCount,
            invalid: invalid.length,
            details: invalid,
        };
    }
    async rollback() {
        console.log('⚠️  WARNING: This will remove vendor info from ALL products\n');
        console.log('Rolling back...\n');
        const result = await this.productModel.updateMany({}, {
            $set: {
                vendorId: null,
                vendorName: null,
                vendorEmail: null,
                vendorPhone: null,
            },
        });
        console.log(`✅ Rolled back ${result.modifiedCount} products\n`);
        return {
            rolled_back: result.modifiedCount,
            message: 'Rollback completed',
        };
    }
};
exports.AddVendorToProductsMigration = AddVendorToProductsMigration;
exports.AddVendorToProductsMigration = AddVendorToProductsMigration = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AddVendorToProductsMigration);
//# sourceMappingURL=add-vendor-to-products.migration.js.map