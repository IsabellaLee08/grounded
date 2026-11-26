import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, type } from '../theme';
import { Card, Header, Screen } from '../components/ui';
import { EventCard } from '../components/EventCard';
import { useStore } from '../store';
import { monthName, toISO, todayISO } from '../dates';

export default function CalendarScreen() {
  const { approvedEvents } = useStore();
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selected, setSelected] = useState(todayISO());

  const first = month.getDay();
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array(first).fill(null),
    ...Array.from({ length: days }, (_, i) => toISO(new Date(month.getFullYear(), month.getMonth(), i + 1))),
  ];
  const counts = approvedEvents.reduce<Record<string, number>>((a, e) => ((a[e.date] = (a[e.date] ?? 0) + 1), a), {});
  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  const dayEvents = approvedEvents.filter((e) => e.date === selected);

  return (
    <Screen>
      <Header eyebrow="Calendar" title={monthName(month)} />
      <Card style={{ padding: 12, marginBottom: 16 }}>
        <View style={styles.nav}>
          <Pressable onPress={() => shift(-1)} hitSlop={12}><Text style={styles.arrow}>‹</Text></Pressable>
          <Text style={type.h2}>{monthName(month)}</Text>
          <Pressable onPress={() => shift(1)} hitSlop={12}><Text style={styles.arrow}>›</Text></Pressable>
        </View>
        <View style={styles.row}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <Text key={i} style={styles.dow}>{d}</Text>)}
        </View>
        <View style={styles.grid}>
          {cells.map((iso, i) => {
            const sel = iso === selected;
            return (
              <Pressable key={i} disabled={!iso} onPress={() => iso && setSelected(iso)} style={styles.cell}>
                {iso && (
                  <View style={[styles.day, sel && { backgroundColor: colors.navy }, iso === todayISO() && !sel && { borderWidth: 1, borderColor: colors.blue }]}>
                    <Text style={{ fontWeight: '700', color: sel ? colors.white : colors.ink }}>{Number(iso.slice(8))}</Text>
                    <View style={[styles.dot, { opacity: counts[iso] ? 1 : 0, backgroundColor: sel ? colors.sky : colors.blue }]} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </Card>
      <Text style={[type.h2, { marginBottom: 10 }]}>{dayEvents.length ? `${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : 'Nothing scheduled'}</Text>
      {dayEvents.map((e) => <EventCard key={e.id} event={e} />)}
    </Screen>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 6, marginBottom: 8 },
  arrow: { fontSize: 28, color: colors.navy, fontWeight: '700' },
  row: { flexDirection: 'row' },
  dow: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '700', color: colors.muted, marginBottom: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, alignItems: 'center', paddingVertical: 2 },
  day: { width: 38, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 5, height: 5, borderRadius: 3, marginTop: 2 },
});
