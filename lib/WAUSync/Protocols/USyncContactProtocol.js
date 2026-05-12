"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USyncContactProtocol = void 0;
const WABinary_1 = require("../../WABinary");
class USyncContactProtocol {
    constructor() {
        this.name = 'contact';
    }
    getQueryElement() {
        return {
            tag: 'contact',
            attrs: {},
        };
    }
    getUserElement(user) {
        //TODO: Implement type / username fields (not yet supported)
        return {
            tag: 'contact',
            attrs: {},
            content: user.phone,
        };
    }
    parser(node) {
        var _a;
        if (node.tag === 'contact') {
            (0, WABinary_1.assertNodeErrorFree)(node);
            return ((_a = node === null || node === void 0 ? void 0 : node.attrs) === null || _a === void 0 ? void 0 : _a.type) === 'in';
        }
        return false;
    }
}
exports.USyncContactProtocol = USyncContactProtocol;
