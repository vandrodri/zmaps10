import React from 'react';

interface LegalDocumentProps {
  title: string;
  lastUpdated: string;
  onClose?: () => void;
}

export const PrivacyPolicy: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  return (
    <LegalDocument title="Política de Privacidade" lastUpdated="03 de janeiro de 2026" onClose={onClose}>
      <section>
        <h2>1. Introdução</h2>
        <p>Bem-vindo ao <strong>MapsGuru</strong> ("nós", "nosso" ou "plataforma"). Levamos sua privacidade a sério e nos comprometemos a proteger seus dados pessoais de acordo com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong> e demais legislações aplicáveis.</p>
        <p>Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nossos serviços.</p>
      </section>

      <section>
        <h2>2. Dados que Coletamos</h2>
        
        <h3>2.1 Dados Fornecidos por Você</h3>
        <ul>
          <li><strong>Dados de Cadastro:</strong> Nome, e-mail, foto de perfil (via Google Sign-In)</li>
          <li><strong>Dados do Negócio:</strong> Nome do estabelecimento, nicho de atuação, link do Google Meu Negócio, logo/avatar do negócio, diferenciais competitivos</li>
          <li><strong>Conteúdo Gerado:</strong> Posts, respostas a avaliações, FAQs e consultas feitas na plataforma</li>
          <li><strong>Feedback e Suporte:</strong> Mensagens enviadas através do formulário de feedback ou WhatsApp</li>
        </ul>

        <h3>2.2 Dados Coletados Automaticamente</h3>
        <ul>
          <li><strong>Dados de Uso:</strong> Páginas visitadas, funcionalidades utilizadas, tempo de uso</li>
          <li><strong>Dados Técnicos:</strong> Endereço IP, tipo de navegador, sistema operacional, ID de dispositivo</li>
          <li><strong>Cookies:</strong> Utilizamos cookies para autenticação, preferências e análise de uso</li>
        </ul>
      </section>

      <section>
        <h2>3. Como Utilizamos Seus Dados</h2>
        <p>Utilizamos seus dados pessoais para:</p>
        <ul>
          <li>✅ <strong>Prestar nossos serviços:</strong> Gerar conteúdo com IA personalizado para seu negócio</li>
          <li>✅ <strong>Gerenciar sua conta:</strong> Autenticação, perfil e configurações</li>
          <li>✅ <strong>Melhorar a plataforma:</strong> Análise de uso e desenvolvimento de novas funcionalidades</li>
          <li>✅ <strong>Comunicação:</strong> Enviar atualizações, suporte técnico e notificações importantes</li>
          <li>✅ <strong>Segurança:</strong> Prevenir fraudes e garantir a segurança da plataforma</li>
          <li>✅ <strong>Cumprimento legal:</strong> Atender requisitos legais e regulatórios</li>
        </ul>
      </section>

      <section>
        <h2>4. Base Legal (LGPD)</h2>
        <p>Processamos seus dados com base nas seguintes bases legais:</p>
        <ul>
          <li><strong>Consentimento:</strong> Você consente ao criar sua conta e usar nossos serviços</li>
          <li><strong>Execução de Contrato:</strong> Necessário para fornecer os serviços contratados</li>
          <li><strong>Legítimo Interesse:</strong> Melhorias na plataforma e prevenção de fraudes</li>
          <li><strong>Obrigação Legal:</strong> Cumprimento de obrigações legais e regulatórias</li>
        </ul>
      </section>

      <section>
        <h2>5. Compartilhamento de Dados</h2>
        <p><strong>NÃO vendemos seus dados pessoais.</strong> Podemos compartilhar dados apenas com:</p>
        <ul>
          <li><strong>Provedores de Serviço:</strong> Firebase/Google (armazenamento), OpenAI/Anthropic (IA), Stripe (pagamentos)</li>
          <li><strong>Autoridades:</strong> Quando exigido por lei ou para proteção de direitos</li>
          <li><strong>Transferência de Negócio:</strong> Em caso de fusão, aquisição ou venda de ativos</li>
        </ul>
        <p>Todos os terceiros são contratualmente obrigados a proteger seus dados.</p>
      </section>

      <section>
        <h2>6. Armazenamento e Segurança</h2>
        
        <h3>6.1 Onde Armazenamos</h3>
        <p>Seus dados são armazenados em servidores do <strong>Firebase</strong> (Google Cloud) com medidas de segurança adequadas.</p>

        <h3>6.2 Medidas de Segurança</h3>
        <ul>
          <li>Criptografia de dados em trânsito (SSL/TLS)</li>
          <li>Controle de acesso restrito</li>
          <li>Monitoramento de segurança 24/7</li>
          <li>Backups regulares</li>
        </ul>

        <h3>6.3 Retenção de Dados</h3>
        <p>Mantemos seus dados enquanto sua conta estiver ativa. Após exclusão da conta, dados são removidos em até <strong>90 dias</strong>, exceto quando obrigados a mantê-los por lei.</p>
      </section>

      <section>
        <h2>7. Seus Direitos (LGPD)</h2>
        <p>Você tem direito a:</p>
        <ul>
          <li>✅ <strong>Acesso:</strong> Solicitar cópia dos seus dados pessoais</li>
          <li>✅ <strong>Correção:</strong> Corrigir dados incompletos ou desatualizados</li>
          <li>✅ <strong>Exclusão:</strong> Solicitar exclusão dos seus dados (direito ao esquecimento)</li>
          <li>✅ <strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
          <li>✅ <strong>Revogação:</strong> Revogar consentimento a qualquer momento</li>
          <li>✅ <strong>Oposição:</strong> Opor-se ao processamento em certas situações</li>
          <li>✅ <strong>Informação:</strong> Saber com quem compartilhamos seus dados</li>
        </ul>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
          <p className="text-sm font-semibold text-blue-900">Para exercer seus direitos:</p>
          <p className="text-sm text-blue-800">📧 suporte@zmaps.app ou 💬 WhatsApp (11) 95705-5256</p>
        </div>
      </section>

      <section>
        <h2>8. Dados de Menores</h2>
        <p>Nossos serviços são destinados a <strong>maiores de 18 anos</strong>. Não coletamos intencionalmente dados de menores. Se identificarmos dados de menores, serão removidos imediatamente.</p>
      </section>

      <section>
        <h2>9. Alterações nesta Política</h2>
        <p>Podemos atualizar esta Política periodicamente. Alterações significativas serão notificadas por e-mail ou na plataforma. Recomendamos revisar esta página regularmente.</p>
      </section>

      <section>
        <h2>10. Contato</h2>
        <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-5 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)]">
          <p className="font-bold text-gray-800 mb-2">MapsGuru - Cliente procura, você aparece</p>
          <p className="text-sm text-gray-700">📧 E-mail: suporte@zmaps.app</p>
          <p className="text-sm text-gray-700">💬 WhatsApp: (11) 95705-5256</p>
          <p className="text-sm text-gray-700">🌐 Website: zmaps.app</p>
        </div>
      </section>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-8">
        <p className="text-sm font-semibold text-green-900 text-center">
          Ao utilizar o MapsGuru, você concorda com esta Política de Privacidade.
        </p>
      </div>
    </LegalDocument>
  );
};

