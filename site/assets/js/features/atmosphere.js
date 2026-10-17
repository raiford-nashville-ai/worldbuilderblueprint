// Optional enhancement: one lazy CDN import, one renderer, owned cleanup.
// No workflow depends on this promise; blocked CDN/WebGL leaves a working page.
export function createAtmosphere(canvas, reducedMotion) {
  let atmosphere = null;
  let loading = null;
  let stage = 'spark';
  let suspended = false;
  let generation = 0;

  function destroy() {
    generation++;
    atmosphere?.destroy();
    atmosphere = null;
    loading = null;
  }
  function start() {
    if (reducedMotion.matches || suspended || stage === 'spark' || atmosphere || loading) return;
    const currentGeneration = generation;
    loading = (async () => {
      try {
        const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js');
        if (currentGeneration !== generation || reducedMotion.matches || suspended) return;
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-5, 5, 3.5, -3.5, .1, 20);
        camera.position.z = 8;
        const group = new THREE.Group();
        const material = new THREE.LineBasicMaterial({ color: 0xe2cfac, transparent: true, opacity: .07, depthWrite: false });
        let frame = 0;
        let last = 0;
        const renderOnce = () => renderer.render(scene, camera);
        const resize = () => {
          renderer.setSize(window.innerWidth, window.innerHeight, false);
          const aspect = window.innerWidth / window.innerHeight;
          camera.left = -4 * aspect;
          camera.right = 4 * aspect;
          camera.top = 4;
          camera.bottom = -4;
          camera.updateProjectionMatrix();
          renderOnce();
        };
        const animate = time => {
          frame = requestAnimationFrame(animate);
          if (time - last < 40) return;
          last = time;
          group.position.y = Math.sin(time * .000075) * .11;
          group.rotation.z = Math.sin(time * .000051) * .008;
          renderOnce();
        };
        const sync = () => {
          cancelAnimationFrame(frame);
          renderOnce();
          if (!document.hidden && stage !== 'spark') frame = requestAnimationFrame(animate);
        };
        atmosphere = {
          sync,
          destroy: () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', resize);
            document.removeEventListener('visibilitychange', sync);
            group.children.forEach(line => line.geometry.dispose());
            material.dispose();
            renderer.dispose();
          }
        };
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        for (let i = 0; i < 8; i++) {
          const points = [];
          for (let j = 0; j <= 140; j++) {
            const x = -6 + (j / 140) * 12;
            const y = -1.6 + i * .39 + Math.sin(x * .56 + i * .36) * (.24 + i * .018);
            points.push(new THREE.Vector3(x, y, 0));
          }
          group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
        }
        scene.add(group);
        window.addEventListener('resize', resize, { passive: true });
        document.addEventListener('visibilitychange', sync);
        resize();
        sync();
      } catch (_) {
        if (currentGeneration !== generation) return;
        atmosphere?.destroy();
        atmosphere = null;
        // Retain the settled promise: do not retry a blocked CDN at every stage.
      }
    })();
  }
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) destroy();
    else start();
  });
  return {
    setStage(nextStage) { stage = nextStage; start(); atmosphere?.sync(); },
    suspend() { suspended = true; destroy(); },
    resume() { suspended = false; start(); }
  };
}
