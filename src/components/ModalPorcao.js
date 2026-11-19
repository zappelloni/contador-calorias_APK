// Janela para escolher quantos gramas e em qual refeição adicionar
import { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, REFEICOES, refeicaoPelaHora } from '../theme';
import { calcularPorcao } from '../alimentos';
import BotaoGradiente from './BotaoGradiente';

export default function ModalPorcao({ alimento, onFechar, onConfirmar }) {
  const [gramas, setGramas] = useState('100');
  const [refeicao, setRefeicao] = useState(refeicaoPelaHora());

  useEffect(() => {
    if (alimento) {
      setGramas(String(alimento.porcao || 100));
      setRefeicao(refeicaoPelaHora());
    }
  }, [alimento]);

  if (!alimento) return null;
  const g = Math.max(0, parseFloat(gramas.replace(',', '.')) || 0);
  const v = calcularPorcao(alimento, g);
  const atalhos = [...new Set([alimento.porcao || 100, 50, 100, 200])].slice(0, 4);

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onFechar}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={estilos.fundo}>
        <Pressable style={{ flex: 1 }} onPress={onFechar} />
        <View style={estilos.folha}>
          <View style={estilos.alca} />
          <View style={estilos.topo}>
            {alimento.imagem ? <Image source={{ uri: alimento.imagem }} style={estilos.foto} /> : null}
            <View style={{ flex: 1 }}>
              <Text style={estilos.nome}>{alimento.nome}</Text>
              <Text style={estilos.info}>
                {alimento.kcal} kcal por 100 g · {alimento.medida} = {alimento.porcao} g
              </Text>
            </View>
          </View>

          <Text style={estilos.rotulo}>Quantidade (g)</Text>
          <View style={estilos.linha}>
            <TextInput
              value={gramas}
              onChangeText={setGramas}
              keyboardType="numeric"
              style={estilos.entrada}
              selectTextOnFocus
            />
            {atalhos.map((a) => (
              <Pressable key={a} onPress={() => setGramas(String(a))} style={[estilos.chip, g === a && estilos.chipAtivo]}>
                <Text style={[estilos.chipTxt, g === a && { color: cores.sobrePrincipal }]}>{a}g</Text>
              </Pressable>
            ))}
          </View>

          <Text style={estilos.rotulo}>Refeição</Text>
          <View style={estilos.linha}>
            {REFEICOES.map((r) => (
              <Pressable key={r.id} onPress={() => setRefeicao(r.id)} style={[estilos.ref, refeicao === r.id && estilos.refAtiva]}>
                <Ionicons name={r.icone} size={18} color={refeicao === r.id ? cores.sobrePrincipal : cores.textoFraco} />
                <Text style={[estilos.refTxt, refeicao === r.id && { color: cores.sobrePrincipal }]} numberOfLines={1}>
                  {r.nome.split(' ')[0]}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={estilos.resumo}>
            <Resumo valor={v.kcal} nome="kcal" cor={cores.principal} />
            <Resumo valor={v.p} nome="proteína" cor={cores.proteina} />
            <Resumo valor={v.c} nome="carbo" cor={cores.carbo} />
            <Resumo valor={v.f} nome="fibras" cor={cores.fibra} />
            <Resumo valor={v.g} nome="gordura" cor={cores.gordura} />
          </View>

          <BotaoGradiente
            titulo="Adicionar"
            icone="add-circle"
            onPress={() => g > 0 && onConfirmar({ ...v, nome: alimento.nome, gramas: g, refeicao })}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Resumo({ valor, nome, cor }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={{ color: cor, fontSize: 20, fontWeight: '800' }}>{valor}</Text>
      <Text style={{ color: cores.textoFraco, fontSize: 11 }}>{nome}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  folha: { backgroundColor: cores.fundo2, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, paddingBottom: 36 },
  alca: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: cores.borda, marginBottom: 16 },
  topo: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 8 },
  foto: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#fff' },
  nome: { color: cores.texto, fontSize: 20, fontWeight: '800' },
  info: { color: cores.textoFraco, fontSize: 13, marginTop: 4 },
  rotulo: { color: cores.textoFraco, fontSize: 13, marginTop: 18, marginBottom: 8 },
  linha: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  entrada: {
    backgroundColor: cores.cartao, color: cores.texto, fontSize: 20, fontWeight: '700',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, minWidth: 90, borderWidth: 1, borderColor: cores.borda,
  },
  chip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: cores.cartao },
  chipAtivo: { backgroundColor: cores.principal },
  chipTxt: { color: cores.texto, fontWeight: '600' },
  ref: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, backgroundColor: cores.cartao, gap: 4 },
  refAtiva: { backgroundColor: cores.principal },
  refTxt: { color: cores.textoFraco, fontSize: 12, fontWeight: '600' },
  resumo: { flexDirection: 'row', backgroundColor: cores.cartao, borderRadius: 16, paddingVertical: 14, marginVertical: 20 },
});
