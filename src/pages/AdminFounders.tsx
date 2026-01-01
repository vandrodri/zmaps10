import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { makeUserFounder, getFounderInfo } from '../services/founderService';

export const AdminFounders: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [founderInfo, setFounderInfo] = useState<any>(null);

  // Busca info de fundadores ao carregar
  React.useEffect(() => {
    loadFounderInfo();
  }, []);

  const loadFounderInfo = async () => {
    const info = await getFounderInfo();
    setFounderInfo(info);
  };

  const handleMakeFounder = async () => {
    if (!email) {
      setMessage('❌ Digite um email');
      return;
    }

    setLoading(true);
    setMessage('⏳ Processando...');

    try {
      // 1. Buscar usuário por email no Firebase Auth
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email.toLowerCase().trim()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setMessage('❌ Usuário não encontrado no sistema');
        setLoading(false);
        return;
      }

      // 2. Pegar o userId
      const userId = snapshot.docs[0].id;

      // 3. Verificar se já é fundador
      const userData = snapshot.docs[0].data();
      if (userData.isFounder) {
        setMessage(`⚠️ Usuário já é fundador #${userData.founderNumber}`);
        setLoading(false);
        return;
      }

      // 4. Tornar fundador
      const success = await makeUserFounder(userId);

      if (success) {
        setMessage('✅ Usuário virou fundador com sucesso!');
        setEmail('');
        await loadFounderInfo(); // Atualiza contador
      } else {
        setMessage('❌ Erro: Limite de fundadores atingido (100/100)');
      }

    } catch (error: any) {
      console.error('Erro:', error);
      setMessage(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🛡️ Painel Admin - Fundadores
          </h1>
          <p className="text-gray-600">
            Transforme clientes pagantes em Fundadores manualmente
          </p>
        </div>

        {/* Contador de Fundadores */}
        {founderInfo && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Fundadores Ativos</p>
                <p className="text-4xl font-bold">{founderInfo.current} / {founderInfo.total}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Vagas Restantes</p>
                <p className="text-4xl font-bold">{founderInfo.spotsLeft}</p>
              </div>
            </div>
            <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${founderInfo.percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Processar Pagamento
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email do Cliente
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@email.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
                disabled={loading}
              />
            </div>

            <button
              onClick={handleMakeFounder}
              disabled={loading || !email}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-lg text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? '⏳ Processando...' : '✨ Tornar Fundador'}
            </button>

            {/* Mensagem de feedback */}
            {message && (
              <div className={`p-4 rounded-lg text-center font-semibold ${
                message.includes('✅') ? 'bg-green-100 text-green-800' :
                message.includes('❌') ? 'bg-red-100 text-red-800' :
                message.includes('⚠️') ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {message}
              </div>
            )}
          </div>

          {/* Instruções */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-2">📋 Como usar:</h3>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Receba confirmação de pagamento do Mercado Pago</li>
              <li>Copie o email do cliente</li>
              <li>Cole aqui e clique em "Tornar Fundador"</li>
              <li>Cliente terá acesso imediato ao plano vitalício</li>
            </ol>
          </div>
        </div>

      </div>
    </div>
  );
};