export const TermsOfService: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  return (
    <LegalDocument title="Termos de Uso" lastUpdated="03 de janeiro de 2026" onClose={onClose}>
      <section>
        <h2>1. Aceitação dos Termos</h2>
        <p>Bem-vindo ao <strong>MapsGuru</strong>! Ao acessar e usar nossa plataforma, você concorda com estes Termos de Uso. Se não concordar, não utilize nossos serviços.</p>
      </section>

      <section>
        <h2>2. Descrição do Serviço</h2>
        <p>O <strong>MapsGuru</strong> é uma plataforma SaaS que utiliza <strong>Inteligência Artificial</strong> para ajudar pequenos negócios a gerenciar seu perfil do <strong>Google Meu Negócio</strong>.</p>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mt-4">
          <p className="text-sm font-semibold text-orange-900">⚠️ Status Atual: Versão Beta</p>
          <p className="text-sm text-orange-800">O serviço está em desenvolvimento ativo e pode conter bugs ou limitações.</p>
        </div>
      </section>

      <section>
        <h2>3. Cadastro e Conta</h2>
        
        <h3>3.1 Elegibilidade</h3>
        <ul>
          <li>Você deve ter <strong>18 anos ou mais</strong></li>
          <li>Fornecer informações verdadeiras e atualizadas</li>
          <li>Possuir autorização para representar o negócio cadastrado</li>
        </ul>

        <h3>3.2 Responsabilidade da Conta</h3>
        <ul>
          <li>Você é responsável por manter a segurança da sua conta</li>
          <li>Não compartilhe suas credenciais de acesso</li>
          <li>Notifique-nos imediatamente sobre uso não autorizado</li>
        </ul>
      </section>

      <section>
        <h2>4. Planos e Pagamentos</h2>
        
        <h3>4.1 Trial Gratuito</h3>
        <ul>
          <li><strong>7 dias gratuitos</strong> com acesso limitado (3 gerações/dia)</li>
          <li>Não é necessário cartão de crédito</li>
          <li>Após o período, é necessário upgrade para continuar usando</li>
        </ul>

        <h3>4.2 Plano Fundador</h3>
        <ul>
          <li>Acesso vitalício com condições especiais</li>
          <li>Termos específicos fornecidos no momento da aquisição</li>
        </ul>

        <h3>4.3 Reembolsos</h3>
        <ul>
          <li>Processados via <strong>Stripe</strong></li>
          <li>Solicite reembolsos dentro de <strong>7 dias</strong> da compra</li>
          <li>Contate nosso suporte para solicitações</li>
        </ul>
      </section>

      <section>
        <h2>5. Uso Aceitável</h2>
        
        <h3>Você PODE:</h3>
        <ul className="text-green-700">
          <li>✅ Usar a plataforma para gerenciar seu negócio legítimo</li>
          <li>✅ Gerar conteúdo para suas redes sociais e Google Meu Negócio</li>
          <li>✅ Compartilhar feedback e sugestões</li>
          <li>✅ Cancelar sua assinatura a qualquer momento</li>
        </ul>

        <h3 className="mt-4">Você NÃO PODE:</h3>
        <ul className="text-red-700">
          <li>❌ Usar a plataforma para atividades ilegais ou antiéticas</li>
          <li>❌ Gerar conteúdo enganoso, ofensivo ou spam</li>
          <li>❌ Tentar acessar sistemas não autorizados (hacking)</li>
          <li>❌ Revender ou redistribuir nossos serviços</li>
          <li>❌ Criar múltiplas contas para abusar do trial gratuito</li>
          <li>❌ Violar direitos autorais ou marcas registradas</li>
        </ul>
      </section>

      <section>
        <h2>6. Propriedade Intelectual</h2>
        
        <h3>6.1 Nossa Propriedade</h3>
        <p>O <strong>MapsGuru</strong>, sua marca, logo e tecnologia são de nossa propriedade exclusiva.</p>

        <h3>6.2 Seu Conteúdo</h3>
        <ul>
          <li>Você mantém todos os direitos sobre o conteúdo que gera</li>
          <li>Nos concede licença para processar/armazenar para prestar o serviço</li>
          <li>Você é responsável por garantir que não viole direitos de terceiros</li>
        </ul>

        <h3>6.3 Conteúdo Gerado por IA</h3>
        <ul>
          <li>Fornecido "como está"</li>
          <li>Você deve revisar e adaptar antes de publicar</li>
          <li>Não garantimos que estará livre de erros</li>
        </ul>
      </section>

      <section>
        <h2>7. Limitação de Responsabilidade</h2>
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4">
          <p className="text-sm font-bold text-yellow-900 mb-2">NA MÁXIMA EXTENSÃO PERMITIDA POR LEI:</p>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Fornecemos o serviço "COMO ESTÁ"</li>
            <li>• Não garantimos funcionamento ininterrupto</li>
            <li>• Não nos responsabilizamos por perda de dados ou lucros cessantes</li>
            <li>• Nossa responsabilidade máxima: valor pago nos últimos 12 meses</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>8. Lei Aplicável e Foro</h2>
        <p>Estes Termos são regidos pelas <strong>leis brasileiras</strong>.</p>
        <p>Foro: <strong>São Paulo/SP</strong></p>
      </section>

      <section>
        <h2>9. Contato</h2>
        <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-5 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)]">
          <p className="text-sm text-gray-700">📧 E-mail: suporte@zmaps.app</p>
          <p className="text-sm text-gray-700">💬 WhatsApp: (11) 95705-5256</p>
          <p className="text-sm text-gray-700">🌐 Website: zmaps.app</p>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
        <p className="text-sm font-semibold text-blue-900 text-center">
          Ao usar o MapsGuru, você confirma ter lido e concordado com estes Termos.
        </p>
      </div>
    </LegalDocument>
  );
};

