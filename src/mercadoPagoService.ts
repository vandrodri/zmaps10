const MP_ACCESS_TOKEN = import.meta.env.VITE_MP_ACCESS_TOKEN;

// Links diretos do Mercado Pago
const MP_LINK_AVISTA = "https://mpago.li/2MPGe2o";
const MP_LINK_PARCELADO = "https://mpago.li/1FZP94V";

export interface SubscriptionData {
  userId: string;
  userEmail: string;
  userName: string;
  planType: 'monthly' | 'annual' | 'installments';
  isFounder: boolean;
}

// ============================================
// PAGAMENTO À VISTA (R$ 297)
// ============================================
export const createCashPayment = async (data: SubscriptionData) => {
  try {
    console.log('💰 Redirecionando para pagamento À VISTA');
    
    // Salva dados no localStorage para recuperar no retorno
    localStorage.setItem('zmaps_payment_data', JSON.stringify({
      userId: data.userId,
      userEmail: data.userEmail,
      userName: data.userName,
      planType: 'annual',
      paymentMethod: 'cash',
      isFounder: data.isFounder,
      timestamp: new Date().toISOString()
    }));
    
    return {
      success: true,
      checkoutUrl: MP_LINK_AVISTA
    };
    
  } catch (error) {
    console.error('Erro ao criar pagamento à vista:', error);
    return {
      success: false,
      error: 'Não foi possível redirecionar para o pagamento. Tente novamente.'
    };
  }
};

// ============================================
// PAGAMENTO PARCELADO (12x R$ 29,70)
// ============================================
export const createInstallmentPayment = async (data: SubscriptionData) => {
  try {
    console.log('💳 Redirecionando para pagamento PARCELADO');
    
    // Salva dados no localStorage para recuperar no retorno
    localStorage.setItem('zmaps_payment_data', JSON.stringify({
      userId: data.userId,
      userEmail: data.userEmail,
      userName: data.userName,
      planType: 'annual',
      paymentMethod: 'installments',
      isFounder: data.isFounder,
      timestamp: new Date().toISOString()
    }));
    
    return {
      success: true,
      checkoutUrl: MP_LINK_PARCELADO
    };
    
  } catch (error) {
    console.error('Erro ao criar pagamento parcelado:', error);
    return {
      success: false,
      error: 'Não foi possível redirecionar para o pagamento. Tente novamente.'
    };
  }
};

// ============================================
// FUNÇÃO ANTIGA (manter compatibilidade)
// ============================================
export const createAnnualPayment = async (data: SubscriptionData) => {
  // Redireciona para à vista por padrão
  return createCashPayment(data);
};

// ============================================
// ASSINATURA MENSAL (manter existente)
// ============================================
export const createMonthlySubscription = async (data: SubscriptionData) => {
  try {
    const price = data.isFounder ? 29.70 : 39.90;
    
    const subscriptionData = {
      reason: "ZMaps Pro - Plano Mensal",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: price,
        currency_id: "BRL"
      },
      back_url: `${window.location.origin}/success`,
      payer_email: data.userEmail,
      external_reference: JSON.stringify({
        userId: data.userId,
        planType: 'monthly',
        isFounder: data.isFounder
      })
    };

    const response = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify(subscriptionData)
    });

    if (!response.ok) {
      throw new Error('Erro ao criar assinatura');
    }

    const result = await response.json();
    
    return {
      success: true,
      checkoutUrl: result.init_point,
      subscriptionId: result.id
    };

  } catch (error) {
    console.error('Erro ao criar assinatura mensal:', error);
    return {
      success: false,
      error: 'Não foi possível criar a assinatura. Tente novamente.'
    };
  }
};