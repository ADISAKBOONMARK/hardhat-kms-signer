"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHexString = void 0;
function toHexString(value) {
    if (value === undefined) {
        return;
    }
    return `0x${value.toString("hex")}`;
}
exports.toHexString = toHexString;
