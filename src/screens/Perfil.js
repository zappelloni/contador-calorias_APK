// Perfil e metas: o app calcula sozinho quantas calorias comer por dia
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cores, gradiente } from '../theme';
import { calcularMetas, calcularMetasAuto } from '../storage';

const ATIVIDADES = [
  { v: 1.2, nome: 'Parado', desc: 'pouco ou nenhum exercício' },
  { v: 1.375, nome: 'Leve', desc: '1 a 3 treinos por semana' },
  { v: 1.55, nome: 'Moderado', desc: '3 a 5 treinos por semana' },
  { v: 1.725, nome: 'Intenso', desc: '6 a 7 treinos por semana' },
];
const OBJETIVOS = [
  { v: 'perder', nome: 'Perder peso' },
  { v: 'manter', nome: 'Manter' },
  { v: 'ganhar', nome: 'Ganhar massa' },
];

export default function Perfil({ perfil, onMudar }) {
  const metas = calcularMetas(perfil);
  const mudar = (chave, valor) => onMudar({ ...perfil, [chave]: valor });
  const num = (t) => parseFloat(String(t).replace(',', '.')) || 0;
  const manual = perfil.metasManuais?.ativo;

  function ligarManual(ativo) {
    // Ao ligar, começa com os valores que o app já tinha calculado
    const base = perfil.metasManuais || calcularMetasAuto(perfil);
    const { p, c, f, g } = { ...calcularMetasAuto(perfil), ...base };
    mudar('metasManuais', { p, c, f, g, ativo });
  }
  const mudarMacro = (chave, t) => mudar('metasManuais', { ...perfil.metasManuais, [chave]: num(t) });

  return (
    <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
      <Text style={estilos.titulo}>Perfil e metas</Text>

      <LinearGradient colors={gradiente} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={estilos.meta}>
        <Text style={estilos.metaRotulo}>Sua meta diária</Text>
        <Text style={estilos.metaNumero}>{metas.kcal} kcal</Text>
        <Text style={estilos.metaMacros}>
          Proteína {metas.p} g · Carbo {metas.c} g · Fibras {metas.f} g · Gordura {metas.g} g
        </Text>
        <Text style={estilos.metaTmb}>
          {metas.manual ? 'Meta personalizada por você' : `Seu corpo gasta ${metas.tmb} kcal só para funcionar (metabolismo basal)`}
        </Text>
      </LinearGradient>

      <View style={[estilos.cartao, { marginTop: 16 }]}>
        <View style={estilos.linhaSwitch}>
          <View style={{ flex: 1 }}>
            <Text style={estilos.atvNome}>Definir macros manualmente</Text>
            <Text style={estilos.atvDesc}>{manual ? 'Você escolhe os gramas; as calorias se ajustam sozinhas' : 'Desligado: o app calcula pelo seu perfil'}</Text>
          </View>
          <Switch
            value={!!manual}
            onValueChange={ligarManual}
            trackColor={{ false: cores.borda, true: cores.principal2 }}
            thumbColor={manual ? cores.principal : '#ccc'}
          />
        </View>
        {manual ? (
          <>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <Numero rotulo="Proteína (g)" valor={metas.p} cor={cores.proteina} onMudar={(t) => mudarMacro('p', t)} />
              <Numero rotulo="Carbo (g)" valor={metas.c} cor={cores.carbo} onMudar={(t) => mudarMacro('c', t)} />
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Numero rotulo="Fibras (g)" valor={metas.f} cor={cores.fibra} onMudar={(t) => mudarMacro('f', t)} />
              <Numero rotulo="Gordura (g)" valor={metas.g} cor={cores.gordura} onMudar={(t) => mudarMacro('g', t)} />
            </View>
          </>
        ) : null}
      </View>

      <Text style={estilos.secao}>Seus dados</Text>
      <View style={estilos.cartao}>
        <Linha rotulo="Nome">
          <TextInput value={perfil.nome} onChangeText={(t) => mudar('nome', t)} style={estilos.entrada} />
        </Linha>
        <Linha rotulo="Sexo">
          <Opcoes valor={perfil.sexo} opcoes={[{ v: 'M', nome: 'Masculino' }, { v: 'F', nome: 'Feminino' }]} onEscolher={(v) => mudar('sexo', v)} />
        </Linha>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Numero rotulo="Idade" valor={perfil.idade} onMudar={(t) => mudar('idade', num(t))} />
          <Numero rotulo="Peso (kg)" valor={perfil.peso} onMudar={(t) => mudar('peso', num(t))} />
          <Numero rotulo="Altura (cm)" valor={perfil.altura} onMudar={(t) => mudar('altura', num(t))} />
        </View>
      </View>

      <Text style={estilos.secao}>Objetivo</Text>
      <Opcoes valor={perfil.objetivo} opcoes={OBJETIVOS} onEscolher={(v) => mudar('objetivo', v)} />

      <Text style={estilos.secao}>Nível de atividade</Text>
      {ATIVIDADES.map((a) => (
        <Pressable key={a.v} onPress={() => mudar('atividade', a.v)} style={[estilos.atividade, perfil.atividade === a.v && estilos.atividadeAtiva]}>
          <Text style={[estilos.atvNome, perfil.atividade === a.v && { color: cores.principal }]}>{a.nome}</Text>
          <Text style={estilos.atvDesc}>{a.desc}</Text>
        </Pressable>
      ))}
      <Text style={estilos.nota}>Valores estimados. Para uma dieta de verdade, procure um nutricionista.</Text>
    </ScrollView>
  );
}

