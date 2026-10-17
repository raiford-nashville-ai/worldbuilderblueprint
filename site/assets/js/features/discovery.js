import { autoGrow } from '../components/autosize-textarea.js';

const PROMPTS = {
  general: {
    origin: ['What happened before this idea could exist?', 'Was there a moment, a need, or a curiosity that started it?'],
    essence: ['Who or what would be different if it existed?', 'What would be missing if it never came to life?'],
    belief: ['What assumption or principle gives it direction?', 'What does it refuse to stop believing?'],
    perception: ['What small detail or overlooked pattern does it see?', 'What does everyone else take for granted?'],
    friction: ['What resistance makes this difficult or interesting?', 'Which contradiction has not been resolved?'],
    gravity: ['What draws its different parts toward one another?', 'What promise or relationship is at its center?'],
    coherence: ['What could change without losing its identity?', 'What must always remain true?']
  },
  story: {
    origin: ['What happened before the story begins?', 'Which past event still shapes this character or world?'],
    essence: ['Why should someone care what happens next?', 'What is emotionally at stake?'],
    belief: ['Which conviction guides this character or society?', 'What assumption will the story challenge?'],
    perception: ['What does your protagonist see differently?', 'What truth is invisible to everyone else?'],
    friction: ['What does the character want, and what stands against it?', 'What contradiction creates the story’s tension?'],
    gravity: ['Which relationship, place, or promise connects it all?', 'What keeps drawing everyone back?'],
    coherence: ['What must remain unmistakably true of this world?', 'Which qualities would you protect through every change?']
  },
  business: {
    origin: ['What frustration or unmet need started this?', 'What experience made you think this ought to exist?'],
    essence: ['Whose life becomes easier or more meaningful?', 'What value would remain even before it earns money?'],
    belief: ['What do you believe this field gets wrong?', 'Which principle would guide difficult decisions?'],
    perception: ['What customer need goes unnoticed?', 'What opportunity do others dismiss?'],
    friction: ['What makes the problem hard to solve?', 'What would make a first version difficult to launch?'],
    gravity: ['What shared purpose connects product, people, and audience?', 'What would bring early supporters together?'],
    coherence: ['What promise should never be compromised?', 'What must stay true as the business grows?']
  }
};

function inferIdeaType(spark) {
  if (/\b(business|company|startup|brand|service|customers|shop|store|app|product|venture|nonprofit)\b/i.test(spark)) return 'business';
  if (/\b(story|novel|character|fantasy|fiction|kingdom|universe|world|comic|screenplay|hero|protagonist)\b/i.test(spark)) return 'story';
  return 'general';
}

// Fields remain the source of truth while editing. Snapshots are plain values,
// never DOM references, so generation cannot mutate or clear someone's answers.
export function initDiscovery(root, sparkInput, onSparkInput) {
  const fields = [...root.querySelectorAll('[data-answer]')];
  sparkInput.addEventListener('input', () => {
    autoGrow(sparkInput);
    if (sparkInput.value.trim()) onSparkInput();
  });
  fields.forEach(field => field.addEventListener('input', () => {
    autoGrow(field);
    field.closest('[data-key]').classList.toggle('has-answer', Boolean(field.value.trim()));
  }));

  function updatePrompts() {
    const type = inferIdeaType(sparkInput.value);
    root.querySelectorAll('[data-prompts]').forEach(list => {
      list.replaceChildren(...PROMPTS[type][list.dataset.prompts].map(prompt => {
        const item = document.createElement('li');
        item.textContent = prompt;
        return item;
      }));
    });
  }
  updatePrompts();
  autoGrow(sparkInput);
  return {
    updatePrompts,
    resize: () => { autoGrow(sparkInput); fields.forEach(autoGrow); },
    getProfile: () => ({
      spark: sparkInput.value.trim(),
      answers: Object.fromEntries(fields.map(field => [field.dataset.answer, field.value.trim()]))
    })
  };
}
