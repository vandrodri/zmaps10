import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { User } from "firebase/auth";

export const createOrUpdateUser = async (firebaseUser: User) => {
  try {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Criar data de expiração do trial (7 dias a partir de agora)
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);
      const trialTimestamp = Timestamp.fromDate(trialEndDate);
      
      await setDoc(userRef, {
        displayName: firebaseUser.displayName || "Usuário",
        email: firebaseUser.email || "",
        photoURL: firebaseUser.photoURL || null,
        plan: "trial",
        trialEndsAt: trialTimestamp,
        usageCount: 0,
        usageLimit: 3,
        lastResetDate: serverTimestamp(),
        subscriptionStatus: "trial",
        subscriptionType: null,
        subscriptionStartDate: null,
        subscriptionEndDate: null,
        mercadoPagoSubscriptionId: null,
        mercadoPagoPaymentId: null,
        isFounder: false,
        founderNumber: null,
        founderPaidAt: null,
        paidPrice: null,
        paidPlan: null,
        createdAt: serverTimestamp()
      });
      
      console.log("✅ Novo usuário criado:", firebaseUser.email);
    } else {
      // ✅ Apenas atualiza dados básicos, SEM mexer no trial
      const updates: any = {};
      
      if (firebaseUser.displayName !== userSnap.data().displayName) {
        updates.displayName = firebaseUser.displayName || "Usuário";
      }
      
      if (firebaseUser.photoURL !== userSnap.data().photoURL) {
        updates.photoURL = firebaseUser.photoURL || null;
      }
      
      // Só atualiza se houver mudanças
      if (Object.keys(updates).length > 0) {
        await setDoc(userRef, updates, { merge: true });
        console.log("✅ Usuário atualizado:", firebaseUser.email);
      }
    }
  } catch (error) {
    console.error("❌ Erro ao criar/atualizar usuário:", error);
  }
};