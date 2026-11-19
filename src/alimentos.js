// Base de alimentos comuns no Brasil (valores aproximados por 100 g,
// baseados na Tabela TACO). kcal, p = proteína, c = carboidrato, g = gordura.
// porcao = porção sugerida em gramas, com o nome da medida caseira.
export const ALIMENTOS = [
  { nome: 'Arroz branco cozido', kcal: 128, p: 2.5, c: 28.1, f: 1.6, g: 0.2, porcao: 150, medida: '4 colheres de sopa' },
  { nome: 'Arroz integral cozido', kcal: 124, p: 2.6, c: 25.8, f: 2.7, g: 1.0, porcao: 150, medida: '4 colheres de sopa' },
  { nome: 'Feijão carioca cozido', kcal: 76, p: 4.8, c: 13.6, f: 8.5, g: 0.5, porcao: 140, medida: '1 concha' },
  { nome: 'Feijão preto cozido', kcal: 77, p: 4.5, c: 14.0, f: 8.4, g: 0.5, porcao: 140, medida: '1 concha' },
  { nome: 'Peito de frango grelhado', kcal: 159, p: 32.0, c: 0, f: 0, g: 2.5, porcao: 120, medida: '1 filé' },
  { nome: 'Coxa de frango assada', kcal: 215, p: 28.5, c: 0, f: 0, g: 11.0, porcao: 100, medida: '1 coxa' },
  { nome: 'Carne moída refogada', kcal: 212, p: 26.7, c: 0, f: 0, g: 10.9, porcao: 100, medida: '3 colheres de sopa' },
  { nome: 'Bife de alcatra grelhado', kcal: 241, p: 31.9, c: 0, f: 0, g: 11.6, porcao: 120, medida: '1 bife' },
  { nome: 'Picanha assada', kcal: 289, p: 26.0, c: 0, f: 0, g: 20.0, porcao: 120, medida: '2 fatias' },
  { nome: 'Linguiça toscana grelhada', kcal: 296, p: 18.0, c: 0, f: 0, g: 24.0, porcao: 80, medida: '1 gomo' },
  { nome: 'Tilápia grelhada', kcal: 128, p: 26.0, c: 0, f: 0, g: 2.7, porcao: 120, medida: '1 filé' },
  { nome: 'Atum em lata (água)', kcal: 116, p: 26.0, c: 0, f: 0, g: 1.0, porcao: 60, medida: '1/2 lata' },
  { nome: 'Ovo cozido', kcal: 146, p: 13.3, c: 0.6, f: 0, g: 9.5, porcao: 50, medida: '1 unidade' },
  { nome: 'Ovo frito', kcal: 240, p: 15.6, c: 1.2, f: 0, g: 18.6, porcao: 50, medida: '1 unidade' },
  { nome: 'Pão francês', kcal: 300, p: 8.0, c: 58.6, f: 2.3, g: 3.1, porcao: 50, medida: '1 unidade' },
  { nome: 'Pão de forma integral', kcal: 253, p: 9.4, c: 49.9, f: 6.9, g: 3.7, porcao: 50, medida: '2 fatias' },
  { nome: 'Pão de queijo', kcal: 363, p: 5.1, c: 34.2, f: 0.6, g: 24.6, porcao: 40, medida: '2 unidades pequenas' },
  { nome: 'Tapioca (goma)', kcal: 240, p: 0, c: 60.0, f: 0, g: 0, porcao: 50, medida: '1 tapioca média' },
  { nome: 'Cuscuz de milho cozido', kcal: 113, p: 2.2, c: 25.3, f: 2.1, g: 0.7, porcao: 150, medida: '1 prato raso' },
  { nome: 'Macarrão cozido', kcal: 157, p: 5.8, c: 30.9, f: 1.5, g: 0.9, porcao: 150, medida: '1 pegador' },
  { nome: 'Batata cozida', kcal: 52, p: 1.2, c: 11.9, f: 1.3, g: 0, porcao: 130, medida: '1 unidade média' },
  { nome: 'Batata frita', kcal: 267, p: 5.0, c: 35.6, f: 8.1, g: 13.1, porcao: 100, medida: '1 porção pequena' },
  { nome: 'Batata-doce cozida', kcal: 77, p: 0.6, c: 18.4, f: 2.2, g: 0.1, porcao: 150, medida: '1 unidade média' },
  { nome: 'Mandioca cozida', kcal: 125, p: 0.6, c: 30.1, f: 1.6, g: 0.3, porcao: 100, medida: '2 pedaços' },
  { nome: 'Farofa pronta', kcal: 406, p: 2.1, c: 80.3, f: 7.8, g: 9.1, porcao: 30, medida: '2 colheres de sopa' },
  { nome: 'Salada de alface e tomate', kcal: 15, p: 1.0, c: 2.8, f: 1.5, g: 0.2, porcao: 100, medida: '1 prato de sobremesa' },
  { nome: 'Brócolis cozido', kcal: 25, p: 2.1, c: 4.4, f: 3.4, g: 0.5, porcao: 80, medida: '3 ramos' },
  { nome: 'Cenoura crua', kcal: 34, p: 1.3, c: 7.7, f: 3.2, g: 0.2, porcao: 60, medida: '1/2 unidade' },
  { nome: 'Banana prata', kcal: 98, p: 1.3, c: 26.0, f: 2.0, g: 0.1, porcao: 70, medida: '1 unidade' },
  { nome: 'Maçã', kcal: 56, p: 0.3, c: 15.2, f: 1.3, g: 0, porcao: 130, medida: '1 unidade' },
  { nome: 'Laranja', kcal: 37, p: 1.0, c: 8.9, f: 0.8, g: 0.1, porcao: 180, medida: '1 unidade' },
  { nome: 'Mamão papaia', kcal: 40, p: 0.5, c: 10.4, f: 1.0, g: 0.1, porcao: 150, medida: '1/2 unidade' },
  { nome: 'Abacate', kcal: 96, p: 1.2, c: 6.0, f: 6.3, g: 8.4, porcao: 100, medida: '3 colheres de sopa' },
  { nome: 'Morango', kcal: 30, p: 0.9, c: 6.8, f: 1.7, g: 0.3, porcao: 100, medida: '8 unidades' },
  { nome: 'Açaí com granola', kcal: 180, p: 2.0, c: 30.0, f: 3.0, g: 6.0, porcao: 300, medida: '1 tigela média' },
  { nome: 'Leite integral', kcal: 61, p: 3.2, c: 4.7, f: 0, g: 3.3, porcao: 200, medida: '1 copo' },
  { nome: 'Leite desnatado', kcal: 35, p: 3.4, c: 4.9, f: 0, g: 0.1, porcao: 200, medida: '1 copo' },
  { nome: 'Iogurte natural', kcal: 51, p: 4.1, c: 1.9, f: 0, g: 3.0, porcao: 170, medida: '1 pote' },
  { nome: 'Queijo muçarela', kcal: 330, p: 22.6, c: 3.0, f: 0, g: 25.2, porcao: 30, medida: '2 fatias' },
  { nome: 'Queijo minas frescal', kcal: 264, p: 17.4, c: 3.2, f: 0, g: 20.2, porcao: 30, medida: '1 fatia' },
  { nome: 'Presunto', kcal: 94, p: 14.3, c: 2.1, f: 0, g: 2.7, porcao: 30, medida: '2 fatias' },
  { nome: 'Requeijão', kcal: 257, p: 9.6, c: 2.4, f: 0, g: 23.4, porcao: 30, medida: '1 colher de sopa' },
  { nome: 'Manteiga', kcal: 726, p: 0.4, c: 0, f: 0, g: 82.4, porcao: 10, medida: '1 ponta de faca' },
  { nome: 'Azeite de oliva', kcal: 884, p: 0, c: 0, f: 0, g: 100, porcao: 8, medida: '1 colher de sopa' },
  { nome: 'Pasta de amendoim', kcal: 588, p: 25.0, c: 20.0, f: 6.0, g: 50.0, porcao: 15, medida: '1 colher de sopa' },
  { nome: 'Aveia em flocos', kcal: 394, p: 13.9, c: 66.6, f: 9.1, g: 8.5, porcao: 30, medida: '3 colheres de sopa' },
  { nome: 'Whey protein', kcal: 400, p: 80.0, c: 8.0, f: 0, g: 6.0, porcao: 30, medida: '1 scoop' },
  { nome: 'Café sem açúcar', kcal: 2, p: 0.1, c: 0, f: 0, g: 0, porcao: 50, medida: '1 xícara pequena' },
  { nome: 'Açúcar', kcal: 387, p: 0, c: 99.5, f: 0, g: 0, porcao: 5, medida: '1 colher de chá' },
  { nome: 'Suco de laranja natural', kcal: 45, p: 0.7, c: 10.4, f: 0.5, g: 0.2, porcao: 250, medida: '1 copo' },
  { nome: 'Refrigerante cola', kcal: 42, p: 0, c: 10.6, f: 0, g: 0, porcao: 350, medida: '1 lata' },
  { nome: 'Coxinha de frango', kcal: 300, p: 10.0, c: 30.0, f: 1.5, g: 15.0, porcao: 100, medida: '1 unidade' },
  { nome: 'Pastel de carne', kcal: 330, p: 9.0, c: 30.0, f: 1.2, g: 19.0, porcao: 120, medida: '1 unidade' },
  { nome: 'Pizza de muçarela', kcal: 270, p: 11.0, c: 30.0, f: 2.0, g: 11.5, porcao: 110, medida: '1 fatia' },
  { nome: 'Hambúrguer (sanduíche)', kcal: 260, p: 13.0, c: 28.0, f: 1.5, g: 11.0, porcao: 200, medida: '1 unidade' },
  { nome: 'Lasanha à bolonhesa', kcal: 160, p: 8.5, c: 14.0, f: 1.0, g: 7.5, porcao: 250, medida: '1 pedaço' },
  { nome: 'Strogonoff de frango', kcal: 157, p: 12.0, c: 4.0, f: 0.3, g: 10.5, porcao: 150, medida: '1 concha' },
  { nome: 'Brigadeiro', kcal: 410, p: 4.5, c: 60.0, f: 1.0, g: 17.0, porcao: 20, medida: '1 unidade' },
  { nome: 'Chocolate ao leite', kcal: 540, p: 7.2, c: 59.6, f: 2.2, g: 30.3, porcao: 25, medida: '1 quadradinho grande' },
  { nome: 'Sorvete de creme', kcal: 207, p: 3.5, c: 24.0, f: 0.5, g: 11.0, porcao: 100, medida: '2 bolas' },
  { nome: 'Pipoca com óleo', kcal: 448, p: 9.9, c: 70.3, f: 14.3, g: 15.9, porcao: 30, medida: '1 saquinho pequeno' },
];

// Busca ignorando acentos e maiúsculas
export function normalizar(t) {
  return t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function buscarAlimentos(texto, extras = []) {
  const todos = [...extras, ...ALIMENTOS];
  const q = normalizar(texto.trim());
  if (!q) return todos;
  return todos.filter((a) => normalizar(a.nome).includes(q));
}

// Calcula os valores de uma porção em gramas
export function calcularPorcao(alimento, gramas) {
  const f = gramas / 100;
  return {
    kcal: Math.round(alimento.kcal * f),
    p: +(alimento.p * f).toFixed(1),
    c: +(alimento.c * f).toFixed(1),
    f: +((alimento.f || 0) * f).toFixed(1),
    g: +(alimento.g * f).toFixed(1),
  };
}
