import { ColorSchemeName, ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { EdgeInsets } from 'react-native-safe-area-context';

/**
 * HintDrop theme
 *
 * Note: React Native StyleSheet cannot create real gradients.
 * Use DROPLET_GRADIENT with expo-linear-gradient in components:
 *
 * <LinearGradient
 *   colors={DROPLET_GRADIENT.colors}
 *   start={DROPLET_GRADIENT.start}
 *   end={DROPLET_GRADIENT.end}
 *   style={...}
 * />
 */

// Core icon-inspired colors
export const COLORS = {
  // Dark neutrals
  void: '#101014',
  jet: '#1B1B21',
  onyx: '#27272F',
  graphite: '#33333B',
  dimGray: '#666673',

  // Text
  white: '#F7F8FA',
  offWhite: '#EDEDED',
  muted: '#B8BCC8',

  // Droplet accents
  crayolaBlue: '#0075F2',
  glowBlue: '#35B7FF',
  aqua: '#72E6FF',
  lavender: '#BDA4FF',
  softLavender: '#E4D9FF',

  // Legacy / warm accents
  cornsilk: '#FFF9E2',
  umber: '#7F675B',

  danger: '#FF5C7A',
  success: '#41D39E',
} as const;

export const DROPLET_GRADIENT = {
  colors: [COLORS.aqua, COLORS.glowBlue, COLORS.crayolaBlue, COLORS.lavender] as const,
  start: { x: 0.5, y: 1 },
  end: { x: 0.5, y: 0 },
} as const;

export const APP_BACKGROUND_GRADIENT = {
  colors: [COLORS.void, COLORS.jet, COLORS.onyx] as const,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
} as const;

type AppTheme = ReturnType<typeof getTheme>;
type BaseStyles = ReturnType<typeof createBaseStyles>;

const getTheme = (colorScheme: ColorSchemeName) => {
  const isDark = colorScheme !== 'light';

  return {
    isDark,

    text: isDark ? COLORS.white : '#151518',
    mutedText: isDark ? COLORS.muted : '#555866',

    background: isDark ? COLORS.void : COLORS.offWhite,
    surface: isDark ? COLORS.jet : '#FFFFFF',
    elevatedSurface: isDark ? COLORS.onyx : COLORS.cornsilk,

    border: isDark ? COLORS.graphite : '#D8D8DF',
    accent: COLORS.crayolaBlue,
    accentGlow: COLORS.glowBlue,

    inputBackground: isDark ? COLORS.onyx : '#FFFFFF',
    placeholder: isDark ? COLORS.dimGray : '#777A86',
  } as const;
};

const createBaseStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
  const theme = getTheme(colorScheme);

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
      width: '100%',
    } satisfies ViewStyle,
    screen: {
      flex: 1,
      backgroundColor: theme.background,
      width: '100%',
    } satisfies ViewStyle,
    header: {
      fontSize: 40,
      fontWeight: 'bold',
      width: '100%',
      textAlign: 'left',
      paddingHorizontal: 20,
      color: theme.text,
    } satisfies TextStyle,
    centeredHeader: {
      fontSize: 40,
      fontWeight: 'bold',
      width: '100%',
      textAlign: 'center',
      paddingHorizontal: 20,
      color: theme.text,
    } satisfies TextStyle,
    text: {
      fontSize: 16,
      color: theme.text,
    } satisfies TextStyle,
    mutedText: {
      fontSize: 16,
      color: theme.mutedText,
    } satisfies TextStyle,
    input: {
      height: 44,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 12,
      marginBottom: 20,
      paddingHorizontal: 12,
      minWidth: '80%',
      color: theme.text,
      backgroundColor: theme.inputBackground,
    } satisfies TextStyle,
    card: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 16,
      shadowColor: theme.accentGlow,
      shadowOpacity: theme.isDark ? 0.18 : 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    } satisfies ViewStyle,
    button: {
      backgroundColor: theme.accent,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.accentGlow,
      shadowOpacity: theme.isDark ? 0.45 : 0.18,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 0 },
      elevation: 8,
    } satisfies ViewStyle,
    buttonText: {
      color: COLORS.white,
      textAlign: 'center',
      fontWeight: '700',
    } satisfies TextStyle,
    secondaryButton: {
      backgroundColor: theme.elevatedSurface,
      borderColor: theme.border,
      borderWidth: 1,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    } satisfies ViewStyle,
    secondaryButtonText: {
      color: theme.text,
      textAlign: 'center',
      fontWeight: '600',
    } satisfies TextStyle,
  });
};

const createHomeStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
  const base = createBaseStyles(colorScheme);

  return StyleSheet.create({
    container: base.container,
    header: base.header,
    text: base.text,
  });
};

const createLoginStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
  const base = createBaseStyles(colorScheme);

  return StyleSheet.create({
    container: base.container,
    header: base.header,
    text: base.text,
    input: base.input,
    button: base.button,
    buttonText: base.buttonText,
  });
};

const createProfileStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
  const base = createBaseStyles(colorScheme);
  const theme = getTheme(colorScheme);

  return StyleSheet.create({
    container: base.container,
    header: base.centeredHeader,
    text: base.text,
    input: base.input,
    profilePic: {
      height: 125,
      width: 125,
      marginBottom: 10,
      borderRadius: 62.5,
      borderColor: theme.accentGlow,
      borderWidth: 2,
    } satisfies ImageStyle,
    button: base.button,
    buttonText: base.buttonText,
  });
};

const createListStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
  const base = createBaseStyles(colorScheme);
  const theme = getTheme(colorScheme);

  return StyleSheet.create({
    container: {
      ...base.screen,
      alignItems: 'center',
      maxWidth: '100%',
      maxHeight: '100%',
      paddingTop: 50,
    } satisfies ViewStyle,
    header: {
      ...base.header,
      fontSize: 48,
    } satisfies TextStyle,
    text: base.text,
    listPreview: {
      ...base.card,
      padding: 20,
      margin: 10,
    } satisfies ViewStyle,
    listName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    } satisfies TextStyle,
    listDescription: {
      fontSize: 16,
      color: theme.mutedText,
      marginTop: 4,
    } satisfies TextStyle,
    listOwner: {
      fontSize: 14,
      color: theme.mutedText,
      marginTop: 8,
    } satisfies TextStyle,
    listLastUpdated: {
      fontSize: 14,
      color: theme.mutedText,
      marginTop: 4,
    } satisfies TextStyle,
    listBlock: {
      ...base.card,
      width: '95%',
      minHeight: 200,
      maxHeight: '40%',
      marginTop: 20,
      marginBottom: 20,
      overflow: 'hidden',
    } satisfies ViewStyle,
    topBar: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      gap: 10,
    } satisfies ViewStyle,
    button: base.button,
    buttonText: base.buttonText,
    secondaryButton: base.secondaryButton,
    secondaryButtonText: base.secondaryButtonText,
    blockHeader: {
      fontSize: 32,
      fontWeight: 'bold',
      width: '100%',
      textAlign: 'left',
      paddingHorizontal: 20,
      paddingTop: 16,
      color: theme.text,
    } satisfies TextStyle,
  });
};

const createCreateListStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
  const base = createBaseStyles(colorScheme);

  return StyleSheet.create({
    container: base.container,
    header: base.header,
    text: base.text,
    input: base.input,
    button: base.button,
    buttonText: base.buttonText,
    form: {
      ...base.card,
      width: '90%',
      padding: 20,
    } satisfies ViewStyle,
  });
};

const createListDetailStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
  const base = createBaseStyles(colorScheme);

  return StyleSheet.create({
    container: base.container,
    header: base.header,
    text: base.text,
  });
};

const createModalStyles = (colorScheme: ColorSchemeName) => {
  const base = createBaseStyles(colorScheme);
  const theme = getTheme(colorScheme);

  return StyleSheet.create({
    modalBackdrop: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.72)',
    } satisfies ViewStyle,
    modalContent: {
      ...base.card,
      width: '80%',
      padding: 20,
      alignItems: 'center',
    } satisfies ViewStyle,
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.text,
    } satisfies TextStyle,
    previewImage: {
      width: 100,
      height: 100,
      borderRadius: 12,
      marginBottom: 20,
    } satisfies ImageStyle,
    placeholderShape: {
      width: 100,
      height: 100,
      backgroundColor: theme.elevatedSurface,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    } satisfies ViewStyle,
    placeholderText: {
      color: theme.mutedText,
      fontSize: 16,
    } satisfies TextStyle,
    cancelText: {
      color: theme.mutedText,
      fontSize: 16,
      marginTop: 20,
      textAlign: 'center',
    } satisfies TextStyle,
    button: base.button,
    buttonText: base.buttonText,
    text: base.text,
    input: base.input,
    container: base.container,
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.text,
    } satisfies TextStyle,
  });
};

export const useHomeStyles = (insets : EdgeInsets) => createHomeStyles(useColorScheme(), insets);
export const useLoginStyles = (insets : EdgeInsets) => createLoginStyles(useColorScheme(), insets);
export const useProfileStyles = (insets : EdgeInsets) => createProfileStyles(useColorScheme(), insets);
export const useListStyles = (insets : EdgeInsets) => createListStyles(useColorScheme(), insets);
export const useCreateListStyles = (insets : EdgeInsets) => createCreateListStyles(useColorScheme(), insets);
export const useListDetailStyles = (insets : EdgeInsets) => createListDetailStyles(useColorScheme(), insets);
export const useModalStyles = () => createModalStyles(useColorScheme());

export type { AppTheme, BaseStyles };
