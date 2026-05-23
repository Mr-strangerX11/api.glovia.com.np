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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAddressWithGeoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AddAddressWithGeoDto {
}
exports.AddAddressWithGeoDto = AddAddressWithGeoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddAddressWithGeoDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+9779812345678' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddAddressWithGeoDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bagmati' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddAddressWithGeoDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kathmandu' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddAddressWithGeoDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kathmandu Metropolitan' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddAddressWithGeoDto.prototype, "municipality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddAddressWithGeoDto.prototype, "wardNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Thamel' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddAddressWithGeoDto.prototype, "area", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'Near Kathmandu Guest House' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddAddressWithGeoDto.prototype, "landmark", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 27.7172 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-90),
    (0, class_validator_1.Max)(90),
    __metadata("design:type", Number)
], AddAddressWithGeoDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 85.324 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-180),
    (0, class_validator_1.Max)(180),
    __metadata("design:type", Number)
], AddAddressWithGeoDto.prototype, "longitude", void 0);
//# sourceMappingURL=add-address-geo.dto.js.map