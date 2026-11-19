// Busca um produto pelo código de barras no Open Food Facts
// (base gratuita e aberta, tem muitos produtos brasileiros).
const URL_BASE = 'https://world.openfoodfacts.org/api/v2/product/';
const CAMPOS = 'product_name,product_name_pt,brands,nutriments,serving_quantity,image_front_small_url';

export async function buscarPorCodigo(codigo) {
  const resp = await fetch(`${URL_BASE}${codigo}.json?fields=${CAMPOS}`, {
    headers: { 'User-Agent': 'ContadorCalorias/1.0 (app de estudo)' },
  });
  if (!resp.ok && resp.status !== 404) throw new Error('Sem conexão com a base de produtos');
  const dados = await resp.json();
  if (dados.status !== 1 || !dados.product) return null;

  const pr = dados.product;
  const n = pr.nutriments || {};
  let kcal = n['energy-kcal_100g'];
  if (kcal == null && n['energy_100g'] != null) kcal = n['energy_100g'] / 4.184; // kJ -> kcal
  if (kcal == null) return null; // sem informação nutricional: usuário cadastra

  const nome = pr.product_name_pt || pr.product_name || 'Produto sem nome';
  return {
    codigo,
    nome: pr.brands ? `${nome} (${pr.brands.split(',')[0].trim()})` : nome,
    kcal: Math.round(kcal),
    p: +(n.proteins_100g || 0).toFixed(1),
    c: +(n.carbohydrates_100g || 0).toFixed(1),
    f: +(n.fiber_100g || 0).toFixed(1),
    g: +(n.fat_100g || 0).toFixed(1),
    porcao: Math.round(pr.serving_quantity) || 100,
    medida: pr.serving_quantity ? '1 porção do rótulo' : '100 g',
    imagem: pr.image_front_small_url || null,
  };
}
