import { collection, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const updateOldUsers = async () => {
  try {
    console.log("🔄 Iniciando atualização de usuários antigos...");
    
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    
    let updated = 0;
    let skipped = 0;
    
    for (const userDoc of snapshot.docs) {
      const userData = userDoc.data();
      
      // Verifica se já tem a estrutura nova
      if (userData.subscriptionStatus) {
        console.log(`⏭️  Pulando ${userData.email} - já atualizado`);
        skipped++;
        continue;
      }
      
      // Calcula data de fim do trial (7 dias a partir de agora)
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);
      
      // Atualiza o usuário com os campos novos
      await updateDoc(doc(db, "users", userDoc.id), {
        // Mantém campos que já existem
        plan: userData.plan || "trial",
        trialEndsAt: userData.trialEndsAt || trialEndDate,
        usageCount: userData.usageCount || 0,
        usageLimit: userData.usageLimit || 3,
        lastResetDate: userData.lastResetDate || serverTimestamp(),
        
        // Adiciona campos novos
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
        paidPlan: null
      });
      
      console.log(`✅ Atualizado: ${userData.email}`);
      updated++;
    }
    
    console.log("\n📊 RESUMO:");
    console.log(`✅ Atualizados: ${updated}`);
    console.log(`⏭️  Já estavam OK: ${skipped}`);
    console.log(`📝 Total: ${snapshot.docs.length}`);
    
    return { updated, skipped, total: snapshot.docs.length };
    
  } catch (error) {
    console.error("❌ Erro ao atualizar usuários:", error);
    throw error;
  }
};