export const CookiePolicy: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  return (
    <LegalDocument title="Política de Cookies" lastUpdated="03 de janeiro de 2026" onClose={onClose}>
      <section>
        <h2>1. O que são Cookies?</h2>
        <p><strong>Cookies</strong> são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. Eles permitem que o site "lembre" de você e suas preferências.</p>
      </section>

      <section>
        <h2>2. Como o MapsGuru Usa Cookies</h2>
        <ul>
          <li>✅ <strong>Autenticação:</strong> Manter você logado na plataforma</li>
          <li>✅ <strong>Preferências:</strong> Lembrar suas configurações</li>
          <li>✅ <strong>Segurança:</strong> Proteger sua conta contra fraudes</li>
          <li>✅ <strong>Análise:</strong> Entender como melhorar a plataforma</li>
          <li>✅ <strong>Desempenho:</strong> Otimizar velocidade e experiência</li>
        </ul>
      </section>

      <section>
        <h2>3. Tipos de Cookies</h2>
        
        <h3>3.1 Cookies Essenciais (Necessários)</h3>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-red-900">⚠️ NÃO PODEM SER DESATIVADOS</p>
          <p className="text-sm text-red-800">Fundamentais para o funcionamento da plataforma</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Cookie</th>
                <th className="px-4 py-2 text-left">Finalidade</th>
                <th className="px-4 py-2 text-left">Duração</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-2 font-mono">authToken</td>
                <td className="px-4 py-2">Manter você logado</td>
                <td className="px-4 py-2">30 dias</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono">sessionId</td>
                <td className="px-4 py-2">Identificar sessão</td>
                <td className="px-4 py-2">Sessão</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6">3.2 Cookies Funcionais</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-blue-900">ℹ️ PODEM SER DESATIVADOS</p>
          <p className="text-sm text-blue-800">(mas afetam funcionalidades)</p>
        </div>
        <ul>
          <li><strong>userPreferences:</strong> Lembrar configurações (1 ano)</li>
          <li><strong>onboardingComplete:</strong> Status do onboarding (permanente)</li>
        </ul>

        <h3 className="mt-6">3.3 Cookies Analíticos</h3>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-green-900">✅ PODEM SER DESATIVADOS</p>
        </div>
        <ul>
          <li><strong>Google Analytics:</strong> _ga, _gid, _gat</li>
          <li><strong>Firebase Analytics:</strong> Métricas de uso</li>
        </ul>
      </section>

      <section>
        <h2>4. Cookies de Terceiros</h2>
        <ul>
          <li><strong>Firebase/Google:</strong> Autenticação e armazenamento</li>
          <li><strong>Stripe:</strong> Processar pagamentos com segurança</li>
          <li><strong>OpenAI/Anthropic:</strong> Processamento de IA</li>
        </ul>
      </section>

      <section>
        <h2>5. Como Gerenciar Cookies</h2>
        
        <h3>5.1 No Navegador</h3>
        <p>Você pode controlar cookies nas configurações do seu navegador:</p>
        <ul>
          <li><strong>Chrome:</strong> Menu → Configurações → Privacidade → Cookies</li>
          <li><strong>Firefox:</strong> Menu → Configurações → Privacidade → Cookies</li>
          <li><strong>Safari:</strong> Preferências → Privacidade</li>
          <li><strong>Edge:</strong> Menu → Configurações → Cookies</li>
        </ul>

        <h3>5.2 Consequências de Desativar</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-yellow-900">⚠️ Cookies Essenciais:</p>
          <p className="text-sm text-yellow-800">Não será possível fazer login ou usar a plataforma</p>
        </div>
      </section>

      <section>
        <h2>6. Seus Direitos</h2>
        <ul>
          <li>✅ <strong>Saber</strong> quais cookies usamos</li>
          <li>✅ <strong>Aceitar ou recusar</strong> cookies não essenciais</li>
          <li>✅ <strong>Revogar consentimento</strong> a qualquer momento</li>
          <li>✅ <strong>Excluir</strong> cookies do seu navegador</li>
        </ul>
      </section>

      <section>
        <h2>7. Contato</h2>
        <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-5 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)]">
          <p className="text-sm text-gray-700">📧 E-mail: privacidade@zmaps.app</p>
          <p className="text-sm text-gray-700">💬 WhatsApp: (11) 95705-5256</p>
        </div>
      </section>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mt-8">
        <p className="text-sm font-semibold text-purple-900 text-center">
          Ao usar o MapsGuru, você concorda com o uso de cookies conforme descrito.
        </p>
      </div>
    </LegalDocument>
  );
};

