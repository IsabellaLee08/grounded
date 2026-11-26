import React, { useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import { colors, radius } from '../theme';
import { Chip, Header, Screen, Segmented } from '../components/ui';
import { OrgCard } from '../components/OrgCard';
import { useStore } from '../store';
import { CATEGORIES } from '../types';

export default function DiscoverScreen() {
  const { orgs } = useStore();
  const [tab, setTab] = useState('Clubs');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const type = tab === 'Clubs' ? 'club' : 'business';
  const list = orgs.filter((o) =>
    o.type === type &&
    (cat === 'All' || o.category === cat) &&
    `${o.name} ${o.description}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <Screen>
      <Header eyebrow="Discover" title={tab === 'Clubs' ? 'Clubs & Organizations' : 'Local Businesses'} dot />
      <Segmented options={['Clubs', 'Businesses']} value={tab} onChange={setTab} />
      <TextInput value={q} onChangeText={setQ} placeholder="Search…" placeholderTextColor={colors.muted}
        style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.outline, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 10, marginBottom: 10 }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14, marginHorizontal: -18 }} contentContainerStyle={{ paddingHorizontal: 18, gap: 6 }}>
        {['All', ...CATEGORIES].map((c) => <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} />)}
      </ScrollView>
      {list.map((o) => <OrgCard key={o.id} org={o} />)}
    </Screen>
  );
}
