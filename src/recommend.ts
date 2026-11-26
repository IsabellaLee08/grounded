import { AppEvent, Org, Profile } from './types';

export interface Recommendation {
  kind: 'event' | 'club' | 'business';
  id: string;
  score: number;
  reasons: string[];
}

// Keywords that boost items for a given major. Edit freely.
const MAJOR_KEYWORDS: Record<string, string[]> = {
  Economics: ['finance', 'consulting', 'markets', 'investing', 'venture', 'policy'],
  Commerce: ['finance', 'consulting', 'startup', 'pitch', 'investing', 'venture'],
  'Computer Science': ['code', 'coding', 'hack', 'software', 'interview', 'build'],
  Engineering: ['build', 'hack', 'coding', 'design'],
  Politics: ['policy', 'debate', 'community'],
  English: ['writing', 'film', 'poetry', 'arts'],
};

function reasonsFor(
  category: string, text: string, popularMajors: string[] | undefined, p: Profile,
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  if (p.interests.includes(category as never)) {
    score += 3;
    reasons.push(`Your interest: ${category}`);
  }
  if (popularMajors?.includes(p.major)) {
    score += 2;
    reasons.push(`Popular with ${p.major} majors`);
  }
  const hit = (MAJOR_KEYWORDS[p.major] ?? []).find((k) => text.toLowerCase().includes(k));
  if (hit) {
    score += 1;
    reasons.push(`Mentions "${hit}" (${p.major})`);
  }
  return { score, reasons };
}

/**
 * Local, rule-based recommender (the "AI Recommendations" table in the plan).
 * To use a real LLM, replace this with a call to your backend and keep the same
 * return shape: [{ kind, id, score, reasons[] }].
 */
export function recommend(p: Profile, events: AppEvent[], orgs: Org[]): Recommendation[] {
  const out: Recommendation[] = [];
  for (const ev of events) {
    if (ev.status !== 'approved') continue;
    const { score, reasons } = reasonsFor(ev.category, `${ev.name} ${ev.description}`, ev.popularMajors, p);
    if (score > 0) out.push({ kind: 'event', id: ev.id, score, reasons });
  }
  for (const o of orgs) {
    const { score, reasons } = reasonsFor(o.category, `${o.name} ${o.description}`, undefined, p);
    if (score > 0) out.push({ kind: o.type, id: o.id, score, reasons });
  }
  return out.sort((a, b) => b.score - a.score);
}
