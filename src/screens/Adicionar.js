// Tela de adicionar: busca na base de alimentos ou escaneia o código de barras
import { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../theme';
import { buscarAlimentos } from '../alimentos';
import BotaoGradiente from '../components/BotaoGradiente';

export default function Adicionar({ estado, onEscolher, onEscanear }) {
  const [busca, setBusca] = useState('');
  const meus = Object.values(estado.meusProdutos);
  const lista = buscarAlimentos(busca, meus);

  return (
    <View style={{ flex: 1 }}>
      <View style={estilos.topo}>
        <Text style={estilos.titulo}>Adicionar alimento</Text>
        <BotaoGradiente titulo="Escanear código de barras" icone="barcode-outline" onPress={onEscanear} />
        <View style={estilos.busca}>
          <Ionicons name="search" size={18} color={cores.textoFraco} />
          <TextInput
            placeholder="Buscar: arroz, frango, banana..."
            placeholderTextColor={cores.textoFraco}
            value={busca}
            onChangeText={setBusca}
            style={estilos.entrada}
          />
          {busca ? (
            <Pressable onPress={() => setBusca('')}>
              <Ionicons name="close-circle" size={18} color={cores.textoFraco} />
            </Pressable>
          ) : null}
        </View>

        {!busca && estado.recentes.length > 0 ? (
          <>
            <Text style={estilos.secao}>Recentes</Text>
            <View style={estilos.chips}>
              {estado.recentes.slice(0, 6).map((a) => (
                <Pressable key={a.nome} onPress={() => onEscolher(a)} style={estilos.chip}>
                  <Text style={estilos.chipTxt} numberOfLines={1}>{a.nome}</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : null}
        <Text style={estilos.secao}>{busca ? `${lista.length} resultados` : 'Todos os alimentos'}</Text>
      </View>

      <FlatList
        data={lista}
        keyExtractor={(a) => a.codigo || a.nome}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Pressable onPress={() => onEscolher(item)} style={({ pressed }) => [estilos.item, pressed && { opacity: 0.7 }]}>
            <View style={{ flex: 1 }}>
              <Text style={estilos.itemNome}>
                {item.codigo ? '🏷️ ' : ''}
                {item.nome}
              </Text>
              <Text style={estilos.itemInfo}>
                {item.medida} ({item.porcao} g) · {Math.round((item.kcal * item.porcao) / 100)} kcal
              </Text>
            </View>
            <Ionicons name="add-circle-outline" size={24} color={cores.principal} />
          </Pressable>
        )}
        ListEmptyComponent={<Text style={estilos.vazio}>Nada encontrado. Tente escanear o código de barras.</Text>}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  topo: { padding: 20, paddingBottom: 4 },
  titulo: { color: cores.texto, fontSize: 26, fontWeight: '800', marginBottom: 16 },
  busca: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: cores.cartao, borderRadius: 14,
    paddingHorizontal: 14, marginTop: 14, borderWidth: 1, borderColor: cores.borda,
  },
  entrada: { flex: 1, color: cores.texto, fontSize: 15, paddingVertical: 14 },
  secao: { color: cores.textoFraco, fontSize: 13, marginTop: 18, marginBottom: 8, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: cores.realce, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, maxWidth: '48%' },
  chipTxt: { color: cores.principal, fontWeight: '600', fontSize: 13 },
  item: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: cores.cartao, borderRadius: 16,
    padding: 14, marginBottom: 8, borderWidth: 1, borderColor: cores.borda,
  },
  itemNome: { color: cores.texto, fontSize: 15, fontWeight: '600' },
  itemInfo: { color: cores.textoFraco, fontSize: 12, marginTop: 3 },
  vazio: { color: cores.textoFraco, textAlign: 'center', marginTop: 30 },
});