const LegalDocument: React.FC<LegalDocumentProps & { children: React.ReactNode }> = ({ 
  title, 
  lastUpdated, 
  onClose, 
  children 
}) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        {onClose && (
          <button
            onClick={onClose}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
        )}
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transform -rotate-3 border border-white/20">
            <span className="text-white font-black text-4xl font-serif italic drop-shadow-md select-none">Z</span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-800">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">Última atualização: {lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="prose prose-slate max-w-none legal-content">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© 2026 MapsGuru. Todos os direitos reservados.</p>
      </div>

      <style>{`
        .legal-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-top: 2rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .legal-content h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #334155;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .legal-content section {
          margin-bottom: 2rem;
        }
        
        .legal-content p {
          margin-bottom: 1rem;
          line-height: 1.75;
          color: #475569;
        }
        
        .legal-content ul {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        
        .legal-content li {
          margin-bottom: 0.5rem;
          line-height: 1.75;
          color: #475569;
        }
        
        .legal-content strong {
          color: #1e293b;
          font-weight: 600;
        }
        
        .legal-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        
        .legal-content table th,
        .legal-content table td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
        }
        
        .legal-content table th {
          background: #f1f5f9;
          font-weight: 600;
          color: #1e293b;
        }
      `}</style>
    </div>
  );
};