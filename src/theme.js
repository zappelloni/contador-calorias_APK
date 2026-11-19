// Cores e estilos do app. Mude aqui para trocar o visual inteiro.
export const cores = {
  fundo: '#08060B', // preto
  fundo2: '#120D18',
  cartao: '#18111F',
  borda: '#2E2139',
  texto: '#F7F2FA',
  textoFraco: '#9A8AA8',
  principal: '#E5383B', // vermelho
  principal2: '#8B2FC9', // roxo
  sobrePrincipal: '#FFFFFF', // texto em cima do vermelho/roxo
  realce: 'rgba(229,56,59,0.14)', // fundo clarinho vermelho
  cartaoTopo: ['#2A1238', '#120D18'], // degradê do cartão do anel
  barraAbas: 'rgba(24,17,31,0.97)',
  proteina: '#FF4D6D',
  carbo: '#C77DFF',
  fibra: '#FF8FA3',
  gordura: '#9D4EDD',
  perigo: '#FF2E2E',
  perigo2: '#FF7A00',
};

export const gradiente = [cores.principal, cores.principal2];

export const REFEICOES = [
  { id: 'cafe', nome: 'Café da manhã', icone: 'cafe-outline' },
  { id: 'almoco', nome: 'Almoço', icone: 'restaurant-outline' },
  { id: 'lanche', nome: 'Lanches', icone: 'ice-cream-outline' },
  { id: 'jantar', nome: 'Jantar', icone: 'moon-outline' },
];

// Junta as refeições fixas com as que o usuário criou (ex.: Ceia)
export function todasRefeicoes(extras = []) {
  return [...REFEICOES, ...extras];
}

// Sugere a refeição pela hora do dia
export function refeicaoPelaHora(data = new Date()) {
  const h = data.getHours();
  if (h < 10) return 'cafe';
  if (h < 15) return 'almoco';
  if (h < 18) return 'lanche';
  return 'jantar';
}
