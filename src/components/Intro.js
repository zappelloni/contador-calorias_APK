// Intro do app: o letreiro GRIXX acende como neon e a linha de batimento corre embaixo.
// Toque na tela para pular.
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, useWindowDimensions, Easing, Platform } from 'react-native';
import Svg, { Text as SvgText, Polyline, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

const VERMELHO = '#FF2E3F';
const ROXO = '#8B2FC9';
const LILAS = '#B66DFF';

// Linha de batimento (mesmo desenho do ícone)
const PONTOS = [
  [150, 700], [380, 700], [420, 640], [460, 760], [500, 610], [540, 720], [570, 700], [874, 700],
];
const PONTOS_TXT = PONTOS.map((p) => p.join(',')).join(' ');
const COMPRIMENTO = PONTOS.slice(1).reduce((t, p, i) => t + Math.hypot(p[0] - PONTOS[i][0], p[1] - PONTOS[i][1]), 0);

export default function Intro({ onFim }) {
  const { width, height } = useWindowDimensions();
  const tamanho = Math.min(width, height) * 1.05;

  const letreiro = useRef(new Animated.Value(0)).current; // acende o GRIXX
  const linha = useRef(new Animated.Value(COMPRIMENTO)).current; // desenha o batimento
  const legenda = useRef(new Animated.Value(0)).current;
  const tela = useRef(new Animated.Value(1)).current; // fade final
  const terminou = useRef(false);

  function fim() {
    if (terminou.current) return;
    terminou.current = true;
    Animated.timing(tela, { toValue: 0, duration: 350, useNativeDriver: true }).start(() => onFim());
  }

  useEffect(() => {
    const pisca = (v, d) => Animated.timing(letreiro, { toValue: v, duration: d, useNativeDriver: true });
    Animated.sequence([
      Animated.delay(250),
      // neon "falhando" antes de acender de vez
      pisca(0.9, 70), pisca(0.1, 90), pisca(1, 60), pisca(0.25, 120), pisca(0.8, 60), pisca(0.4, 80), pisca(1, 140),
      Animated.parallel([
        Animated.timing(linha, { toValue: 0, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
        Animated.timing(legenda, { toValue: 1, duration: 700, delay: 300, useNativeDriver: true }),
      ]),
      Animated.delay(700),
    ]).start(() => fim());
  }, []);

  const textoProps = {
    x: 512, y: 560, fontSize: 250,
    fontFamily: Platform.select({ android: 'sans-serif-black', ios: 'HelveticaNeue-CondensedBlack', default: 'Inter, Arial, sans-serif' }), fontWeight: '900', fontStyle: 'italic', textAnchor: 'middle', letterSpacing: -6,
  };

  return (
    <Pressable style={estilos.tela} onPress={fim}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: tela, alignItems: 'center', justifyContent: 'center' }]}>
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="fundo" cx="50%" cy="45%" r="70%">
              <Stop offset="0" stopColor="#1E0B2B" />
              <Stop offset="1" stopColor="#050307" />
            </RadialGradient>
          </Defs>
          <Rect width={width} height={height} fill="url(#fundo)" />
        </Svg>

        <Animated.View style={{ opacity: letreiro }}>
          <Svg width={tamanho} height={tamanho} viewBox="0 0 1024 1024">
            {/* brilho roxo e vermelho por trás (camadas largas e transparentes) */}
            <SvgText {...textoProps} x={522} fill="none" stroke={ROXO} strokeWidth={60} strokeOpacity={0.18}>GRIXX</SvgText>
            <SvgText {...textoProps} fill="none" stroke={VERMELHO} strokeWidth={40} strokeOpacity={0.2}>GRIXX</SvgText>
            <SvgText {...textoProps} fill="none" stroke={VERMELHO} strokeWidth={22} strokeOpacity={0.45}>GRIXX</SvgText>
            <SvgText {...textoProps} fill="none" stroke={VERMELHO} strokeWidth={12}>GRIXX</SvgText>
            <SvgText {...textoProps} fill="none" stroke="#FFD6DA" strokeWidth={4}>GRIXX</SvgText>

            <AnimatedPolyline points={PONTOS_TXT} fill="none" stroke={LILAS} strokeOpacity={0.25} strokeWidth={34}
              strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${COMPRIMENTO} ${COMPRIMENTO}`} strokeDashoffset={linha} />
            <AnimatedPolyline points={PONTOS_TXT} fill="none" stroke={LILAS} strokeWidth={12}
              strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${COMPRIMENTO} ${COMPRIMENTO}`} strokeDashoffset={linha} />
          </Svg>
        </Animated.View>

        <Animated.Text style={[estilos.legenda, { opacity: legenda }]}>CONTADOR DE CALORIAS</Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#050307' },
  legenda: { position: 'absolute', bottom: 90, color: '#C77DFF', letterSpacing: 6, fontSize: 13, fontWeight: '700' },
});
