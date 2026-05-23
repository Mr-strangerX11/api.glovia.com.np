"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorGroupingService = void 0;
const common_1 = require("@nestjs/common");
let VendorGroupingService = class VendorGroupingService {
    groupOrdersByVendor(orderItems) {
        const vendorGroups = {};
        orderItems.forEach((item) => {
            const vendorId = item.vendorId?.toString() || item.vendorId;
            if (!vendorGroups[vendorId]) {
                vendorGroups[vendorId] = {
                    vendorId,
                    vendorName: item.vendorName,
                    vendorEmail: item.vendorEmail,
                    vendorPhone: item.vendorPhone,
                    items: [],
                    vendorSubtotal: 0,
                };
            }
            vendorGroups[vendorId].items.push(item);
            vendorGroups[vendorId].vendorSubtotal += item.total || 0;
        });
        return vendorGroups;
    }
    getUniqueVendors(orderItems) {
        const vendorMap = new Map();
        orderItems.forEach((item) => {
            const vendorId = item.vendorId?.toString() || item.vendorId;
            if (!vendorMap.has(vendorId)) {
                vendorMap.set(vendorId, {
                    vendorId,
                    vendorName: item.vendorName,
                    vendorEmail: item.vendorEmail,
                    vendorPhone: item.vendorPhone,
                });
            }
        });
        return Array.from(vendorMap.values());
    }
    filterItemsByVendor(orderItems, vendorId) {
        return orderItems.filter((item) => {
            const itemVendorId = item.vendorId?.toString() || item.vendorId;
            return itemVendorId === vendorId;
        });
    }
    calculateVendorTotal(items) {
        return items.reduce((total, item) => total + (item.total || 0), 0);
    }
};
exports.VendorGroupingService = VendorGroupingService;
exports.VendorGroupingService = VendorGroupingService = __decorate([
    (0, common_1.Injectable)()
], VendorGroupingService);
//# sourceMappingURL=vendor-grouping.service.js.map