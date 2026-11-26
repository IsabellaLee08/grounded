import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { colors, type } from '../theme';
import { Button, Card, Chip, ChipRow, Field, Header, Screen } from '../components/ui';
import { EventCard } from '../components/EventCard';
import { Survey } from '../components/Survey';
import { useStore } from '../store';
import { CATEGORIES, Category } from '../types';
import { isValidISO } from '../dates';

type View_ = 'home' | 'saved' | 'submit' | 'admin';

export default function MoreScreen() {
  const [view, setView] = useState<View_>('home');
  if (view === 'saved') return <Saved back={() => setView('home')} />;
  if (view === 'submit') return <Submit back={() => setView('home')} />;
  if (view === 'admin') return <Admin back={() => setView('home')} />;
  return <Home go={setView} />;
}

function Home({ go }: { go: (v: View_) => void }) {
  const { profile, isAdmin, pendingEvents, savedEvents, followedOrgs, signOut, session } = useStore();
  const [survey, setSurvey] = useState(false);
  return (
    <Screen>
      <Header eyebrow="You" title={profile.name ? profile.name : 'Your profile'} dot />
      <Card style={{ padding: 16, marginBottom: 16 }}>
        <Text style={type.body}>{profile.major || 'No major yet'}{profile.age ? ` · ${profile.age}` : ''}</Text>
        {profile.bio ? <Text style={[type.small, { marginTop: 6 }]}>{profile.bio}</Text> : null}
        <View style={{ marginTop: 10 }}>
          <ChipRow>{profile.interests.map((i) => <Chip key={i} label={i} tone="blue" />)}</ChipRow>
        </View>
        <Button small variant="light" label={profile.onboarded ? 'Edit survey' : 'Take survey'} onPress={() => setSurvey(true)} style={{ marginTop: 12, alignSelf: 'flex-start' }} />
      </Card>
      <Row title="Events you follow" sub={`${savedEvents.length} events · ${followedOrgs.length} organizations`} onPress={() => go('saved')} />
      <Row title="Submit an event" sub="For clubs & local businesses" onPress={() => go('submit')} />
      <Row title="Review queue" sub={isAdmin ? `${pendingEvents.length} pending` : 'Admin only'} onPress={() => go('admin')} disabled={!isAdmin} />
      <Text style={[type.small, { marginTop: 14 }]}>{session?.user.email}{isAdmin ? ' · admin' : ''}</Text>
      <Button variant="light" small label="Sign out" onPress={signOut} style={{ marginTop: 8, alignSelf: 'flex-start' }} />
      <Survey visible={survey} onClose={() => setSurvey(false)} />
    </Screen>
  );
}

const Row = ({ title, sub, onPress, disabled }: { title: string; sub: string; onPress: () => void; disabled?: boolean }) => (
  <Card style={{ marginBottom: 10, opacity: disabled ? 0.5 : 1 }}>
    <Pressable disabled={disabled} onPress={onPress} style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View>
        <Text style={type.h2}>{title}</Text>
        <Text style={type.small}>{sub}</Text>
      </View>
      <Text style={{ fontSize: 24, color: colors.navy }}>›</Text>
    </Pressable>
  </Card>
);

function Saved({ back }: { back: () => void }) {
  const { events, savedEvents } = useStore();
  const list = events.filter((e) => savedEvents.includes(e.id) && e.status === 'approved');
  return (
    <Screen>
      <Button small variant="light" label="‹ Back" onPress={back} style={{ alignSelf: 'flex-start', marginBottom: 12 }} />
      <Header eyebrow="Saved" title="Events you follow" />
      {list.map((e) => <EventCard key={e.id} event={e} />)}
      {!list.length && <Text style={type.body}>Follow an event and it'll show up here.</Text>}
    </Screen>
  );
}

function Submit({ back }: { back: () => void }) {
  const { orgs, submitEvent } = useStore();
  const blank = { name: '', date: '', time: '', location: '', description: '', cost: 'Free', registrationLink: '' };
  const [f, setF] = useState(blank);
  const [cat, setCat] = useState<Category>('Social');
  const [orgId, setOrgId] = useState(orgs[0]?.id ?? '');
  const set = (k: keyof typeof blank) => (v: string) => setF({ ...f, [k]: v });

  const send = async () => {
    if (!f.name.trim() || !f.location.trim() || !f.time.trim()) return Alert.alert('Missing info', 'Name, time, and location are required.');
    if (!isValidISO(f.date)) return Alert.alert('Date format', 'Use YYYY-MM-DD, e.g. 2026-12-03.');
    const err = await submitEvent({ ...f, registrationLink: f.registrationLink || undefined, category: cat, orgId });
    if (err) return Alert.alert('Could not submit', err);
    setF(blank);
    Alert.alert('Submitted', 'Your event is pending admin approval.', [{ text: 'OK', onPress: back }]);
  };

  return (
    <Screen>
      <Button small variant="light" label="‹ Back" onPress={back} style={{ alignSelf: 'flex-start', marginBottom: 12 }} />
      <Header eyebrow="Organizers" title="Submit an event" />
      <Field label="Event name" value={f.name} onChangeText={set('name')} />
      <Field label="Date (YYYY-MM-DD)" value={f.date} onChangeText={set('date')} placeholder="2026-12-03" autoCapitalize="none" />
      <Field label="Time" value={f.time} onChangeText={set('time')} placeholder="6:30 PM" />
      <Field label="Location" value={f.location} onChangeText={set('location')} />
      <Field label="Cost" value={f.cost} onChangeText={set('cost')} />
      <Field label="Registration link (optional)" value={f.registrationLink} onChangeText={set('registrationLink')} autoCapitalize="none" keyboardType="url" />
      <Field label="Description" value={f.description} onChangeText={set('description')} multiline />
      <Text style={[type.small, { fontWeight: '700', color: colors.ink, marginBottom: 6 }]}>Category</Text>
      <ChipRow>{CATEGORIES.map((c) => <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} />)}</ChipRow>
      <Text style={[type.small, { fontWeight: '700', color: colors.ink, marginTop: 14, marginBottom: 6 }]}>Submitting as</Text>
      <ChipRow>{orgs.map((o) => <Chip key={o.id} label={o.name} active={orgId === o.id} onPress={() => setOrgId(o.id)} />)}</ChipRow>
      <Button label="Submit for approval" onPress={send} style={{ marginTop: 20 }} />
    </Screen>
  );
}

function Admin({ back }: { back: () => void }) {
  const { pendingEvents, reviewEvent, orgs } = useStore();
  return (
    <Screen>
      <Button small variant="light" label="‹ Back" onPress={back} style={{ alignSelf: 'flex-start', marginBottom: 12 }} />
      <Header eyebrow="Admin" title="Review queue" />
      {pendingEvents.map((e) => (
        <Card key={e.id} style={{ padding: 14, marginBottom: 12 }}>
          <Text style={type.h2}>{e.name}</Text>
          <Text style={type.small}>{e.date} · {e.time} · {e.location}</Text>
          <Text style={[type.small, { color: colors.ink }]}>by {orgs.find((o) => o.id === e.orgId)?.name} · {e.category} · {e.cost}</Text>
          <Text style={[type.body, { marginVertical: 10 }]}>{e.description}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button small label="Approve & publish" onPress={() => reviewEvent(e.id, 'approved')} />
            <Button small variant="danger" label="Reject" onPress={() => reviewEvent(e.id, 'rejected')} />
          </View>
        </Card>
      ))}
      {!pendingEvents.length && <Text style={type.body}>No pending submissions.</Text>}
    </Screen>
  );
}
