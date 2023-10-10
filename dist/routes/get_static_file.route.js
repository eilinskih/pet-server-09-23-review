"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fake_users_store_1 = require("../fake_users_store");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    var _a;
    if (!req.headers.authorization) {
        res.status(403).send({ message: 'Please, authorize first' });
    }
    const authData = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const [authDatalogin, authDatapassword] = Buffer.from(authData, 'base64').toString('ascii').split(':');
    const user = fake_users_store_1.USERS.find(({ email, password }) => authDatalogin === email && authDatapassword === password);
    if (!user) {
        res.status(401).send({ message: 'User not found' });
    }
    if (user) {
        res.send({
            photo: 'http://swap-assests.pstuff.net/tokens/171/medium_nfe_fear_01.png'
        });
    }
});
exports.default = router;
