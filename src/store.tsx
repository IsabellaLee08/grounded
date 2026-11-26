import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { AppEvent, Org, Profile } from './types';
import { Recommendation, recommend } from './recommend';

const EMPTY_PROFILE: Profile = { name: '', email: '', major: '', age: '', bio: '', interests: [], onboarded: false };

interface Store {
  session: Session | null;
  authReady: boolean;
  ready: boolean;
  profile: Profile;
  isAdmin: boolean;
  events: AppEvent[];
  orgs: Org[];
  savedEvents: string[];
  followedOrgs: string[];
  recs: Recommendation[];
  approvedEvents: AppEvent[];
  pendingEvents: AppEvent[];
  openEventId: string | null;
  openEvent: (id: string | null) => void;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  toggleSaved: (id: string) => void;
  toggleFollow: (id: string) => void;
  saveProfile: (p: Profile) => Promise<void>;
  submitEvent: (e: Omit<AppEvent, 'id' | 'status' | 'followers'>) => Promise<string | null>;
  reviewEvent: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<Store>(null as never);
export const useStore = () => useContext(Ctx);
export const useOrg = (id: string) => useStore().orgs.find((o) => o.id === id);

const toEvent = (r: any, counts: Record<string, number>): AppEvent => ({
  id: r.id, name: r.name, date: r.date, time: r.time, location: r.location,
  description: r.description, cost: r.cost, registrationLink: r.registration_link ?? undefined,
  category: r.category, orgId: r.org_id, status: r.status,
  popularMajors: r.popular_majors?.length ? r.popular_majors : undefined,
  followers: counts[r.id] ?? 0,
});

const toOrg = (r: any, counts: Record<string, number>): Org => ({
  id: r.id, name: r.name, type: r.type, category: r.category,
  description: r.description, email: r.email, followers: counts[r.id] ?? 0,
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [savedEvents, setSaved] = useState<string[]>([]);
  const [followedOrgs, setFollowed] = useState<string[]>([]);
  const [openEventId, openEvent] = useState<string | null>(null);
  const uid = session?.user.id;

  // --- auth session ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // --- load everything from the database ---
  const refresh = useCallback(async () => {
    if (!uid) return;
    const [p, o, e, se, f, ec, oc] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', uid).maybeSingle(),
      supabase.from('organizations').select('*').order('name'),
      supabase.from('events').select('*').order('date'),
      supabase.from('saved_events').select('event_id').eq('user_id', uid),
      supabase.from('follows').select('org_id').eq('user_id', uid),
      supabase.from('event_follower_counts').select('*'),
      supabase.from('org_follower_counts').select('*'),
    ]);
    const evCounts: Record<string, number> = {};
    (ec.data ?? []).forEach((r: any) => (evCounts[r.event_id] = r.n));
    const orgCounts: Record<string, number> = {};
    (oc.data ?? []).forEach((r: any) => (orgCounts[r.org_id] = r.n));

    if (p.data) {
      setProfile({
        name: p.data.name, email: p.data.email, major: p.data.major, age: p.data.age,
        bio: p.data.bio, interests: p.data.interests ?? [], onboarded: p.data.onboarded,
      });
      setIsAdmin(!!p.data.is_admin);
    }
    setOrgs((o.data ?? []).map((r) => toOrg(r, orgCounts)));
    setEvents((e.data ?? []).map((r) => toEvent(r, evCounts)));
    setSaved((se.data ?? []).map((r: any) => r.event_id));
    setFollowed((f.data ?? []).map((r: any) => r.org_id));
    setReady(true);
  }, [uid]);

  useEffect(() => {
    if (!uid) {
      setReady(false); setProfile(EMPTY_PROFILE); setIsAdmin(false);
      setEvents([]); setOrgs([]); setSaved([]); setFollowed([]);
      return;
    }
    refresh();
    // Live updates: when anyone's event is approved/added, everyone's feed refreshes.
    const ch = supabase
      .channel('grounded-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => refresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'organizations' }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [uid, refresh]);

  const bump = (id: string, d: number) =>
    <T extends { id: string; followers: number }>(list: T[]) =>
      list.map((x) => (x.id === id ? { ...x, followers: Math.max(0, x.followers + d) } : x));

  const value: Store = {
    session, authReady, ready, profile, isAdmin, events, orgs, savedEvents, followedOrgs,
    openEventId, openEvent, refresh,
    approvedEvents: events.filter((e) => e.status === 'approved').sort((a, b) => a.date.localeCompare(b.date)),
    pendingEvents: events.filter((e) => e.status === 'pending'),
    recs: profile.onboarded ? recommend(profile, events, orgs) : [],

    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error?.message ?? null;
    },
    signUp: async (email, password) => {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return error.message;
      if (!data.session) return 'Check your email to confirm your account, then sign in.';
      return null;
    },
    signOut: async () => { await supabase.auth.signOut(); },

    toggleSaved: async (id) => {
      if (!uid) return;
      const on = savedEvents.includes(id);
      setSaved((s) => (on ? s.filter((x) => x !== id) : [...s, id]));
      setEvents(bump(id, on ? -1 : 1));
      const { error } = on
        ? await supabase.from('saved_events').delete().match({ user_id: uid, event_id: id })
        : await supabase.from('saved_events').insert({ user_id: uid, event_id: id });
      if (error) refresh();
    },
    toggleFollow: async (id) => {
      if (!uid) return;
      const on = followedOrgs.includes(id);
      setFollowed((s) => (on ? s.filter((x) => x !== id) : [...s, id]));
      setOrgs(bump(id, on ? -1 : 1));
      const { error } = on
        ? await supabase.from('follows').delete().match({ user_id: uid, org_id: id })
        : await supabase.from('follows').insert({ user_id: uid, org_id: id });
      if (error) refresh();
    },

    saveProfile: async (p) => {
      if (!uid) return;
      setProfile({ ...p, onboarded: true });
      await supabase.from('profiles').update({
        name: p.name, email: p.email, major: p.major, age: p.age, bio: p.bio,
        interests: p.interests, onboarded: true,
      }).eq('id', uid);
    },

    submitEvent: async (e) => {
      if (!uid) return 'Not signed in';
      const { error } = await supabase.from('events').insert({
        name: e.name, date: e.date, time: e.time, location: e.location, description: e.description,
        cost: e.cost, registration_link: e.registrationLink ?? null, category: e.category,
        org_id: e.orgId, status: 'pending', submitted_by: uid,
      });
      if (!error) refresh();
      return error?.message ?? null;
    },

    reviewEvent: async (id, status) => {
      await supabase.from('events').update({ status }).eq('id', id);
      refresh();
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
