import { useMemo } from 'react';
import { ColorSchemeName, ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';

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

export const COLORS = {
	void: '#101014',
	jet: '#1B1B21',
	onyx: '#27272F',
	graphite: '#33333B',
	dimGray: '#666673',

	white: '#F7F8FA',
	offWhite: '#EDEDED',
	muted: '#B8BCC8',

	crayolaBlue: '#0075F2',
	glowBlue: '#35B7FF',
	aqua: '#72E6FF',
	lavender: '#BDA4FF',
	softLavender: '#E4D9FF',

	cornsilk: '#FFF9E2',
	umber: '#7F675B',

	danger: '#FF5C7A',
	success: '#41D39E',
} as const;

export const SPACING = {
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 20,
	xxl: 28,
	xxxl: 40,
} as const;

export const RADIUS = {
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	round: 999,
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
		danger: COLORS.danger,
	} as const;
};

const withSafeBottom = (insets: EdgeInsets, minimum: number = SPACING.xl) => Math.max(insets.bottom, minimum);

type AppTheme = ReturnType<typeof getTheme>;
type BaseStyles = ReturnType<typeof createBaseStyles>;

const createBaseStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
	const theme = getTheme(colorScheme);

	return StyleSheet.create({
		safeArea: {
			flex: 1,
			backgroundColor: theme.background,
		} satisfies ViewStyle,
		screen: {
			flex: 1,
			width: '100%',
			backgroundColor: theme.background,
		} satisfies ViewStyle,
		container: {
			flex: 1,
			width: '100%',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: theme.background,
			paddingHorizontal: SPACING.xl,
			paddingBottom: withSafeBottom(insets),
		} satisfies ViewStyle,
		scrollView: {
			flex: 1,
			width: '100%',
			backgroundColor: theme.background,
		} satisfies ViewStyle,
		scrollContent: {
			flexGrow: 1,
			width: '100%',
			paddingHorizontal: SPACING.xl,
			paddingTop: SPACING.xl,
			paddingBottom: withSafeBottom(insets),
		} satisfies ViewStyle,
		centeredScrollContent: {
			flexGrow: 1,
			width: '100%',
			alignItems: 'center',
			justifyContent: 'center',
			paddingHorizontal: SPACING.xl,
			paddingVertical: SPACING.xl,
			paddingBottom: withSafeBottom(insets),
		} satisfies ViewStyle,
		header: {
			width: '100%',
			color: theme.text,
			fontSize: 40,
			fontWeight: 'bold',
			textAlign: 'left',
			marginBottom: SPACING.xl,
		} satisfies TextStyle,
		centeredHeader: {
			width: '100%',
			color: theme.text,
			fontSize: 40,
			fontWeight: 'bold',
			textAlign: 'center',
			marginBottom: SPACING.xl,
		} satisfies TextStyle,
		text: {
			color: theme.text,
			fontSize: 16,
		} satisfies TextStyle,
		mutedText: {
			color: theme.mutedText,
			fontSize: 16,
		} satisfies TextStyle,
		errorText: {
			color: theme.danger,
			fontSize: 14,
			marginBottom: SPACING.lg,
			textAlign: 'center',
		} satisfies TextStyle,
		field: {
			width: '100%',
			marginBottom: SPACING.md,
		} satisfies ViewStyle,
		input: {
			width: '100%',
			minHeight: 44,
			borderColor: theme.border,
			borderWidth: 1,
			borderRadius: RADIUS.md,
			paddingHorizontal: SPACING.md,
			color: theme.text,
			backgroundColor: theme.inputBackground,
		} satisfies TextStyle,
		card: {
			backgroundColor: theme.surface,
			borderColor: theme.border,
			borderWidth: 1,
			borderRadius: RADIUS.lg,
			shadowOpacity: theme.isDark ? 0.18 : 0.08,
			shadowRadius: 18,
			shadowOffset: { width: 0, height: 8 },
			elevation: 6,
		} satisfies ViewStyle,
		button: {
			minHeight: 44,
			backgroundColor: theme.accent,
			paddingVertical: SPACING.md,
			paddingHorizontal: SPACING.lg,
			borderRadius: RADIUS.md,
			alignItems: 'center',
			justifyContent: 'center',
			shadowOpacity: theme.isDark ? 0.45 : 0.18,
			shadowRadius: 16,
			shadowOffset: { width: 0, height: 0 },
			elevation: 8,
		} satisfies ViewStyle,
		buttonText: {
			color: COLORS.white,
			textAlign: 'center',
			fontWeight: '700',
			fontSize: 16,
		} satisfies TextStyle,
		secondaryButton: {
			minHeight: 44,
			backgroundColor: theme.elevatedSurface,
			borderColor: theme.border,
			borderWidth: 1,
			paddingVertical: SPACING.md,
			paddingHorizontal: SPACING.lg,
			borderRadius: RADIUS.md,
			alignItems: 'center',
			justifyContent: 'center',
		} satisfies ViewStyle,
		secondaryButtonText: {
			color: theme.text,
			textAlign: 'center',
			fontWeight: '600',
			fontSize: 16,
		} satisfies TextStyle,
		divider: {
			width: '100%',
			height: 1,
			backgroundColor: theme.border,
		} satisfies ViewStyle,
	});
};

const createHomeStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
	const base = createBaseStyles(colorScheme, insets);

	return StyleSheet.create({
		safeArea: base.safeArea,
		scrollView: base.scrollView,
		scrollContent: base.scrollContent,
		header: base.header,
		text: base.text,
	});
};

const createLoginStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
	const base = createBaseStyles(colorScheme, insets);

	return StyleSheet.create({
		safeArea: base.safeArea,
		container: base.container,
		form: {
			...base.card,
			width: '100%',
			maxWidth: 420,
			padding: SPACING.xl,
			gap: SPACING.md,
		} satisfies ViewStyle,
		field: base.field,
		header: base.centeredHeader,
		text: base.text,
		input: base.input,
		button: base.button,
		buttonText: base.buttonText,
		secondaryButton: base.secondaryButton,
		secondaryButtonText: base.secondaryButtonText,
		errorText: base.errorText,
	});
};

const createProfileStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
	const base = createBaseStyles(colorScheme, insets);
	const theme = getTheme(colorScheme);

	return StyleSheet.create({
		safeArea: base.safeArea,
		scrollView: base.scrollView,
		scrollContent: {
			...base.centeredScrollContent,
			gap: SPACING.lg,
		} satisfies ViewStyle,
		loadingContainer: base.container,
		header: base.centeredHeader,
		text: base.text,
		input: base.input,
		profilePic: {
			height: 125,
			width: 125,
			borderRadius: 62.5,
			borderColor: theme.border,
			borderWidth: 2,
			backgroundColor: theme.elevatedSurface,
		} satisfies ImageStyle,
		statsRow: {
			flexDirection: 'row',
			justifyContent: 'space-around',
			width: '100%',
			paddingVertical: SPACING.md,
		} satisfies ViewStyle,
		statItem: {
			alignItems: 'center',
			gap: SPACING.xs,
		} satisfies ViewStyle,
		statNumber: {
			...base.text,
			fontWeight: 'bold',
			fontSize: 18,
		} satisfies TextStyle,
		profileName: {
			...base.text,
			fontWeight: 'bold',
			fontSize: 20,
			textAlign: 'center',
		} satisfies TextStyle,
		button: base.button,
		buttonText: base.buttonText,
		secondaryButton: base.secondaryButton,
		secondaryButtonText: base.secondaryButtonText,
		settingsContainer: {
			...base.card,
			width: '100%',
			padding: SPACING.lg,
			gap: SPACING.md,
		} satisfies ViewStyle,
		settingsRow: {
			width: '100%',
			paddingVertical: SPACING.md,
			paddingHorizontal: SPACING.lg,
			borderColor: theme.border,
			borderWidth: 1,
			borderRadius: RADIUS.md,
		} satisfies ViewStyle,
		settingsText: {
			color: theme.text,
			fontSize: 16,
		} satisfies TextStyle,
		divider: base.divider,
	});
};

const createListStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
	const base = createBaseStyles(colorScheme, insets);
	const theme = getTheme(colorScheme);

	return StyleSheet.create({
		safeArea: base.safeArea,
		container: {
			...base.screen,
			alignItems: 'center',
			paddingHorizontal: SPACING.lg,
			paddingBottom: withSafeBottom(insets),
		} satisfies ViewStyle,
		header: {
			...base.header,
			flex: 1,
			fontSize: 48,
			marginBottom: 0,
		} satisfies TextStyle,
		text: base.text,
		listPreview: {
			...base.card,
			padding: SPACING.xl,
			marginHorizontal: SPACING.md,
			marginVertical: SPACING.sm,
		} satisfies ViewStyle,
		listName: {
			color: theme.text,
			fontSize: 20,
			fontWeight: 'bold',
		} satisfies TextStyle,
		listDescription: {
			color: theme.mutedText,
			fontSize: 16,
			marginTop: SPACING.xs,
		} satisfies TextStyle,
		listOwner: {
			color: theme.mutedText,
			fontSize: 14,
			marginTop: SPACING.sm,
		} satisfies TextStyle,
		listLastUpdated: {
			color: theme.mutedText,
			fontSize: 14,
			marginTop: SPACING.xs,
		} satisfies TextStyle,
		listBlock: {
			...base.card,
			width: '100%',
			flex: 1,
			minHeight: 180,
			marginVertical: SPACING.lg,
			overflow: 'hidden',
		} satisfies ViewStyle,
		topBar: {
			flexDirection: 'row',
			alignItems: 'center',
			width: '100%',
			gap: SPACING.md,
			paddingTop: SPACING.md,
		} satisfies ViewStyle,
		button: base.button,
		buttonText: base.buttonText,
		plusButton: {
			...base.button,
			width: 48,
			height: 48,
			borderRadius: RADIUS.round,
			paddingHorizontal: 0,
			paddingVertical: 0,
		} satisfies ViewStyle,
		plusButtonText: {
			...base.buttonText,
			fontSize: 28,
			lineHeight: 30,
		} satisfies TextStyle,
		emptyState: {
			...base.text,
			padding: SPACING.lg,
			textAlign: 'center',
		} satisfies TextStyle,
		secondaryButton: base.secondaryButton,
		secondaryButtonText: base.secondaryButtonText,
		blockHeader: {
			color: theme.text,
			fontSize: 32,
			fontWeight: 'bold',
			width: '100%',
			textAlign: 'left',
			paddingHorizontal: SPACING.xl,
			paddingTop: SPACING.lg,
			paddingBottom: SPACING.sm,
		} satisfies TextStyle,
	});
};

const createCreateListStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
	const base = createBaseStyles(colorScheme, insets);

	return StyleSheet.create({
		safeArea: base.safeArea,
		container: base.container,
		header: base.centeredHeader,
		text: base.text,
		input: base.input,
		button: base.button,
		buttonText: base.buttonText,
		form: {
			...base.card,
			width: '100%',
			maxWidth: 460,
			padding: SPACING.xl,
			gap: SPACING.lg,
		} satisfies ViewStyle,
	});
};

const createListDetailStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
	const base = createBaseStyles(colorScheme, insets);

	return StyleSheet.create({
		safeArea: base.safeArea,
		container: base.container,
		header: base.centeredHeader,
		text: base.text,
		optionsRow: {
			flex:1,
			flexDirection: 'row',
			width: '50%',
			justifyContent: 'space-between'
		},
		option: {
			...base.text,
			fontSize: 20
		}
	});
};

const createModalStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
	const base = createBaseStyles(colorScheme, insets);
	const theme = getTheme(colorScheme);

	return StyleSheet.create({
		modalBackdrop: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: 'rgba(0, 0, 0, 0.72)',
			paddingHorizontal: SPACING.xl,
			paddingTop: Math.max(insets.top, SPACING.xl),
			paddingBottom: withSafeBottom(insets),
		} satisfies ViewStyle,
		modalContent: {
			...base.card,
			width: '100%',
			maxWidth: 420,
			padding: SPACING.xl,
			alignItems: 'center',
			gap: SPACING.lg,
		} satisfies ViewStyle,
		modalTitle: {
			color: theme.text,
			fontSize: 24,
			fontWeight: 'bold',
			textAlign: 'center',
		} satisfies TextStyle,
		previewImage: {
			width: 100,
			height: 100,
			borderRadius: RADIUS.md,
		} satisfies ImageStyle,
		placeholderShape: {
			width: 100,
			height: 100,
			backgroundColor: theme.elevatedSurface,
			borderColor: theme.border,
			borderWidth: 1,
			borderRadius: RADIUS.md,
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
			textAlign: 'center',
		} satisfies TextStyle,
		button: base.button,
		buttonText: base.buttonText,
		secondaryButton: base.secondaryButton,
		secondaryButtonText: base.secondaryButtonText,
		text: base.text,
		input: base.input,
		field: base.field,
		container: base.container,
		title: {
			color: theme.text,
			fontSize: 24,
			fontWeight: 'bold',
			marginBottom: SPACING.xl,
			textAlign: 'center',
		} satisfies TextStyle,
		label: {
			color: theme.text,
			fontSize: 16,
			alignSelf: 'flex-start',
		} satisfies TextStyle,
		status: {
			color: theme.mutedText,
			fontSize: 14,
			marginTop: SPACING.xs,
			alignSelf: 'flex-start',
		} satisfies TextStyle,
		invalid: {
			color: theme.danger,
		} satisfies TextStyle,
	});
};

const createUSIStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
	const base = createBaseStyles(colorScheme, insets); 
	const theme = getTheme(colorScheme);
		
	return StyleSheet.create({
		status: {
			color: theme.mutedText,
			fontSize: 14,
			marginTop: SPACING.xs,
			alignSelf: 'flex-start',
		} satisfies TextStyle,
		available: {
			color: theme.accent,
		} satisfies TextStyle,
		taken: {
			color: theme.danger,
		} satisfies TextStyle,
		invalid: {
			color: theme.danger,
		} satisfies TextStyle,
	});
};

const createGiftDetailStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
	const base = createBaseStyles(colorScheme, insets);

	return StyleSheet.create({
		safeArea: base.safeArea,
		container: base.container,
		header: base.centeredHeader,
		text: base.text,
		giftImage: {
			height: 125,
			width: "100%",
		} satisfies ImageStyle,
	});
};

const createAddGiftStyles = (colorScheme: ColorSchemeName, insets: EdgeInsets) => {
	const base = createBaseStyles(colorScheme, insets);

	return StyleSheet.create({
		safeArea: base.safeArea,
		container: base.container,
		header: base.centeredHeader,
		text: base.text,
		giftImage: {
			height: 125,
			width: "100%",
		} satisfies ImageStyle,
	});
};

const useThemedStyles = <T extends StyleSheet.NamedStyles<T>>(
	createStyles: (colorScheme: ColorSchemeName, insets: EdgeInsets) => T,
) => {
	const colorScheme = useColorScheme();
	const insets = useSafeAreaInsets();

	return useMemo(
		() => createStyles(colorScheme, insets),
		[colorScheme, insets.bottom, insets.left, insets.right, insets.top, createStyles],
	);
};

export const useHomeStyles = () => useThemedStyles(createHomeStyles);
export const useLoginStyles = () => useThemedStyles(createLoginStyles);
export const useProfileStyles = () => useThemedStyles(createProfileStyles);
export const useListStyles = () => useThemedStyles(createListStyles);
export const useCreateListStyles = () => useThemedStyles(createCreateListStyles);
export const useListDetailStyles = () => useThemedStyles(createListDetailStyles);
export const useModalStyles = () => useThemedStyles(createModalStyles);
export const useUSIStyles = () => useThemedStyles(createUSIStyles);
export const useGiftDetailStyles = () => useThemedStyles(createGiftDetailStyles);
export const useAddGiftStyles = () => useThemedStyles(createAddGiftStyles);

export type { AppTheme, BaseStyles };
