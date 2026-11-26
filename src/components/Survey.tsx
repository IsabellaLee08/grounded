import React, { useState } from 'react';
import { Modal, ScrollView, Text, View } from 'react-native';
import { colors, type } from '../theme';
import { useStore } from '../store';
import { CATEGORIES, Category, MAJORS } from '../types';
import { Button, Chip, ChipRow, Field } from './ui';

/** Onboarding survey: major, age, interests → powers For You recommendations. */
export function Survey({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { profile, saveProfile } = useStore();
  const [p, setP] = useState(profile);
  const toggle = (c: Category) =>
    setP((x) => ({ ...x, interests: x.interests.includes(c) ? x.interests.filter((i) => i !== c) : [...x.interests, c] }));
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 18, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
        <Text style={type.display}>Grounded<Text style={{ color: colors.blue }}>.</Text></Text>
        <Text style={[type.body, { marginVertical: 10, color: colors.charcoal }]}>
          A few quick questions so we can build your personalized feed of clubs, events, and local pop-ups.
        </Text>
        <Field label="Name" value={p.name} onChangeText={(name) => setP({ ...p, name })} placeholder="Your name" />
        <Field label="Email" value={p.email} onChangeText={(email) => setP({ ...p, email })} placeholder="you@virginia.edu" autoCapitalize="none" keyboardType="email-address" />
        <Field label="Age" value={p.age} onChangeText={(age) => setP({ ...p, age })} keyboardType="number-pad" placeholder="19" />
        <Text style={[type.small, { fontWeight: '700', color: colors.ink, marginBottom: 6 }]}>Major</Text>
        <ChipRow>{MAJORS.map((m) => <Chip key={m} label={m} active={p.major === m} onPress={() => setP({ ...p, major: m })} />)}</ChipRow>
        <Text style={[type.small, { fontWeight: '700', color: colors.ink, marginTop: 16, marginBottom: 6 }]}>Interests (pick any)</Text>
        <ChipRow>{CATEGORIES.map((c) => <Chip key={c} label={c} active={p.interests.includes(c)} onPress={() => toggle(c)} />)}</ChipRow>
        <View style={{ height: 16 }} />
        <Field label="Short bio (optional)" value={p.bio} onChangeText={(bio) => setP({ ...p, bio })} multiline />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button label="Build my feed" onPress={() => { saveProfile(p); onClose(); }} />
          <Button variant="light" label="Skip" onPress={onClose} />
        </View>
      </ScrollView>
    </Modal>
  );
}
