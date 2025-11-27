import { colors_white } from './theme.js';

export const fab = {
  backgroundColor: colors_white.primary,
  position: 'absolute',
  borderRadius: 16,
  bottom: 20,
  right: 20,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.30,
  shadowRadius: 4.65,
  elevation: 4,
  // paper gerencia outras propriedades internamente
}

const style = StyleSheet.create ({
  text_habits: {
    text: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

})