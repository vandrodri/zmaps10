"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFounderPayment = void 0;
var functions = require("firebase-functions");
var admin = require("firebase-admin");
admin.initializeApp();
exports.processFounderPayment = functions.https.onRequest(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var secret, email, userRecord, userId, usersRef, foundersSnapshot, founderNumber, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Permite CORS
                res.set('Access-Control-Allow-Origin', '*');
                if (req.method === 'OPTIONS') {
                    res.set('Access-Control-Allow-Methods', 'POST');
                    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
                    return [2 /*return*/, res.status(204).send('')];
                }
                secret = req.headers.authorization;
                if (secret !== "ZMAPS_FOUNDER_SECRET_2024") {
                    return [2 /*return*/, res.status(401).json({ error: "Unauthorized" })];
                }
                email = req.body.email;
                if (!email) {
                    return [2 /*return*/, res.status(400).json({ error: "Email obrigatório" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, admin.auth().getUserByEmail(email)];
            case 2:
                userRecord = _a.sent();
                userId = userRecord.uid;
                usersRef = admin.firestore().collection("users");
                return [4 /*yield*/, usersRef.where("isFounder", "==", true).get()];
            case 3:
                foundersSnapshot = _a.sent();
                if (foundersSnapshot.size >= 100) {
                    return [2 /*return*/, res.status(400).json({ error: "Limite de fundadores atingido" })];
                }
                founderNumber = foundersSnapshot.size + 1;
                // Atualiza usuário
                return [4 /*yield*/, usersRef.doc(userId).update({
                        isFounder: true,
                        founderNumber: founderNumber,
                        founderPaidAt: admin.firestore.FieldValue.serverTimestamp()
                    })];
            case 4:
                // Atualiza usuário
                _a.sent();
                console.log("\u2705 Usu\u00E1rio ".concat(email, " virou fundador #").concat(founderNumber));
                return [2 /*return*/, res.json({
                        success: true,
                        userId: userId,
                        founderNumber: founderNumber,
                        message: "Usu\u00E1rio virou fundador #".concat(founderNumber)
                    })];
            case 5:
                error_1 = _a.sent();
                console.error("Erro ao processar pagamento:", error_1);
                if (error_1.code === 'auth/user-not-found') {
                    return [2 /*return*/, res.status(404).json({ error: "Usuário não encontrado" })];
                }
                return [2 /*return*/, res.status(500).json({ error: error_1.message })];
            case 6: return [2 /*return*/];
        }
    });
}); });
