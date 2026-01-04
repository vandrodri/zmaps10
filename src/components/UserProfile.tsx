import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

interface BusinessProfile {
  businessName: string;
  gbpLink: string;
  businessAvatar: string;
  businessNiche: string;
  businessDifferentials: string[];
}

const NICHES = [
  'Restaurante',
  'Padaria',
  'Cafeteria',
  'Lanchonete',
  'Pizzaria',
  'Bar',
  'Academia',
  'Salão de Beleza',
  'Barbearia',
  'Clínica Médica',
  'Clínica Odontológica',
  'Pet Shop',
  'Loja de Roupas',
  'Farmácia',
  'Supermercado',
  'Oficina Mecânica',
  'Lavanderia',
  'Hotel/Pousada',
  'Escritório de Advocacia',
  'Imobiliária',
  'Outro'
];

export const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<BusinessProfile>({
    businessName: '',
    gbpLink: '',
    businessAvatar: '',
    businessNiche: '',
    businessDifferentials: []
  });
  
  const [newDifferential, setNewDifferential] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Carregar dados do perfil
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!auth.currentUser) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfile({
          businessName: data.businessName || '',
          gbpLink: data.gbpLink || '',
          businessAvatar: data.businessAvatar || '',
          businessNiche: data.businessNiche || '',
          businessDifferentials: data.businessDifferentials || []
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      showMessage('error', 'Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        businessName: profile.businessName,
        gbpLink: profile.gbpLink,
        businessAvatar: profile.businessAvatar,
        businessNiche: profile.businessNiche,
        businessDifferentials: profile.businessDifferentials
      });
      showMessage('success', 'Perfil salvo com sucesso! ✅');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      showMessage('error', 'Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !auth.currentUser) return;
    
    const file = e.target.files[0];
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Por favor, selecione uma imagem');
      return;
    }
    
    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Imagem muito grande (máx 5MB)');
      return;
    }
    
    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `business-avatars/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setProfile(prev => ({ ...prev, businessAvatar: downloadURL }));
      showMessage('success', 'Imagem enviada! Clique em Salvar para confirmar');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      showMessage('error', 'Erro ao fazer upload da imagem');
    } finally {
      setUploadingImage(false);
    }
  };

  const addDifferential = () => {
    if (!newDifferential.trim()) return;
    
    if (profile.businessDifferentials.includes(newDifferential.trim())) {
      showMessage('error', 'Esse diferencial já existe');
      return;
    }
    
    setProfile(prev => ({
      ...prev,
      businessDifferentials: [...prev.businessDifferentials, newDifferential.trim()]
    }));
    setNewDifferential('');
  };

  const removeDifferential = (index: number) => {
    setProfile(prev => ({
      ...prev,
      businessDifferentials: prev.businessDifferentials.filter((_, i) => i !== index)
    }));
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 mb-2">Perfil do Negócio</h1>
        <p className="text-slate-600">Configure as informações do seu negócio para personalizar o conteúdo gerado pela IA</p>
      </div>

      {/* Message Toast */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {message.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            <p className="font-semibold">{message.text}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        
        {/* Avatar do Negócio */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Logo do Negócio
          </h2>
          
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] flex items-center justify-center overflow-hidden">
              {profile.businessAvatar ? (
                <img src={profile.businessAvatar} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            
            <div className="flex-1">
              <label className="block">
                <span className="px-4 py-2 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl cursor-pointer inline-flex items-center gap-2 transition-all">
                  {uploadingImage ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Escolher Imagem
                    </>
                  )}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
              <p className="text-xs text-slate-500 mt-2">PNG, JPG ou GIF (máx 5MB)</p>
            </div>
          </div>
        </div>

        {/* Informações Básicas */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Informações Básicas
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nome do Negócio</label>
              <input
                type="text"
                value={profile.businessName}
                onChange={(e) => setProfile(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="Ex: Padaria Pão Quente"
                className="w-full px-4 py-3 bg-gradient-to-br from-gray-100 to-gray-50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Link do Google Meu Negócio</label>
              <input
                type="url"
                value={profile.gbpLink}
                onChange={(e) => setProfile(prev => ({ ...prev, gbpLink: e.target.value }))}
                placeholder="https://business.google.com/..."
                className="w-full px-4 py-3 bg-gradient-to-br from-gray-100 to-gray-50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
              />
              <p className="text-xs text-slate-500 mt-1 ml-1">Cole o link do seu painel para acesso rápido</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nicho do Negócio</label>
              <select
                value={profile.businessNiche}
                onChange={(e) => setProfile(prev => ({ ...prev, businessNiche: e.target.value }))}
                className="w-full px-4 py-3 bg-gradient-to-br from-gray-100 to-gray-50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] rounded-xl text-slate-800 focus:outline-none font-medium"
              >
                <option value="">Selecione o nicho</option>
                {NICHES.map(niche => (
                  <option key={niche} value={niche}>{niche}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Diferenciais */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Diferenciais do Negócio
          </h2>
          
          <p className="text-sm text-slate-600 mb-4">
            Adicione características únicas que a IA deve sempre mencionar (ex: "Entrega grátis", "Atendimento 24h")
          </p>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newDifferential}
              onChange={(e) => setNewDifferential(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDifferential()}
              placeholder="Ex: Entrega grátis acima de R$50"
              className="flex-1 px-4 py-3 bg-gradient-to-br from-gray-100 to-gray-50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
            />
            <button
              onClick={addDifferential}
              className="px-6 py-3 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-md"
            >
              Adicionar
            </button>
          </div>
          
          {profile.businessDifferentials.length > 0 ? (
            <div className="space-y-2">
              {profile.businessDifferentials.map((diff, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gradient-to-br from-gray-100 to-gray-50 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.7)] p-3 rounded-xl"
                >
                  <span className="text-slate-800 font-medium">{diff}</span>
                  <button
                    onClick={() => removeDifferential(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm">Nenhum diferencial adicionado ainda</p>
            </div>
          )}
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-8 py-4 font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 ${
              saving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#34A853]/90 hover:bg-[#34A853] text-white shadow-green-500/30'
            }`}
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Salvando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};