function Linha({ rotulo, children }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      {children}
    </View>
  );
}

function Numero({ rotulo, valor, onMudar, cor }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={[estilos.rotulo, cor && { color: cor, fontWeight: '700' }]}>{rotulo}</Text>
      <TextInput defaultValue={String(valor)} onChangeText={onMudar} keyboardType="numeric" style={estilos.entrada} selectTextOnFocus />
    </View>
  );
}

function Opcoes({ valor, opcoes, onEscolher }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {opcoes.map((o) => (
        <Pressable key={o.v} onPress={() => onEscolher(o.v)} style={[estilos.opcao, valor === o.v && estilos.opcaoAtiva]}>
          <Text style={[estilos.opcaoTxt, valor === o.v && { color: cores.sobrePrincipal }]}>{o.nome}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: 20, paddingBottom: 120 },
  titulo: { color: cores.texto, fontSize: 26, fontWeight: '800', marginBottom: 16 },
  meta: { borderRadius: 24, padding: 22 },
  metaRotulo: { color: cores.sobrePrincipal, opacity: 0.75, fontWeight: '700' },
  metaNumero: { color: cores.sobrePrincipal, fontSize: 40, fontWeight: '900', letterSpacing: -1 },
  metaMacros: { color: cores.sobrePrincipal, fontWeight: '700', marginTop: 4 },
  metaTmb: { color: cores.sobrePrincipal, opacity: 0.7, fontSize: 12, marginTop: 10 },
  secao: { color: cores.textoFraco, fontSize: 13, marginTop: 22, marginBottom: 10, fontWeight: '600' },
  cartao: { backgroundColor: cores.cartao, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: cores.borda },
  rotulo: { color: cores.textoFraco, fontSize: 12, marginBottom: 6 },
  entrada: { backgroundColor: cores.fundo2, color: cores.texto, fontSize: 16, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: cores.borda },
  opcao: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: cores.cartao, borderWidth: 1, borderColor: cores.borda },
  opcaoAtiva: { backgroundColor: cores.principal, borderColor: cores.principal },
  opcaoTxt: { color: cores.texto, fontWeight: '700', fontSize: 13 },
  atividade: { backgroundColor: cores.cartao, borderRadius: 16, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: cores.borda },
  atividadeAtiva: { borderColor: cores.principal, backgroundColor: cores.realce },
  atvNome: { color: cores.texto, fontWeight: '700', fontSize: 15 },
  atvDesc: { color: cores.textoFraco, fontSize: 12, marginTop: 2 },
  linhaSwitch: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nota: { color: cores.textoFraco, fontSize: 11, textAlign: 'center', marginTop: 16, opacity: 0.7 },
});
