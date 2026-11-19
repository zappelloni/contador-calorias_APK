// Tudo fica salvo no próprio celular (AsyncStorage).
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = 'calorias-app:v1';

export const PERFIL_PADRAO = {
  nome: 'Gabriel',
  sexo: 'M',
  idade: 20,
  peso: 75,
  altura: 175,
  atividade: 1.55,
  objetivo: 'manter',
};

export const ESTADO_INICIAL = {
  perfil: PERFIL_PADRAO,
  registros: {}, // { '2026-11-19': [ { id, nome, gramas, kcal, p, c, g, refeicao } ] }
  meusProdutos: {}, // produtos cadastrados à mão, por código de barras
  recentes: [],
};

export async function carregar() {
  try {
    const txt = await AsyncStorage.getItem(CHAVE);
    if (!txt) return ESTADO_INICIAL;
    return { ...ESTADO_INICIAL, ...JSON.parse(txt) };
  } catch {
    return ESTADO_INICIAL;
  }
}

export async function salvar(estado) {
  try {
    await AsyncStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {}
}

export function chaveDia(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dia}`;
}

// Meta diária: fórmula de Mifflin-St Jeor x nível de atividade, ajustada pelo objetivo
export function calcularMetas(perfil) {
  const { sexo, idade, peso, altura, atividade, objetivo } = perfil;
  const tmb = 10 * peso + 6.25 * altura - 5 * idade + (sexo === 'M' ? 5 : -161);
  let kcal = tmb * atividade;
  if (objetivo === 'perder') kcal -= 500;
  if (objetivo === 'ganhar') kcal += 300;
  kcal = Math.max(1200, Math.round(kcal / 10) * 10);
  const p = Math.round(peso * (objetivo === 'manter' ? 1.6 : 2.0));
  const g = Math.round((kcal * 0.27) / 9);
  const c = Math.max(0, Math.round((kcal - p * 4 - g * 9) / 4));
  const f = sexo === 'M' ? 30 : 25; // fibras recomendadas por dia
  return { kcal, p, c, f, g, tmb: Math.round(tmb) };
}

export function somar(itens) {
  return itens.reduce(
    (t, i) => ({ kcal: t.kcal + i.kcal, p: t.p + i.p, c: t.c + i.c, f: t.f + (i.f || 0), g: t.g + i.g }),
    { kcal: 0, p: 0, c: 0, f: 0, g: 0 }
  );
}
