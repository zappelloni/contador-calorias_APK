import { Pressable, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { cores, gradiente } from '../theme';

export default function BotaoGradiente({ titulo, icone, onPress, estilo }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, estilo]}>
      <LinearGradient colors={gradiente} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={estilos.botao}>
        <View style={estilos.linha}>
          {icone ? <Ionicons name={icone} size={20} color={cores.sobrePrincipal} /> : null}
          <Text style={estilos.texto}>{titulo}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: { borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20 },
  linha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  texto: { color: cores.sobrePrincipal, fontSize: 16, fontWeight: '800' },
});
