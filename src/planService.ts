import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface UserPlan {
  plan: string;
  subscriptionStatus: string;
  trialEndsAt: Date | null;
  isFounder: boolean;
  paidPlan: string | null;
}

export const getUserPlan = async (userId: string): Promise<UserPlan | null> => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return null;
    
    const data = userSnap.data();
    
    return {
      plan: data.plan || "trial",
      subscriptionStatus: data.subscriptionStatus || "trial",
      trialEndsAt: data.trialEndsAt ? data.trialEndsAt.toDate() : null,
      isFounder: data.isFounder || false,
      paidPlan: data.paidPlan || null
    };
  } catch (error) {
    console.error("Erro ao buscar plano do usuário:", error);
    return null;
  }
};

export const getDaysRemaining = (trialEndDate: Date | null): number => {
  if (!trialEndDate) return 0;
  
  const now = new Date();
  const diffTime = trialEndDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

export const isTrialExpired = (trialEndDate: Date | null): boolean => {
  if (!trialEndDate) return true;
  return new Date() > trialEndDate;
};

export const shouldShowAlert = (daysRemaining: number): boolean => {
  // Mostra alerta nos últimos 3 dias do trial
  return daysRemaining > 0 && daysRemaining <= 3;
};

export const canUseApp = (userPlan: UserPlan | null): boolean => {
  if (!userPlan) return false;
  
  // Se tem plano pago, pode usar
  if (userPlan.subscriptionStatus === "active") return true;
  
  // Se está no trial e não expirou, pode usar
  if (userPlan.subscriptionStatus === "trial" && !isTrialExpired(userPlan.trialEndsAt)) {
    return true;
  }
  
  return false;
};