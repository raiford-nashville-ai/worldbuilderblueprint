import { initDiscovery } from './features/discovery.js';
import { generateBlueprint } from './features/blueprint/generate.js';
import { renderBlueprint } from './features/blueprint/render.js';
import { initExport } from './features/blueprint/export.js';
import { initVoice } from './features/voice.js';
import { createAtmosphere } from './features/atmosphere.js';

// Page coordinator owns stage and the last generated document. IDs/data-* are
// behavior hooks; CSS classes are presentation and explicit visual state only.
const $ = selector => document.querySelector(selector);
const sparkInput = $('#sparkInput');
const creative = $('#creativeExperience');
const blueprintView = $('#blueprintView');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const state = { stage: 'spark', blueprint: null };
const voice = initVoice(creative, sparkInput);
const discovery = initDiscovery(creative, sparkInput, () => voice.setStatus(''));
const exports = initExport(blueprintView, () => state.blueprint);
const atmosphere = createAtmosphere($('#atmosphere'), reducedMotion);

function changeStage(nextStage) {
  state.stage = nextStage;
  sparkInput.rows = nextStage === 'spark' ? 4 : 2;
  document.body.dataset.stage = nextStage;
  creative.hidden = nextStage === 'blueprint';
  blueprintView.hidden = nextStage !== 'blueprint';
  atmosphere.setStage(nextStage);
}
function smoothTop() { window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' }); }
function focusWithoutScroll(element) { element.focus({ preventScroll: true }); }
function editAnswers() {
  exports.clearStatus();
  changeStage('discovery');
  discovery.resize();
  smoothTop();
  focusWithoutScroll($('#discoveryIntro'));
}

$('#startButton').addEventListener('click', () => {
  if (!sparkInput.value.trim()) {
    voice.setStatus('Start with a few words about what you want to create.', true);
    sparkInput.focus();
    return;
  }
  voice.stop();
  discovery.updatePrompts();
  changeStage('discovery');
  discovery.resize();
  smoothTop();
  focusWithoutScroll($('#discoveryIntro'));
});
$('#generateButton').addEventListener('click', async () => {
  if (state.stage === 'generating') return;
  voice.stop();
  const profile = discovery.getProfile();
  if (!profile.spark) {
    changeStage('spark');
    sparkInput.focus();
    voice.setStatus('Describe an idea to begin.', true);
    return;
  }
  const button = $('#generateButton');
  const message = $('#generationStatus');
  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  message.textContent = 'Bringing your ideas together.';
  message.hidden = false;
  changeStage('generating');
  try {
    const blueprint = await generateBlueprint(profile);
    renderBlueprint(blueprint, blueprintView);
    state.blueprint = blueprint;
    exports.clearStatus();
    changeStage('blueprint');
    smoothTop();
    focusWithoutScroll($('#blueprintTitle'));
  } catch (_) {
    message.textContent = 'The Blueprint could not be prepared. Your writing is still here; try again.';
    changeStage('discovery');
  } finally {
    button.disabled = false;
    button.removeAttribute('aria-busy');
    if (state.stage === 'blueprint') message.hidden = true;
  }
});
$('#editButton').addEventListener('click', editAnswers);
$('#homeLink').addEventListener('click', event => {
  if (state.stage === 'blueprint') { event.preventDefault(); editAnswers(); }
});
window.addEventListener('pagehide', () => { voice.stop(); atmosphere.suspend(); });
window.addEventListener('pageshow', () => atmosphere.resume());
