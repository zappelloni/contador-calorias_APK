// Leitor de código de barras: aponta a câmera, busca o produto e devolve para o app.
// Se o produto não existir na base, o usuário cadastra uma vez e fica salvo.
import { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ActivityIndicator, TextInput, ScrollView, KeyboardAvoidingView, Platform, Animated, Easing } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../theme';
import { buscarPorCodigo } from '../openFoodFacts';
import BotaoGradiente from '../components/BotaoGradiente';

export default function Scanner({ visivel, meusProdutos, onFechar, onEncontrado, onCadastrar }) {
  const [permissao, pedirPermissao] = useCameraPermissions();
  const [status, setStatus] = useState('lendo'); // lendo | buscando | naoEncontrado | erro
  const [codigo, setCodigo] = useState('');
  const [lanterna, setLanterna] = useState(false);
  const travado = useRef(false);
  // Tamanho real da tela da câmera (para centralizar a mira certinho)
  const [area, setArea] = useState({ w: 0, h: 0 });
  const mW = Math.min(area.w * 0.86, 420);
  const mH = mW * 0.62;
  const mX = (area.w - mW) / 2;
  const mY = (area.h - mH) / 2;
  // Linha da mira subindo e descendo
  const laser = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(laser, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(laser, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  function reiniciar() {
    travado.current = false;
    setStatus('lendo');
    setCodigo('');
  }

  function fechar() {
    reiniciar();
    setLanterna(false);
    onFechar();
  }

  async function aoLer({ data }) {
    if (travado.current) return; // evita ler o mesmo código várias vezes
    travado.current = true;
    setCodigo(data);

    if (meusProdutos[data]) {
      reiniciar();
      onEncontrado(meusProdutos[data]);
      return;
    }
    setStatus('buscando');
    try {
      const produto = await buscarPorCodigo(data);
      if (produto) {
        reiniciar();
        onEncontrado(produto);
      } else {
        setStatus('naoEncontrado');
      }
    } catch {
      setStatus('erro');
    }
  }

  return (
    <Modal visible={visivel} animationType="slide" onRequestClose={fechar} statusBarTranslucent navigationBarTranslucent>
      <View style={estilos.tela} onLayout={(e) => setArea({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
        {!permissao ? null : !permissao.granted ? (
          <View style={estilos.centro}>
            <Ionicons name="camera-outline" size={64} color={cores.principal} />
            <Text style={estilos.titulo}>Precisamos da câmera</Text>
            <Text style={estilos.texto}>Para ler o código de barras dos produtos.</Text>
            <BotaoGradiente titulo="Permitir câmera" onPress={pedirPermissao} estilo={{ marginTop: 20, width: 240 }} />
          </View>
        ) : status === 'naoEncontrado' ? (
          <Cadastro
            codigo={codigo}
            onSalvar={(p) => {
              onCadastrar(p);
              reiniciar();
            }}
            onVoltar={reiniciar}
          />
        ) : (
          <>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              enableTorch={lanterna}
              barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
              onBarcodeScanned={status === 'lendo' ? aoLer : undefined}
            />
            {area.w > 0 ? (
              <View style={StyleSheet.absoluteFill} pointerEvents="none">
                {/* escurece tudo em volta da mira */}
                <View style={[estilos.sombra, { top: 0, left: 0, right: 0, height: mY }]} />
                <View style={[estilos.sombra, { top: mY + mH, left: 0, right: 0, bottom: 0 }]} />
                <View style={[estilos.sombra, { top: mY, left: 0, width: mX, height: mH }]} />
                <View style={[estilos.sombra, { top: mY, right: 0, width: mX, height: mH }]} />

                <View style={{ position: 'absolute', left: mX, top: mY, width: mW, height: mH }}>
                  <View style={[estilos.canto, { top: 0, left: 0, borderTopWidth: 5, borderLeftWidth: 5 }]} />
                  <View style={[estilos.canto, { top: 0, right: 0, borderTopWidth: 5, borderRightWidth: 5 }]} />
                  <View style={[estilos.canto, { bottom: 0, left: 0, borderBottomWidth: 5, borderLeftWidth: 5 }]} />
                  <View style={[estilos.canto, { bottom: 0, right: 0, borderBottomWidth: 5, borderRightWidth: 5 }]} />
                  <Animated.View
                    style={[estilos.laser, { transform: [{ translateY: laser.interpolate({ inputRange: [0, 1], outputRange: [14, mH - 16] }) }] }]}
                  />
                </View>

                <View style={[estilos.aviso, { top: mY + mH + 28 }]}>
                  {status === 'buscando' ? (
                    <>
                      <ActivityIndicator color={cores.principal} />
                      <Text style={estilos.avisoTxt}>Buscando {codigo}...</Text>
                    </>
                  ) : status === 'erro' ? (
                    <Text style={estilos.avisoTxt}>Sem internet. Toque para tentar de novo.</Text>
                  ) : (
                    <Text style={estilos.avisoTxt}>Aponte para o código de barras</Text>
                  )}
                </View>
              </View>
            ) : null}
            {status === 'erro' ? <Pressable style={StyleSheet.absoluteFill} onPress={reiniciar} /> : null}
          </>
        )}

        <View style={estilos.barraTopo}>
          <Pressable onPress={fechar} style={estilos.botaoRedondo}>
            <Ionicons name="close" size={24} color="#fff" />
          </Pressable>
          {permissao?.granted && status !== 'naoEncontrado' ? (
            <Pressable onPress={() => setLanterna(!lanterna)} style={estilos.botaoRedondo}>
              <Ionicons name={lanterna ? 'flash' : 'flash-outline'} size={22} color="#fff" />
            </Pressable>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

// Formulário para cadastrar um produto que não está na base (copiando da tabela nutricional)
function Cadastro({ codigo, onSalvar, onVoltar }) {
  const [f, setF] = useState({ nome: '', porcao: '', kcal: '', p: '', c: '', f: '', g: '' });
  const num = (t) => parseFloat(String(t).replace(',', '.')) || 0;
  const pronto = f.nome.trim() && num(f.porcao) > 0 && num(f.kcal) > 0;

  function salvar() {
    // O rótulo mostra os valores por porção: convertemos para 100 g
    const fator = 100 / num(f.porcao);
    onSalvar({
      codigo,
      nome: f.nome.trim(),
      porcao: num(f.porcao),
      medida: '1 porção do rótulo',
      kcal: Math.round(num(f.kcal) * fator),
      p: +(num(f.p) * fator).toFixed(1),
      c: +(num(f.c) * fator).toFixed(1),
      f: +(num(f.f) * fator).toFixed(1),
      g: +(num(f.g) * fator).toFixed(1),
    });
  }

  const Campo = ({ chave, rotulo, teclado = 'numeric' }) => (
    <View style={{ flex: 1 }}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput
        value={f[chave]}
        onChangeText={(t) => setF((x) => ({ ...x, [chave]: t }))}
        keyboardType={teclado}
        style={estilos.entrada}
        placeholderTextColor={cores.textoFraco}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 22, paddingTop: 100 }} keyboardShouldPersistTaps="handled">
        <Text style={estilos.titulo}>Produto novo!</Text>
        <Text style={estilos.texto}>
          O código {codigo} não está na base. Copie da tabela nutricional da embalagem. Só precisa fazer isso uma vez.
        </Text>
        {Campo({ chave: 'nome', rotulo: 'Nome do produto', teclado: 'default' })}
        <View style={estilos.linha}>
          {Campo({ chave: 'porcao', rotulo: 'Porção (g)' })}
          {Campo({ chave: 'kcal', rotulo: 'Calorias (kcal)' })}
        </View>
        <View style={estilos.linha}>
          {Campo({ chave: 'c', rotulo: 'Carboidratos (g)' })}
          {Campo({ chave: 'f', rotulo: 'Fibras (g)' })}
        </View>
        <View style={estilos.linha}>
          {Campo({ chave: 'p', rotulo: 'Proteínas (g)' })}
          {Campo({ chave: 'g', rotulo: 'Gorduras (g)' })}
        </View>
        <BotaoGradiente titulo="Salvar e adicionar" icone="checkmark-circle" onPress={() => pronto && salvar()} estilo={{ marginTop: 24, opacity: pronto ? 1 : 0.5 }} />
        <Pressable onPress={onVoltar} style={{ alignItems: 'center', padding: 16 }}>
          <Text style={{ color: cores.textoFraco }}>Escanear outro</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  titulo: { color: cores.texto, fontSize: 24, fontWeight: '800', marginTop: 14 },
  texto: { color: cores.textoFraco, fontSize: 14, marginTop: 8, lineHeight: 20 },
  sombra: { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.55)' },
  canto: { position: 'absolute', width: 46, height: 46, borderColor: cores.principal, borderRadius: 6 },
  laser: { position: 'absolute', top: 0, left: 18, right: 18, height: 3, borderRadius: 2, backgroundColor: cores.principal2, opacity: 0.9 },
  aviso: { position: 'absolute', alignSelf: 'center', flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: 'rgba(8,6,11,0.85)', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 20 },
  avisoTxt: { color: '#fff', fontWeight: '600' },
  barraTopo: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  botaoRedondo: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  rotulo: { color: cores.textoFraco, fontSize: 12, marginTop: 16, marginBottom: 6 },
  entrada: { backgroundColor: cores.cartao, color: cores.texto, fontSize: 16, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, borderColor: cores.borda },
  linha: { flexDirection: 'row', gap: 10 },
});
