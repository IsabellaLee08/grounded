import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Org } from '../types';
import { colors, type } from '../theme';
import { useStore } from '../store';
import { Button, Card, Chip, ChipRow } from './ui';

const initials = (n: string) =>
  n.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

export function OrgCard({ org, reasons }: { org: Org; reasons?: string[] }) {
  const { followedOrgs, toggleFollow, approvedEvents } = useStore();
  const following = followedOrgs.includes(org.id);
  const upcoming = approvedEvents.filter((e) => e.orgId === org.id).length;
  return (
    <Card style={{ padding: 14, marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={[styles.logo, org.type === 'business' && { backgroundColor: '#D7CBF3' }]}>
          <Text style={{ fontWeight: '800', color: colors.navy }}>{initials(org.name)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={type.h2}>{org.name}</Text>
          <Text style={type.small}>{org.category}</Text>
        </View>
      </View>
      <Text style={[type.body, { marginTop: 10, color: colors.charcoal }]}>{org.description}</Text>
      {reasons?.length ? <View style={{ marginTop: 10 }}><ChipRow>{reasons.map((r) => <Chip key={r} label={r} tone="blue" />)}</ChipRow></View> : null}
      <View style={styles.foot}>
        <Text style={type.small}>{upcoming} upcoming · {org.followers} followers</Text>
        <Button small variant={following ? 'blue' : 'light'} label={following ? '✓ Following' : 'Follow'} onPress={() => toggleFollow(org.id)} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  logo: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.outline },
  foot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
});
