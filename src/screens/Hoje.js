// Tela principal: resumo do dia
import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { cores, todasRefeicoes } from '../theme';
import BotaoGradiente from '../components/BotaoGradiente';
import { calcularMetas, chaveDia, somar } from '../storage';
import Anel from '../components/Anel';
import BarraMacro from '../components/BarraMacro';

export default function Hoje({ estado, onRemover, onAdicionar, onNovaRefeicao, onApagarRefeicao }) {
  const [criando, setCriando] = useState(false);
  const [nomeNova, setNomeNova] = useState('');

  function confirmarApagar(r) {
    Alert.alert(`Apagar "${r.nome}"?`, 'Ela some da sua lista de refeições. Os alimentos já anotados nela também saem do dia.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Apagar', style: 'destructive', onPress: () => onApagarRefeicao(r.id) },
    ]);
  }

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

      {todasRefeicoes(estado.refeicoesExtras).map((r) => {
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
              {r.extra ? (
                <Pressable onPress={() => confirmarApagar(r)} hitSlop={10}>
                  <Ionicons name="trash-outline" size={20} color={cores.textoFraco} />
                </Pressable>
              ) : null}
              <Pressable onPress={() => onAdicionar(r.id)} hitSlop={10}>
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

      <Pressable onPress={() => setCriando(true)} style={({ pressed }) => [estilos.novaRefeicao, pressed && { opacity: 0.7 }]}>
        <Ionicons name="add-circle-outline" size={22} color={cores.principal} />
        <Text style={estilos.novaTxt}>Nova refeição</Text>
      </Pressable>

      <Modal visible={criando} transparent animationType="fade" onRequestClose={() => setCriando(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={estilos.modalFundo}>
          <View style={estilos.modalCaixa}>
            <Text style={estilos.nomeRefeicao}>Nova refeição</Text>
            <Text style={estilos.itemInfo}>Ex.: Ceia, Pré-treino, Lanche da manhã</Text>
            <TextInput
              value={nomeNova}
              onChangeText={setNomeNova}
              placeholder="Nome da refeição"
              placeholderTextColor={cores.textoFraco}
              style={estilos.entrada}
              autoFocus
              maxLength={24}
            />
            <BotaoGradiente
              titulo="Criar"
              icone="checkmark-circle"
              estilo={{ opacity: nomeNova.trim() ? 1 : 0.5 }}
              onPress={() => {
                if (!nomeNova.trim()) return;
                onNovaRefeicao(nomeNova.trim());
                setNomeNova('');
                setCriando(false);
              }}
            />
            <Pressable onPress={() => setCriando(false)} style={{ alignItems: 'center', padding: 14 }}>
              <Text style={{ color: cores.textoFraco }}>Cancelar</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  novaRefeicao: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, padding: 16,
    borderRadius: 20, borderWidth: 1.5, borderStyle: 'dashed', borderColor: cores.principal,
  },
  novaTxt: { color: cores.principal, fontWeight: '700', fontSize: 15 },
  modalFundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  modalCaixa: { backgroundColor: cores.fundo2, borderRadius: 24, padding: 22, borderWidth: 1, borderColor: cores.borda },
  entrada: {
    backgroundColor: cores.cartao, color: cores.texto, fontSize: 17, borderRadius: 12, paddingHorizontal: 14,
    paddingVertical: 12, borderWidth: 1, borderColor: cores.borda, marginTop: 14, marginBottom: 16,
  },
  grafico: { flexDirection: 'row', height: 120, alignItems: 'flex-end', marginTop: 12 },
  linhaMeta: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1, borderStyle: 'dashed', borderColor: cores.textoFraco, opacity: 0.4 },
  coluna: { flex: 1, alignItems: 'center' },
  trilhoBarra: { height: 90, justifyContent: 'flex-end' },
  barra: { width: 18, borderRadius: 6 },
  letra: { color: cores.textoFraco, fontSize: 11, marginTop: 6, fontWeight: '700' },
});
