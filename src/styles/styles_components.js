import { colors_white } from './theme.js';

export const fab = {
  backgroundColor: colors_white.primary,
  position: 'absolute',
  borderRadius: 16,
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

export const label = {
  fontSize: 15,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 8,
};

export const input = {
  height: 50,
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 8,
  paddingHorizontal: 10,
  fontSize: 16,
  color: '#000',
  marginBottom: 15,
};

export const dayButton = {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#F0F0F0',
  alignItems: 'center',
  justifyContent: 'center',
};

export const dayButtonSelected = {
  backgroundColor: colors_white.primary,
};

export const dayText = {
  color: '#000',
  fontWeight: 'bold',
};

export const dayTextSelected = {
  color: '#FFF',
};

export const cancelButton = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#383838',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8,
  marginTop: 20,
  width: '48%',
};

export const cancelButtonText = {
  color: '#FFF',
  fontSize: 18,
  fontWeight: 'bold',
};

export const saveButton = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors_white.primary,
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8,
  marginTop: 20,
  width: '48%',
};

export const saveButtonText = {
  color: '#FFF',
  fontSize: 18,
  fontWeight: 'bold',
};