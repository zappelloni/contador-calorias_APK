// App de contar calorias: junta as telas e guarda os dados.
import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { cores } from './src/theme';
import { carregar, salvar, chaveDia, ESTADO_INICIAL } from './src/storage';
import Hoje from './src/screens/Hoje';
import Adicionar from './src/screens/Adicionar';
import Perfil from './src/screens/Perfil';
import Scanner from './src/screens/Scanner';
import ModalPorcao from './src/components/ModalPorcao';

const ABAS = [
  { id: 'hoje', nome: 'Hoje', icone: 'pie-chart' },
  { id: 'adicionar', nome: 'Adicionar', icone: 'add' },
  { id: 'perfil', nome: 'Metas', icone: 'person' },
];

export default function App() {
  const [estado, setEstado] = useState(ESTADO_INICIAL);
  const [carregado, setCarregado] = useState(false);
  const [aba, setAba] = useState('hoje');
  const [escolhido, setEscolhido] = useState(null); // alimento aberto no ModalPorcao
  const [scanner, setScanner] = useState(false);

  useEffect(() => {
    carregar().then((e) => {
      setEstado(e);
      setCarregado(true);
    });
  }, []);

  // Sempre que algo muda, salva no celular
  useEffect(() => {
    if (carregado) salvar(estado);
  }, [estado, carregado]);

  function adicionarItem(item, alimento) {
    const dia = chaveDia();
    setEstado((e) => ({
      ...e,
      registros: { ...e.registros, [dia]: [...(e.registros[dia] || []), { ...item, id: Date.now().toString() }] },
      recentes: [alimento, ...e.recentes.filter((r) => r.nome !== alimento.nome)].slice(0, 10),
    }));
    setEscolhido(null);
    setAba('hoje');
  }

  function removerItem(id) {
    const dia = chaveDia();
    setEstado((e) => ({ ...e, registros: { ...e.registros, [dia]: (e.registros[dia] || []).filter((i) => i.id !== id) } }));
  }

  function cadastrarProduto(produto) {
    setEstado((e) => ({ ...e, meusProdutos: { ...e.meusProdutos, [produto.codigo]: produto } }));
    setScanner(false);
    setTimeout(() => setEscolhido(produto), 400); // espera a câmera fechar
  }

  if (!carregado) {
    return (
      <View style={[estilos.tela, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={cores.principal} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={estilos.tela} edges={['top']}>
        <StatusBar style="light" />
        {aba === 'hoje' && <Hoje estado={estado} onRemover={removerItem} onAdicionar={() => setAba('adicionar')} />}
        {aba === 'adicionar' && <Adicionar estado={estado} onEscolher={setEscolhido} onEscanear={() => setScanner(true)} />}
        {aba === 'perfil' && <Perfil perfil={estado.perfil} onMudar={(perfil) => setEstado((e) => ({ ...e, perfil }))} />}

        {/* Barra de abas embaixo */}
        <View style={estilos.abas}>
          {ABAS.map((a) => {
            const ativa = aba === a.id;
            if (a.id === 'adicionar') {
              return (
                <Pressable key={a.id} onPress={() => setAba(a.id)} style={estilos.abaCentro}>
                  <View style={[estilos.botaoMais, ativa && { transform: [{ scale: 1.08 }] }]}>
                    <Ionicons name="add" size={32} color={cores.sobrePrincipal} />
                  </View>
                </Pressable>
              );
            }
            return (
              <Pressable key={a.id} onPress={() => setAba(a.id)} style={estilos.aba}>
                <Ionicons name={ativa ? a.icone : `${a.icone}-outline`} size={22} color={ativa ? cores.principal : cores.textoFraco} />
                <Text style={[estilos.abaTxt, ativa && { color: cores.principal }]}>{a.nome}</Text>
              </Pressable>
            );
          })}
        </View>

        <Scanner
          visivel={scanner}
          meusProdutos={estado.meusProdutos}
          onFechar={() => setScanner(false)}
          onEncontrado={(p) => {
            setScanner(false);
            setTimeout(() => setEscolhido(p), 400); // espera a câmera fechar
          }}
          onCadastrar={cadastrarProduto}
        />
        <ModalPorcao alimento={escolhido} onFechar={() => setEscolhido(null)} onConfirmar={(item) => adicionarItem(item, escolhido)} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  abas: {
    position: 'absolute', left: 16, right: 16, bottom: 24, height: 70, borderRadius: 26,
    backgroundColor: cores.barraAbas, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: cores.borda,
    shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 12,
  },
  aba: { flex: 1, alignItems: 'center', gap: 3 },
  abaTxt: { color: cores.textoFraco, fontSize: 11, fontWeight: '600' },
  abaCentro: { flex: 1, alignItems: 'center' },
  botaoMais: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: cores.principal, alignItems: 'center', justifyContent: 'center',
    marginTop: -30, borderWidth: 4, borderColor: cores.fundo,
    shadowColor: cores.principal, shadowOpacity: 0.6, shadowRadius: 14, elevation: 10,
  },
});
