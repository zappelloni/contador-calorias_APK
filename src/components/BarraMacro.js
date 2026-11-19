// Barrinha de um macronutriente (proteína, carboidrato ou gordura)
import { View, Text, StyleSheet } from 'react-native';
import { cores } from '../theme';

export default function BarraMacro({ nome, valor, meta, cor }) {
  const pct = meta > 0 ? Math.min(valor / meta, 1) : 0;
  return (
    <View style={estilos.caixa}>
      <Text style={estilos.nome}>{nome}</Text>
      <View style={estilos.trilho}>
        <View style={[estilos.cheio, { width: `${pct * 100}%`, backgroundColor: cor }]} />
      </View>
      <Text style={estilos.valor}>
        {Math.round(valor)}
        <Text style={estilos.meta}> / {meta} g</Text>
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { flex: 1, paddingHorizontal: 6 },
  nome: { color: cores.textoFraco, fontSize: 12, marginBottom: 6 },
  trilho: { height: 8, borderRadius: 4, backgroundColor: cores.borda, overflow: 'hidden' },
  cheio: { height: '100%', borderRadius: 4 },
  valor: { color: cores.texto, fontSize: 15, fontWeight: '700', marginTop: 6 },
  meta: { color: cores.textoFraco, fontSize: 12, fontWeight: '400' },
});
