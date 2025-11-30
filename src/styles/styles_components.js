export const createFabStyles = (theme) => ({
  backgroundColor: theme.primary,
  position: 'absolute',
  borderRadius: 16,
  bottom: 20,
  right: 20,
  shadowColor: theme.black,
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.30,
  shadowRadius: 4.65,
  elevation: 4,
});

export const createLabelStyles = (theme) => ({
  fontSize: 15,
  fontWeight: 'bold',
  color: theme.text_primary,
  marginBottom: 8,
});

export const createInputStyles = (theme) => ({
  height: 50,
  backgroundColor: theme.background,
  borderColor: theme.border,
  borderWidth: 1,
  borderRadius: 8,
  paddingHorizontal: 10,
  fontSize: 16,
  color: theme.text_primary,
  marginBottom: 15,
});

export const createDayButtonStyles = (theme) => ({
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: theme.background,
  alignItems: 'center',
  justifyContent: 'center',
});

export const createDayButtonSelectedStyles = (theme) => ({
  backgroundColor: theme.primary,
});

export const createDayTextStyles = (theme) => ({
  color: theme.text_primary,
  fontWeight: 'bold',
});

export const createDayTextSelectedStyles = (theme) => ({
  color: theme.text_on_primary,
});
