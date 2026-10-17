// Local synthesis contract: {spark, answers} -> Blueprint. No DOM or network.
// A Blueprint contains title, description, createdISO, opening, sections
// ({heading, paragraphs, quotations: [{label, text}], boxed}), openThreads,
// remainingOpen, and the source profile used by Markdown export.
export const KEYS = ['origin', 'essence', 'belief', 'perception', 'friction', 'gravity', 'coherence'];
export const QUESTIONS = {
  origin: "What's its story?",
  essence: 'What makes it matter?',
  belief: 'What does it hold to be true?',
  perception: 'What does it notice that others miss?',
  friction: "What's holding it back?",
  gravity: 'What holds everything together?',
  coherence: 'What makes it stay itself?'
};

const excerpt = (text, max = 240) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max).lastIndexOf(' ');
  return `${clean.slice(0, cut > 60 ? cut : max).replace(/[,;:.!?\s]+$/, '')}…`;
};
function deriveTitle(spark) {
  const first = spark.split(/[\n.!?]/)[0].replace(/\s+/g, ' ').trim();
  const candidate = first.replace(/^(?:i(?:'d| would| want| am going|’d)?\s+(?:like\s+to\s+|to\s+)?|my\s+idea\s+is\s+to\s+|i'm\s+thinking\s+of\s+)(?:create|build|make|write|start|design|develop|imagine)?\s*/i, '').replace(/^(?:to\s+)?(?:create|build|make|write|start|design|develop)\s+/i, '').trim();
  const result = excerpt(candidate || first || 'A World Taking Shape', 67).replace(/[,:;\-–\s]+$/, '');
  return result ? result.charAt(0).toUpperCase() + result.slice(1) : 'A World Taking Shape';
}
function makeSection(heading, paragraphs, quotations = [], boxed = false) {
  return { heading, paragraphs, quotations, boxed };
}
export function createMockBlueprint(profile) {
  const a = profile.answers;
  const known = key => Boolean(a[key]);
  const sections = [];
  sections.push(makeSection('The first spark', [
    'This is the thought that set everything in motion. It is the foundation of the Blueprint, not a problem that needs to be polished away.'
  ], [{ label: 'In your own words', text: profile.spark }]));

  const roots = [];
  const rootsQuotes = [];
  if (known('origin')) { roots.push('You have already given this idea a history. Its beginning is part of the shape it can take.'); rootsQuotes.push({ label: 'Origin', text: a.origin }); }
  if (known('essence')) { roots.push('You have also described why it matters. That reason gives the beginning something to move toward.'); rootsQuotes.push({ label: 'Essence', text: a.essence }); }
  if (!roots.length) roots.push('Its history and deeper purpose are still open. You do not need to decide them now; notice which part of the idea first made you want to begin.');
  sections.push(makeSection('Where it comes from, and why it matters', roots, rootsQuotes));

  const lens = [];
  const lensQuotes = [];
  if (known('belief')) { lens.push('A worldview is taking shape through what this idea holds to be true.'); lensQuotes.push({ label: 'Belief', text: a.belief }); }
  if (known('perception')) { lens.push('Its particular way of noticing the world adds another dimension: what stands out here may be invisible elsewhere.'); lensQuotes.push({ label: 'Perception', text: a.perception }); }
  if (!lens.length) lens.push('The idea does not yet need a fixed philosophy. One useful next discovery may be what it believes, or what it notices that others overlook.');
  sections.push(makeSection('A way of seeing', lens, lensQuotes));

  const tension = [];
  const tensionQuotes = [];
  if (known('friction')) { tension.push('An obstacle has entered the picture. Rather than treating it only as something to remove, it may reveal where the idea has energy.'); tensionQuotes.push({ label: 'Friction', text: a.friction }); }
  if (known('gravity')) { tension.push('You have named a center of gravity: something that can draw separate parts into a whole.'); tensionQuotes.push({ label: 'Gravity', text: a.gravity }); }
  if (known('coherence')) { tension.push('You have also identified an element of continuity—the quality that may let the work grow without losing itself.'); tensionQuotes.push({ label: 'Coherence', text: a.coherence }); }
  if (!tension.length) tension.push('Every developing world eventually meets resistance, finds what holds it together, and learns what must stay true. These are possibilities to explore, not requirements to settle today.');
  sections.push(makeSection('What holds, what resists', tension, tensionQuotes));

  let connection;
  if (known('friction') && known('gravity')) connection = 'You have named both a force of resistance and something that holds the idea together. A promising next step is to explore what happens when they meet. The tension between them may become part of the work’s identity.';
  else if (known('belief') && known('perception')) connection = 'Its belief and its way of noticing the world may be connected. Consider whether what it sees differently is precisely what makes its conviction possible—and what might challenge that conviction.';
  else if (known('origin') && known('essence')) connection = 'The distance between where this began and why it matters may be the beginning of its deeper story. Explore what changed between the first impulse and the purpose you have described.';
  else if (known('friction') && known('coherence')) connection = 'One possibility worth exploring: perhaps the obstacle is also a test of what must remain true. What would the idea refuse to sacrifice, even under pressure?';
  else if (known('essence')) connection = 'You have already named a reason this matters. A useful next move is to ask how that purpose might shape one small, tangible first version.';
  else if (known('origin')) connection = 'You have begun with a story of where this came from. Look for the detail in that beginning that still asks to be carried forward.';
  else connection = 'Your Spark is enough to begin. Choose one small part of it that feels unusually alive; giving that detail a history, a tension, or a purpose may reveal its next shape.';
  sections.push(makeSection('A connection worth exploring', [connection], [], true));

  const unanswered = KEYS.filter(key => !known(key));
  return {
    title: deriveTitle(profile.spark),
    description: 'The first shape of a world, drawn from your words and the questions you chose to explore.',
    createdISO: new Date().toISOString(),
    opening: 'You came here with something imagined. It did not need to be complete to be worth exploring. Here is its first shape—what you have named, what connects, and what is still open.',
    sections,
    openThreads: unanswered.slice(0, 3).map(key => ({ label: key.charAt(0).toUpperCase() + key.slice(1), question: QUESTIONS[key] })),
    remainingOpen: Math.max(0, unanswered.length - 3),
    profile
  };
}

// Replace this boundary only when a real backend exists. Keep credentials and
// provider calls server-side; the current implementation is entirely local.
export async function generateBlueprint(profile) {
  await new Promise(resolve => setTimeout(resolve, 650));
  return createMockBlueprint(profile);
}
