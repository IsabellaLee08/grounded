import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, type } from '../theme';

/** Pastel gradient + soft blurred "blobs", like the deck backgrounds. */
export function Screen({ children, scroll = true, pad = true }: { children: React.ReactNode; scroll?: boolean; pad?: boolean }) {
  const insets = useSafeAreaInsets();
  const body = { paddingTop: insets.top + 12, paddingHorizontal: pad ? 18 : 0, paddingBottom: 40 };
  return (
    <LinearGradient colors={[...colors.bgGradient]} style={{ flex: 1 }}>
      <View style={[styles.blob, { top: -60, right: -80, backgroundColor: '#B9D2FA' }]} />
      <View style={[styles.blob, { bottom: 80, left: -120, backgroundColor: '#D7CBF3' }]} />
      {scroll ? (
        <ScrollView contentContainerStyle={body} keyboardShouldPersistTaps="handled">{children}</ScrollView>
      ) : (
        <View style={[{ flex: 1 }, body]}>{children}</View>
      )}
    </LinearGradient>
  );
}

/** "• SAVED" eyebrow + heavy title with the deck's blue period. */
export function Header({ eyebrow, title, dot = false }: { eyebrow?: string; title: string; dot?: boolean }) {
  return (
    <View style={{ marginBottom: 14 }}>
      {eyebrow ? (
        <View style={styles.eyebrowRow}>
          <View style={styles.eyebrowDot} />
          <Text style={type.eyebrow}>{eyebrow.toUpperCase()}</Text>
        </View>
      ) : null}
      <Text style={type.title}>
        {title}
        {dot ? <Text style={{ color: colors.blue }}>.</Text> : null}
      </Text>
      <View style={styles.rule} />
    </View>
  );
}

export function Chip({ label, active, onPress, tone = 'outline' }: {
  label: string; active?: boolean; onPress?: () => void; tone?: 'outline' | 'blue';
}) {
  const blue = tone === 'blue';
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.chip,
        blue && { backgroundColor: colors.chip, borderColor: colors.blue },
        active && { backgroundColor: colors.outline, borderColor: colors.outline },
      ]}
    >
      <Text style={[styles.chipText, blue && { color: colors.navy }, active && { color: colors.white }]}>{label}</Text>
    </Pressable>
  );
}

export function Button({ label, onPress, variant = 'dark', small, style }: {
  label: string; onPress: () => void; variant?: 'dark' | 'light' | 'blue' | 'danger'; small?: boolean; style?: ViewStyle;
}) {
  const bg = { dark: colors.outline, light: colors.card, blue: colors.chip, danger: colors.card }[variant];
  const fg = { dark: colors.white, light: colors.ink, blue: colors.navy, danger: colors.danger }[variant];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn, small && { paddingVertical: 6, paddingHorizontal: 12 },
        { backgroundColor: bg, borderColor: variant === 'blue' ? colors.blue : colors.outline, opacity: pressed ? 0.7 : 1 },
        style,
      ]}
    >
      <Text style={{ color: fg, fontWeight: '700', fontSize: small ? 12 : 14 }}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[type.small, { fontWeight: '700', marginBottom: 4, color: colors.ink }]}>{label}</Text>
      <TextInput placeholderTextColor={colors.muted} {...props}
        style={[styles.input, props.multiline && { height: 90, textAlignVertical: 'top' }]} />
    </View>
  );
}

export function ChipRow({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{children}</View>;
}

export function Segmented({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <View style={styles.seg}>
      {options.map((o) => (
        <Pressable key={o} onPress={() => onChange(o)} style={[styles.segItem, value === o && { backgroundColor: colors.outline }]}>
          <Text style={{ fontWeight: '700', fontSize: 13, color: value === o ? colors.white : colors.ink }}>{o}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  blob: { position: 'absolute', width: 280, height: 280, borderRadius: 140, opacity: 0.55 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  eyebrowDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.sky, borderWidth: 1, borderColor: colors.blue },
  rule: { height: 1, backgroundColor: colors.charcoal, opacity: 0.5, marginTop: 10 },
  chip: {
    borderWidth: 1, borderColor: colors.outline, borderRadius: radius.pill,
    paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.card,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.ink },
  btn: { borderWidth: 1, borderRadius: radius.pill, paddingVertical: 10, paddingHorizontal: 18, alignItems: 'center' },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.outline, borderRadius: radius.card, overflow: 'hidden' },
  input: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.outline,
    borderRadius: radius.input, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.ink,
  },
  seg: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.outline, padding: 3, marginBottom: 12 },
  segItem: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: radius.pill },
});
