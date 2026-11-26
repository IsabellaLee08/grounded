import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppEvent } from '../types';
import { colors, type } from '../theme';
import { dayNum, monthShort, weekday } from '../dates';
import { useOrg, useStore } from '../store';
import { Button, Card, Chip, ChipRow } from './ui';

export function EventCard({ event, reasons }: { event: AppEvent; reasons?: string[] }) {
  const { savedEvents, toggleSaved, openEvent } = useStore();
  const org = useOrg(event.orgId);
  const following = savedEvents.includes(event.id);
  return (
    <Pressable onPress={() => openEvent(event.id)} style={{ marginBottom: 14 }}>
      <Card>
        <LinearGradient colors={[...colors.headerGradient]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.head}>
          <View style={styles.badge}>
            <Text style={styles.badgeMonth}>{monthShort(event.date)}</Text>
            <Text style={styles.badgeDay}>{dayNum(event.date)}</Text>
          </View>
          <View style={styles.cat}><Text style={styles.catText}>{event.category}</Text></View>
        </LinearGradient>
        <View style={{ padding: 14 }}>
          <Text style={type.h2}>{event.name}</Text>
          <Text style={[type.small, { marginTop: 4 }]}>
            {weekday(event.date)} · {event.time} · {event.location}
          </Text>
          <Text style={[type.small, { color: colors.ink, marginTop: 2 }]}>by {org?.name ?? 'Unknown'}</Text>
          {reasons?.length ? (
            <View style={{ marginTop: 10 }}>
              <ChipRow>{reasons.map((r) => <Chip key={r} label={r} tone="blue" />)}</ChipRow>
            </View>
          ) : null}
          <View style={styles.foot}>
            <Text style={type.small}>{event.cost} · {event.followers} following</Text>
            <Button small variant={following ? 'blue' : 'light'} label={following ? '✓ Following' : 'Follow'} onPress={() => toggleSaved(event.id)} />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  head: { height: 92, padding: 10, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  badge: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.outline, borderRadius: 10, alignItems: 'center', paddingHorizontal: 9, paddingVertical: 3 },
  badgeMonth: { fontSize: 9, fontWeight: '700', color: colors.muted, letterSpacing: 1 },
  badgeDay: { fontSize: 20, fontWeight: '800', color: colors.ink, marginTop: -2 },
  cat: { backgroundColor: colors.white, borderRadius: 999, borderWidth: 1, borderColor: colors.outline, paddingHorizontal: 10, paddingVertical: 4 },
  catText: { fontSize: 11, fontWeight: '700', color: colors.ink },
  foot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.muted },
});
