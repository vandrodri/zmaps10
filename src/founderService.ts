import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

const FOUNDER_LIMIT = 100;

// Verifica quantos fundadores já existem
export const getFounderCount = async (): Promise<number> => {
  try {
    const usersRef = collection(db, "users");
    const foundersQuery = query(usersRef, where("isFounder", "==", true));
    const snapshot = await getDocs(foundersQuery);
    
    return snapshot.size;
  } catch (error) {
    console.error("Erro ao contar fundadores:", error);
    return FOUNDER_LIMIT; // Se der erro, assume que está cheio (mais seguro)
  }
};

// Verifica se ainda há vagas de fundador
export const hasFounderSpotsAvailable = async (): Promise<boolean> => {
  const count = await getFounderCount();
  return count < FOUNDER_LIMIT;
};

// Transforma usuário em fundador
export const makeUserFounder = async (userId: string): Promise<boolean> => {
  try {
    // Verifica se ainda há vagas
    const hasSpots = await hasFounderSpotsAvailable();
    
    if (!hasSpots) {
      console.log("❌ Limite de fundadores atingido");
      return false;
    }
    
    // Pega o número do fundador (count + 1)
    const currentCount = await getFounderCount();
    const founderNumber = currentCount + 1;
    
    // Atualiza o usuário
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      isFounder: true,
      founderNumber: founderNumber,
      founderPaidAt: serverTimestamp()
    });
    
    console.log(`✅ Usuário virou fundador #${founderNumber}`);
    return true;
    
  } catch (error) {
    console.error("Erro ao tornar usuário fundador:", error);
    return false;
  }
};

// Pega informações de fundador
export const getFounderInfo = async () => {
  const count = await getFounderCount();
  const spotsLeft = FOUNDER_LIMIT - count;
  const hasSpots = spotsLeft > 0;
  
  return {
    total: FOUNDER_LIMIT,
    current: count,
    spotsLeft,
    hasSpots,
    percentage: Math.round((count / FOUNDER_LIMIT) * 100)
  };
};