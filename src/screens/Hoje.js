// Tela principal: resumo do dia
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { cores, REFEICOES } from '../theme';
import { calcularMetas, chaveDia, somar } from '../storage';
import Anel from '../components/Anel';
import BarraMacro from '../components/BarraMacro';

export default function Hoje({ estado, onRemover, onAdicionar }) {
  const hoje = chaveDia();
  const itens = estado.registros[hoje] || [];
  const metas = calcularMetas(estado.perfil);
  const total = somar(itens);
  const h = new Date().getHours();
  const saudacao = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  const dataTxt = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const data = dataTxt.charAt(0).toUpperCase() + dataTxt.slice(1);

  return (
    <ScrollView contentContainerStyle={estilos.conteudo} showsVerticalScrollIndicator={false}>
      <Text style={estilos.data}>{data}</Text>
      <Text style={estilos.titulo}>
        {saudacao}, {estado.perfil.nome} 👋
      </Text>

      <LinearGradient colors={cores.cartaoTopo} style={estilos.cartaoAnel}>
        <Anel consumido={Math.round(total.kcal)} meta={metas.kcal} />
        <View style={estilos.macros}>
          <BarraMacro nome="Proteína" valor={total.p} meta={metas.p} cor={cores.proteina} />
          <BarraMacro nome="Carbo" valor={total.c} meta={metas.c} cor={cores.carbo} />
          <BarraMacro nome="Fibras" valor={total.f} meta={metas.f} cor={cores.fibra} />
          <BarraMacro nome="Gordura" valor={total.g} meta={metas.g} cor={cores.gordura} />
        </View>
      </LinearGradient>

      <Semana estado={estado} meta={metas.kcal} />

      {REFEICOES.map((r) => {
        const daRefeicao = itens.filter((i) => i.refeicao === r.id);
        const kcal = Math.round(somar(daRefeicao).kcal);
        return (
          <View key={r.id} style={estilos.cartao}>
            <View style={estilos.cabRefeicao}>
              <View style={estilos.icone}>
                <Ionicons name={r.icone} size={18} color={cores.principal} />
              </View>
              <Text style={estilos.nomeRefeicao}>{r.nome}</Text>
              <Text style={estilos.kcalRefeicao}>{kcal} kcal</Text>
              <Pressable onPress={onAdicionar} hitSlop={10}>
                <Ionicons name="add-circle" size={26} color={cores.principal} />
              </Pressable>
            </View>
            {daRefeicao.map((i) => (
              <View key={i.id} style={estilos.item}>
                <View style={{ flex: 1 }}>
                  <Text style={estilos.itemNome} numberOfLines={1}>{i.nome}</Text>
                  <Text style={estilos.itemInfo}>
                    {i.gramas} g · P {i.p} · C {i.c} · F {i.f || 0} · G {i.g}
                  </Text>
                </View>
                <Text style={estilos.itemKcal}>{i.kcal}</Text>
                <Pressable onPress={() => onRemover(i.id)} hitSlop={10} style={{ marginLeft: 10 }}>
                  <Ionicons name="trash-outline" size={18} color={cores.textoFraco} />
                </Pressable>
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

// Gráfico de barras dos últimos 7 dias
function Semana({ estado, meta }) {
  const dias = [];
  for (let k = 6; k >= 0; k--) {
    const d = new Date();
    d.setDate(d.getDate() - k);
    const kcal = Math.round(somar(estado.registros[chaveDia(d)] || []).kcal);
    dias.push({ letra: d.toLocaleDateString('pt-BR', { weekday: 'narrow' }).toUpperCase(), kcal, hoje: k === 0 });
  }
  const maior = Math.max(meta * 1.2, ...dias.map((d) => d.kcal));
  const alturaMeta = (meta / maior) * 90;

  return (
    <View style={estilos.cartao}>
      <Text style={estilos.nomeRefeicao}>Últimos 7 dias</Text>
      <View style={estilos.grafico}>
        <View style={[estilos.linhaMeta, { bottom: alturaMeta + 18 }]} />
        {dias.map((d, idx) => (
          <View key={idx} style={estilos.coluna}>
            <View style={estilos.trilhoBarra}>
              <LinearGradient
                colors={d.kcal > meta ? [cores.perigo, cores.perigo2] : [cores.principal2, cores.principal]}
                style={[estilos.barra, { height: Math.max(4, (d.kcal / maior) * 90), opacity: d.hoje ? 1 : 0.65 }]}
              />
            </View>
            <Text style={[estilos.letra, d.hoje && { color: cores.texto }]}>{d.letra}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: 20, paddingBottom: 120 },
  data: { color: cores.textoFraco, fontSize: 13 },
  titulo: { color: cores.texto, fontSize: 26, fontWeight: '800', marginTop: 4, marginBottom: 18 },
  cartaoAnel: { borderRadius: 28, padding: 22, alignItems: 'center', borderWidth: 1, borderColor: cores.borda },
  macros: { flexDirection: 'row', marginTop: 22, width: '100%' },
  cartao: { backgroundColor: cores.cartao, borderRadius: 20, padding: 16, marginTop: 14, borderWidth: 1, borderColor: cores.borda },
  cabRefeicao: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icone: { width: 34, height: 34, borderRadius: 10, backgroundColor: cores.realce, alignItems: 'center', justifyContent: 'center' },
  nomeRefeicao: { color: cores.texto, fontSize: 16, fontWeight: '700', flex: 1 },
  kcalRefeicao: { color: cores.textoFraco, fontSize: 13 },
  item: { flexDirection: 'row', alignItems: 'center', paddingTop: 12, marginTop: 12, borderTopWidth: 1, borderTopColor: cores.borda },
  itemNome: { color: cores.texto, fontSize: 14, fontWeight: '600' },
  itemInfo: { color: cores.textoFraco, fontSize: 12, marginTop: 2 },
  itemKcal: { color: cores.principal, fontWeight: '800', fontSize: 15 },
  grafico: { flexDirection: 'row', height: 120, alignItems: 'flex-end', marginTop: 12 },
  linhaMeta: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1, borderStyle: 'dashed', borderColor: cores.textoFraco, opacity: 0.4 },
  coluna: { flex: 1, alignItems: 'center' },
  trilhoBarra: { height: 90, justifyContent: 'flex-end' },
  barra: { width: 18, borderRadius: 6 },
  letra: { color: cores.textoFraco, fontSize: 11, marginTop: 6, fontWeight: '700' },
});
