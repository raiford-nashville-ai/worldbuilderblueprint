import { autoGrow } from '../components/autosize-textarea.js';

// This feature exclusively owns recognition, mic tracks, AudioContext and RAF.
// The browser may send speech to its service; the optional meter is local.
export function initVoice(root, sparkInput) {
  const button = root.querySelector('#micButton');
  const group = root.querySelector('#micGroup');
  const disclosure = root.querySelector('#voiceDisclosure');
  const status = root.querySelector('#voiceStatus');
  const bars = [...root.querySelectorAll('#audioMeter span')];
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let microphone = null;
  let listening = false;
  let audioStream = null;
  let audioContext = null;
  let meterFrame = 0;
  let session = 0;

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle('is-error', isError);
  }
  function stopAudioMeter() {
    cancelAnimationFrame(meterFrame);
    audioStream?.getTracks().forEach(track => track.stop());
    audioContext?.close().catch(() => {});
    audioStream = null;
    audioContext = null;
    bars.forEach(bar => { bar.style.height = '3px'; });
  }
  function cleanVoiceUI() {
    listening = false;
    microphone = null;
    session++;
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', 'Use voice input');
    group.classList.remove('is-listening');
    stopAudioMeter();
  }
  function stop() {
    const recognition = microphone;
    // Ignore late events from a stopped session, including pending permission.
    cleanVoiceUI();
    if (recognition) { try { recognition.abort(); } catch (_) {} }
    disclosure.hidden = true;
  }
  async function startAudioMeter(currentSession) {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!navigator.mediaDevices?.getUserMedia || !AudioContextCtor) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      if (!listening || currentSession !== session) { stream.getTracks().forEach(track => track.stop()); return; }
      audioStream = stream;
      audioContext = new AudioContextCtor();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      audioContext.createMediaStreamSource(stream).connect(analyser);
      const buffer = new Uint8Array(analyser.frequencyBinCount);
      const update = () => {
        if (!listening || currentSession !== session) return;
        analyser.getByteFrequencyData(buffer);
        const energy = buffer.slice(1, 30).reduce((sum, value) => sum + value, 0) / 29 / 255;
        bars.forEach((bar, index) => { bar.style.height = `${Math.round(3 + Math.min(.8, energy * 5) * (7 + (2 - Math.abs(index - 2)) * 8))}px`; });
        meterFrame = requestAnimationFrame(update);
      };
      update();
    } catch (_) {
      if (currentSession === session) stopAudioMeter();
      // Speech recognition can continue without the decorative meter.
    }
  }
  button.addEventListener('click', () => {
    if (microphone) { stop(); setStatus('Voice input stopped. You can edit the words above.'); return; }
    if (!Recognition) { setStatus('Voice transcription is not supported in this browser. You can still type your idea.', true); return; }
    disclosure.hidden = !disclosure.hidden;
    if (!disclosure.hidden) root.querySelector('#confirmVoice').focus();
  });
  root.querySelector('#cancelVoice').addEventListener('click', () => { disclosure.hidden = true; button.focus(); });
  root.querySelector('#confirmVoice').addEventListener('click', () => {
    disclosure.hidden = true;
    if (microphone) return;
    try {
      const recognition = new Recognition();
      const currentSession = ++session;
      const voiceBase = sparkInput.value.replace(/\s+$/, '');
      microphone = recognition;
      recognition.lang = document.documentElement.lang || 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onstart = () => {
        if (currentSession !== session) return;
        listening = true;
        button.setAttribute('aria-pressed', 'true');
        button.setAttribute('aria-label', 'Stop voice input');
        group.classList.add('is-listening');
        setStatus('Listening… Speak naturally. Select the microphone again to stop.');
        startAudioMeter(currentSession);
      };
      recognition.onresult = event => {
        if (currentSession !== session) return;
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) transcript += `${event.results[i][0].transcript} `;
        sparkInput.value = [voiceBase, transcript.trim()].filter(Boolean).join(' ');
        autoGrow(sparkInput);
      };
      recognition.onerror = event => {
        if (currentSession !== session) return;
        const issues = { 'not-allowed': 'Microphone permission was denied. You can keep typing.', 'service-not-allowed': 'The browser speech service is unavailable. You can keep typing.', 'no-speech': 'No speech was detected. Try again whenever you like.', 'network': 'Voice transcription could not connect. Your written text is safe.' };
        setStatus(issues[event.error] || 'Voice transcription stopped. You can continue by typing.', true);
        stop();
      };
      recognition.onend = () => {
        if (currentSession !== session) return;
        const wasListening = listening;
        cleanVoiceUI();
        if (wasListening && !status.classList.contains('is-error')) setStatus('Voice input ended. Review or edit your words above.');
      };
      setStatus('Requesting microphone access…');
      recognition.start();
    } catch (_) {
      stop();
      setStatus('Could not start voice transcription in this browser. Please use the text field.', true);
    }
  });
  return { stop, setStatus };
}
