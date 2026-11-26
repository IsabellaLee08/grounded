import React, { useState } from 'react';
import { Text } from 'react-native';
import { colors, type } from '../theme';
import { Button, Card, Header, Screen } from '../components/ui';
import { EventCard } from '../components/EventCard';
import { OrgCard } from '../components/OrgCard';
import { Survey } from '../components/Survey';
import { useStore } from '../store';

export default function ForYouScreen() {
  const { profile, recs, events, orgs } = useStore();
  const [survey, setSurvey] = useState(false);
  const evRecs = recs.filter((r) => r.kind === 'event');
  const clubRecs = recs.filter((r) => r.kind === 'club');
  const bizRecs = recs.filter((r) => r.kind === 'business');

  return (
    <Screen>
      <Header eyebrow="Recommended" title="For you" dot />
      {!profile.onboarded ? (
        <Card style={{ padding: 18 }}>
          <Text style={type.h2}>Tell us what you're into</Text>
          <Text style={[type.body, { marginVertical: 10 }]}>Take the 1-minute survey and we'll build a personalized feed of clubs, events, and local pop-ups.</Text>
          <Button label="Start survey" onPress={() => setSurvey(true)} />
        </Card>
      ) : (
        <>
          <Text style={[type.small, { marginBottom: 14 }]}>
            {recs.length} picks · {profile.major || 'Any major'} · {profile.interests.length} interests
          </Text>
          <Section title="Events" />
          {evRecs.map((r) => <EventCard key={r.id} event={events.find((e) => e.id === r.id)!} reasons={r.reasons} />)}
          <Section title="Clubs & organizations" />
          {clubRecs.map((r) => <OrgCard key={r.id} org={orgs.find((o) => o.id === r.id)!} reasons={r.reasons} />)}
          <Section title="Local pop-ups" />
          {bizRecs.map((r) => <OrgCard key={r.id} org={orgs.find((o) => o.id === r.id)!} reasons={r.reasons} />)}
          {!recs.length && <Text style={type.body}>No matches yet. Try adding more interests.</Text>}
          <Button variant="light" label="Edit survey" onPress={() => setSurvey(true)} style={{ marginTop: 8 }} />
        </>
      )}
      <Survey visible={survey} onClose={() => setSurvey(false)} />
    </Screen>
  );
}

const Section = ({ title }: { title: string }) => (
  <Text style={[type.h2, { color: colors.navy, marginVertical: 8 }]}>{title}</Text>
);
