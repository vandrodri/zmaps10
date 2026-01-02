// Lista de emails que podem acessar o painel admin
export const ADMIN_EMAILS = [
  'zapyclick@gmail.com', // ← COLOQUE SEU EMAIL AQUI
  // Adicione outros emails admin aqui se precisar
];

export const isAdmin = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};