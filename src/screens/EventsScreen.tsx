import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Chip, Header, Screen } from '../components/ui';
import { EventCard } from '../components/EventCard';
import { useStore } from '../store';
import { CATEGORIES } from '../types';
import { todayISO } from '../dates';

export default function EventsScreen() {
  const { approvedEvents } = useStore();
  const [cat, setCat] = useState<string>('All');
  const list = approvedEvents.filter((e) => e.date >= todayISO() && (cat === 'All' || e.category === cat));
  return (
    <Screen>
      <Header eyebrow="Events" title="This week on Grounds" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14, marginHorizontal: -18 }} contentContainerStyle={{ paddingHorizontal: 18, gap: 6 }}>
        {['All', ...CATEGORIES].map((c) => <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} />)}
      </ScrollView>
      {list.map((e) => <EventCard key={e.id} event={e} />)}
      {!list.length && <View style={{ padding: 20 }} />}
    </Screen>
  );
}
