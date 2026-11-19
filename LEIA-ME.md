# Contador de Calorias (Android + iPhone)

App feito com **Expo (React Native)**: um código só roda no Android e no iPhone.

## O que já funciona
- **Hoje**: anel com calorias restantes, barras de proteína, carbo, fibras e gordura, gráfico dos últimos 7 dias e as refeições do dia (Café, Almoço, Lanches, Jantar). Lixeira apaga um item.
- **Adicionar (+)**: busca em ~60 alimentos brasileiros (tabela TACO), recentes, escolhe gramas e refeição.
- **Código de barras**: abre a câmera, lê EAN-13/EAN-8/UPC e busca o produto no Open Food Facts (base grátis com muitos produtos do Brasil). Se não achar, você cadastra uma vez copiando a tabela nutricional da embalagem e o app lembra pelo código.
- **Metas**: calcula a meta diária (fórmula Mifflin-St Jeor) pelo sexo, idade, peso, altura, atividade e objetivo.
- Tudo fica salvo no próprio celular.

## Como testar no celular (uma vez só de preparo)
1. No PC: instale o **Node.js LTS** (nodejs.org) se ainda não tiver.
2. No celular: instale o app **Expo Go** (Play Store ou App Store).
3. Dê dois cliques em **Iniciar App.bat**. Na primeira vez ele instala tudo (demora uns minutos).
4. Vai aparecer um **QR Code** no terminal.
   - Android: abra o Expo Go e toque em "Scan QR code".
   - iPhone: abra a câmera normal e aponte para o QR.
5. PC e celular precisam estar **no mesmo Wi-Fi**. Se não conectar, feche e rode `npx expo start --tunnel` no terminal da pasta.

Quando você salvar um arquivo no VS Code, o app atualiza sozinho no celular.

## Onde mexer
| Arquivo | O que tem |
|---|---|
| `App.js` | junta as telas e a barra de baixo |
| `src/theme.js` | cores do app (troca o visual inteiro) |
| `src/alimentos.js` | lista de alimentos (adicione os seus) |
| `src/openFoodFacts.js` | busca pelo código de barras |
| `src/storage.js` | salvar dados e cálculo das metas |
| `src/screens/` | telas: Hoje, Adicionar, Scanner, Perfil |

## Próximos passos possíveis
- Água do dia, peso ao longo do tempo, foto do prato com IA, login e sincronizar na nuvem.
- Publicar nas lojas com EAS Build (Google Play custa US$ 25 uma vez; Apple, US$ 99 por ano).

## Instalar direto no celular (APK, Android)
1. Crie uma conta grátis em **expo.dev**.
2. Dê dois cliques em **Gerar APK (Android).bat** e faça login quando ele pedir.
3. O Expo monta o app na nuvem (uns 10 a 15 minutos) e mostra um **link e um QR Code**.
4. Abra o link no celular, baixe e toque em **Instalar** (se o Android perguntar, permita "instalar apps desconhecidos").

iPhone: a Apple não deixa instalar arquivo direto; precisa de conta de desenvolvedor (US$ 99/ano) ou usar o Expo Go.
