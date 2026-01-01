"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFounderPayment = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
exports.processFounderPayment = functions.https.onRequest(async (req, res) => {
    // Permite CORS
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
        res.status(204).send('');
        return;
    }
    // Validação de segurança
    const secret = req.headers.authorization;
    if (secret !== "ZMAPS_FOUNDER_SECRET_2024") {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ error: "Email obrigatório" });
        return;
    }
    try {
        // Busca usuário por email
        const userRecord = await admin.auth().getUserByEmail(email);
        const userId = userRecord.uid;
        // Verifica vagas disponíveis
        const usersRef = admin.firestore().collection("users");
        const foundersSnapshot = await usersRef.where("isFounder", "==", true).get();
        if (foundersSnapshot.size >= 100) {
            res.status(400).json({ error: "Limite de fundadores atingido" });
            return;
        }
        const founderNumber = foundersSnapshot.size + 1;
        // Atualiza usuário
        await usersRef.doc(userId).update({
            isFounder: true,
            founderNumber: founderNumber,
            founderPaidAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`✅ Usuário ${email} virou fundador #${founderNumber}`);
        res.json({
            success: true,
            userId,
            founderNumber,
            message: `Usuário virou fundador #${founderNumber}`
        });
    }
    catch (error) {
        console.error("Erro ao processar pagamento:", error);
        if (error.code === 'auth/user-not-found') {
            res.status(404).json({ error: "Usuário não encontrado" });
            return;
        }
        res.status(500).json({ error: error.message });
    }
});
//# sourceMappingURL=index.js.map