# habitos-app

Um aplicativo de rastreamento de hábitos pessoal, moderno e eficiente, construído com **React Native** e **Expo**. O objetivo é ajudar os usuários a criar, monitorar e manter rotinas saudáveis através de uma interface intuitiva e um sistema de notificações robusto.

## ✨ Funcionalidades

- **Gerenciamento de Hábitos**: Crie, edite e exclua hábitos personalizados.
- **Frequência Personalizada**: Escolha os dias da semana específicos para cada hábito.
- **Notificações Locais Inteligentes**:
  - Agendamento recorrente semanal.
  - Sistema robusto para Android e iOS.
  - **Silenciamento Automático**: Ao marcar um hábito como concluído, a notificação do dia é cancelada automaticamente. Se desmarcar, ela é restaurada.
- **Temas**: Suporte completo a **Modo Claro**, **Modo Escuro** e **Padrão do Sistema**.
- **Persistência de Dados**: Todos os dados são salvos localmente no dispositivo.
- **Interface Fluida**: Animações suaves com `react-native-reanimated` e componentes do `react-native-paper`.

## 🛠️ Tecnologias Utilizadas

- **Core**: [React Native](https://reactnative.dev/) (v0.81.5), [Expo](https://expo.dev/) (SDK 54).
- **Linguagem**: JavaScript.
- **Navegação**: [React Navigation](https://reactnavigation.org/) (Stack & Material Bottom Tabs).
- **UI & Design**: [React Native Paper](https://callstack.github.io/react-native-paper/).
- **Animações**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/).
- **Armazenamento**: [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/).
- **Notificações**: [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/).
- **Outros**: `react-native-toast-message` (Feedback visual), `@react-native-community/datetimepicker`.

## 📂 Estrutura do Projeto

```
src/
├── context/          # Context API (Gerenciamento de Tema)
├── mocks/            # Dados fictícios para testes
├── models/           # Modelos de dados (Habit)
├── repositories/     # Camada de acesso a dados (AsyncStorage)
├── routes/           # Configuração de navegação (AppRoutes)
├── screens/          # Telas do aplicativo (Home, NewHabit, Config, etc.)
├── services/         # Lógica de negócios (NotificationService)
├── styles/           # Estilos globais e temas
├── App.js            # Ponto de entrada e configuração global
└── index.js          # Registro do componente principal
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js instalado.
- Gerenciador de pacotes (npm ou yarn).
- Expo CLI (`npm install -g expo-cli`).
- Dispositivo físico (Android/iOS) ou Emulador configurado.

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/siyfred/app-habitos.git
   cd app-habitos
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

### Executando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
npx expo start
```

- **Android**: Pressione `a` no terminal (requer emulador ou dispositivo conectado via USB).
- **iOS**: Pressione `i` no terminal (requer macOS e Simulator).
- **Dispositivo Físico**: Escaneie o QR Code com o app **Expo Go** (Android) ou Câmera (iOS).

> **Nota sobre Notificações**: Para testar o sistema de notificações completo no Android (especialmente as configurações de canal e ícone), recomenda-se gerar um **Development Build** ou testar o APK compilado, pois o Expo Go possui limitações com canais de notificação customizados.

### Gerando Build (Android)

Para gerar um APK de preview (requer conta no EAS):

```bash
eas build -p android --profile preview
```

## 🔗 Links do Projeto

- **Expo Dashboard**: https://expo.dev/accounts/siyfred/projects/habitos-app
- **Link para download da última build**: https://expo.dev/accounts/siyfred/projects/habitos-app/builds/1860848c-c66b-498e-82e0-2c31b7f7a5d8

## 🔔 Detalhes sobre Notificações (Android)

Este projeto implementa uma estratégia específica para lidar com as peculiaridades do `AlarmManager` no Android:
- Utiliza `trigger: { type: 'weekly', ... }` para garantir precisão.
- Define `priority: 'max'` e canais de alta importância para furar otimizações de bateria (Doze Mode).
- Gerencia IDs de notificação individualmente para permitir o cancelamento pontual de dias concluídos.

## 📝 Licença

Este projeto está sob a licença MIT. Sinta-se à vontade para usar e modificar.

