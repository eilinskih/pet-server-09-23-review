"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticated = void 0;
const fake_users_store_1 = require("../fake_users_store");
const authenticated = (req, res, next) => {
    var _a;
    try {
        const sessionId = req.cookies['session_id'];
        if (!sessionId) {
            res.status(403).send({ message: 'Please, authorize first' });
        }
        if (((_a = fake_users_store_1.sessions[sessionId]) === null || _a === void 0 ? void 0 : _a.expires) < Date.now()) {
            res.status(403).send({ message: 'Session expired' });
        }
        const user = fake_users_store_1.USERS.find(({ id }) => { var _a; return ((_a = fake_users_store_1.sessions[sessionId]) === null || _a === void 0 ? void 0 : _a.userId) === id; });
        if (user) {
            req.userId = user.id;
            next();
        }
        else {
            res.status(401).send({ message: 'User not found' });
        }
    }
    catch (e) {
        console.log(e);
    }
};
exports.authenticated = authenticated;
