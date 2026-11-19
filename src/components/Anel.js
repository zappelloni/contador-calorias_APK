// Anel de progresso das calorias do dia
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { cores } from '../theme';

export default function Anel({ consumido, meta, tamanho = 220, espessura = 18 }) {
  const raio = (tamanho - espessura) / 2;
  const circ = 2 * Math.PI * raio;
  const pct = meta > 0 ? Math.min(consumido / meta, 1) : 0;
  const passou = consumido > meta;
  const restante = Math.abs(meta - consumido);

  return (
    <View style={{ width: tamanho, height: tamanho, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={tamanho} height={tamanho} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={passou ? cores.perigo : cores.principal} />
            <Stop offset="1" stopColor={passou ? cores.perigo2 : cores.principal2} />
          </LinearGradient>
        </Defs>
        <Circle cx={tamanho / 2} cy={tamanho / 2} r={raio} stroke={cores.borda} strokeWidth={espessura} fill="none" />
        <Circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={raio}
          stroke="url(#grad)"
          strokeWidth={espessura}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={circ * (1 - pct)}
          transform={`rotate(-90 ${tamanho / 2} ${tamanho / 2})`}
        />
      </Svg>
      <Text style={estilos.numero}>{restante}</Text>
      <Text style={estilos.legenda}>{passou ? 'kcal acima da meta' : 'kcal restantes'}</Text>
      <Text style={estilos.sub}>
        {consumido} / {meta}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  numero: { color: cores.texto, fontSize: 46, fontWeight: '800', letterSpacing: -1 },
  legenda: { color: cores.textoFraco, fontSize: 14, marginTop: -2 },
  sub: { color: cores.textoFraco, fontSize: 12, marginTop: 6, opacity: 0.8 },
});
