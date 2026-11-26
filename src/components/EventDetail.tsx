import React from 'react';
import { Linking, Modal, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, type } from '../theme';
import { useOrg, useStore } from '../store';
import { Button } from './ui';
import { dayNum, monthShort, weekday } from '../dates';

export function EventDetail() {
  const { openEventId, openEvent, events, savedEvents, toggleSaved } = useStore();
  const ev = events.find((e) => e.id === openEventId);
  const org = useOrg(ev?.orgId ?? '');
  if (!ev) return null;
  const following = savedEvents.includes(ev.id);
  return (
    <Modal animationType="slide" presentationStyle="pageSheet" onRequestClose={() => openEvent(null)}>
      <ScrollView style={{ backgroundColor: colors.bg }}>
        <LinearGradient colors={[...colors.headerGradient]} style={{ height: 170, justifyContent: 'flex-end', padding: 18 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.navy, letterSpacing: 1.5 }}>
            {monthShort(ev.date)} {dayNum(ev.date)} · {ev.category.toUpperCase()}
          </Text>
        </LinearGradient>
        <View style={{ padding: 18 }}>
          <Text style={type.title}>{ev.name}</Text>
          <Text style={[type.body, { marginTop: 8, fontWeight: '600' }]}>{weekday(ev.date)} · {ev.time}</Text>
          <Text style={[type.body, { marginTop: 2 }]}>{ev.location}</Text>
          <Text style={[type.small, { marginTop: 2 }]}>by {org?.name} · {ev.cost}</Text>
          <Text style={[type.body, { marginTop: 16, lineHeight: 21 }]}>{ev.description}</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
            <Button variant={following ? 'blue' : 'dark'} label={following ? '✓ Following' : 'Follow event'} onPress={() => toggleSaved(ev.id)} />
            {ev.registrationLink ? <Button variant="light" label="Register" onPress={() => Linking.openURL(ev.registrationLink!)} /> : null}
            <Button variant="light" label="Close" onPress={() => openEvent(null)} />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}
