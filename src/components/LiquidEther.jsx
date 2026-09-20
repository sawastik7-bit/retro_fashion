import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const defaultColors = ['#ff2d6b', '#ffd600', '#1d3557'];

export function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  resolution = 0.5,
  colors = defaultColors,
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6,
}) {
  const mountRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    let disposed = false;

    try {
      function makePaletteTexture(stops) {
        const arr = Array.isArray(stops) && stops.length > 0
          ? (stops.length === 1 ? [stops[0], stops[0]] : stops)
          : ['#ffffff', '#ffffff'];
        const w = arr.length;
        const data = new Uint8Array(w * 4);
        for (let i = 0; i < w; i++) {
          const c = new THREE.Color(arr[i]);
          data[i * 4] = Math.round(c.r * 255);
          data[i * 4 + 1] = Math.round(c.g * 255);
          data[i * 4 + 2] = Math.round(c.b * 255);
          data[i * 4 + 3] = 255;
        }
        const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
        tex.magFilter = THREE.LinearFilter;
        tex.minFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
        return tex;
      }

      const paletteTex = makePaletteTexture(colors);
      const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

      let renderer, clock, sim, output, autoDriver;
      let mouseCoords = new THREE.Vector2(0, 0);
      let mouseCoordsOld = new THREE.Vector2(0, 0);
      let mouseDiff = new THREE.Vector2(0, 0);
      let mouseTimer = null;
      let isHoverInside = false;
      let isAutoActive = false;
      let takeoverActive = false;
      let takeoverStartTime = 0;
      let takeoverFrom = new THREE.Vector2();
      let takeoverTo = new THREE.Vector2();
      let lastUserInteraction = performance.now();
      let running = false;
      let rafId = null;
      let autoActive = false;
      let autoCurrent = new THREE.Vector2(0, 0);
      let autoTarget = new THREE.Vector2();
      let autoLastTime = performance.now();
      let autoActivationTime = 0;

      function pickAutoTarget() {
        const m = 0.2;
        autoTarget.set((Math.random() * 2 - 1) * (1 - m), (Math.random() * 2 - 1) * (1 - m));
      }

      const face_vert = `
        attribute vec3 position;
        uniform vec2 px;
        uniform vec2 boundarySpace;
        varying vec2 uv;
        precision highp float;
        void main(){
          vec3 pos = position;
          vec2 scale = 1.0 - boundarySpace * 2.0;
          pos.xy = pos.xy * scale;
          uv = vec2(0.5)+(pos.xy)*0.5;
          gl_Position = vec4(pos, 1.0);
        }
      `;

      const line_vert = `
        attribute vec3 position;
        uniform vec2 px;
        precision highp float;
        varying vec2 uv;
        void main(){
          vec3 pos = position;
          uv = 0.5 + pos.xy * 0.5;
          vec2 n = sign(pos.xy);
          pos.xy = abs(pos.xy) - px * 1.0;
          pos.xy *= n;
          gl_Position = vec4(pos, 1.0);
        }
      `;

      const mouse_vert = `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform vec2 center;
        uniform vec2 scale;
        uniform vec2 px;
        varying vec2 vUv;
        void main(){
          vec2 pos = position.xy * scale * 2.0 * px + center;
          vUv = uv;
          gl_Position = vec4(pos, 0.0, 1.0);
        }
      `;

      const advection_frag = `
        precision highp float;
        uniform sampler2D velocity;
        uniform float dt;
        uniform bool isBFECC;
        uniform vec2 fboSize;
        varying vec2 uv;
        void main(){
          vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
          if(isBFECC == false){
            vec2 vel = texture2D(velocity, uv).xy;
            vec2 uv2 = uv - vel * dt * ratio;
            vec2 newVel = texture2D(velocity, uv2).xy;
            gl_FragColor = vec4(newVel, 0.0, 0.0);
          } else {
            vec2 spot_new = uv;
            vec2 vel_old = texture2D(velocity, uv).xy;
            vec2 spot_old = spot_new - vel_old * dt * ratio;
            vec2 vel_new1 = texture2D(velocity, spot_old).xy;
            vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;
            vec2 error = spot_new2 - spot_new;
            vec2 spot_new3 = spot_new - error / 2.0;
            vec2 vel_2 = texture2D(velocity, spot_new3).xy;
            vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;
            vec2 newVel2 = texture2D(velocity, spot_old2).xy;
            gl_FragColor = vec4(newVel2, 0.0, 0.0);
          }
        }
      `;

      const color_frag = `
        precision highp float;
        uniform sampler2D velocity;
        uniform sampler2D palette;
        uniform vec4 bgColor;
        varying vec2 uv;
        void main(){
          vec2 vel = texture2D(velocity, uv).xy;
          float lenv = clamp(length(vel), 0.0, 1.0);
          vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb;
          vec3 outRGB = mix(bgColor.rgb, c, lenv);
          float outA = mix(bgColor.a, 1.0, lenv);
          gl_FragColor = vec4(outRGB, outA);
        }
      `;

      const divergence_frag = `
        precision highp float;
        uniform sampler2D velocity;
        uniform float dt;
        uniform vec2 px;
        varying vec2 uv;
        void main(){
          float x0 = texture2D(velocity, uv-vec2(px.x, 0.0)).x;
          float x1 = texture2D(velocity, uv+vec2(px.x, 0.0)).x;
          float y0 = texture2D(velocity, uv-vec2(0.0, px.y)).y;
          float y1 = texture2D(velocity, uv+vec2(0.0, px.y)).y;
          float divergence = (x1 - x0 + y1 - y0) / 2.0;
          gl_FragColor = vec4(divergence / dt);
        }
      `;

      const externalForce_frag = `
        precision highp float;
        uniform vec2 force;
        uniform vec2 center;
        uniform vec2 scale;
        uniform vec2 px;
        varying vec2 vUv;
        void main(){
          vec2 circle = (vUv - 0.5) * 2.0;
          float d = 1.0 - min(length(circle), 1.0);
          d *= d;
          gl_FragColor = vec4(force * d, 0.0, 1.0);
        }
      `;

      const poisson_frag = `
        precision highp float;
        uniform sampler2D pressure;
        uniform sampler2D divergence;
        uniform vec2 px;
        varying vec2 uv;
        void main(){
          float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
          float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
          float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;
          float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;
          float div = texture2D(divergence, uv).r;
          float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
          gl_FragColor = vec4(newP);
        }
      `;

      const pressure_frag = `
        precision highp float;
        uniform sampler2D pressure;
        uniform sampler2D velocity;
        uniform vec2 px;
        uniform float dt;
        varying vec2 uv;
        void main(){
          float step = 1.0;
          float p0 = texture2D(pressure, uv + vec2(px.x * step, 0.0)).r;
          float p1 = texture2D(pressure, uv - vec2(px.x * step, 0.0)).r;
          float p2 = texture2D(pressure, uv + vec2(0.0, px.y * step)).r;
          float p3 = texture2D(pressure, uv - vec2(0.0, px.y * step)).r;
          vec2 v = texture2D(velocity, uv).xy;
          vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
          v = v - gradP * dt;
          gl_FragColor = vec4(v, 0.0, 1.0);
        }
      `;

      const viscous_frag = `
        precision highp float;
        uniform sampler2D velocity;
        uniform sampler2D velocity_new;
        uniform float v;
        uniform vec2 px;
        uniform float dt;
        varying vec2 uv;
        void main(){
          vec2 old = texture2D(velocity, uv).xy;
          vec2 new0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0.0)).xy;
          vec2 new1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0.0)).xy;
          vec2 new2 = texture2D(velocity_new, uv + vec2(0.0, px.y * 2.0)).xy;
          vec2 new3 = texture2D(velocity_new, uv - vec2(0.0, px.y * 2.0)).xy;
          vec2 newv = 4.0 * old + v * dt * (new0 + new1 + new2 + new3);
          newv /= 4.0 * (1.0 + v * dt);
          gl_FragColor = vec4(newv, 0.0, 0.0);
        }
      `;

      let w = Math.max(1, Math.round(resolution * container.clientWidth));
      let h = Math.max(1, Math.round(resolution * container.clientHeight));
      let fboSize = new THREE.Vector2(w, h);
      let cellScale = new THREE.Vector2(1 / w, 1 / h);
      let boundarySpace = new THREE.Vector2();

      const floatType = /(iPad|iPhone|iPod)/i.test(navigator.userAgent) ? THREE.HalfFloatType : THREE.FloatType;
      const fboOpts = { type: floatType, depthBuffer: false, stencilBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping };

      const fbos = {};
      ['vel_0', 'vel_1', 'vel_viscous0', 'vel_viscous1', 'div', 'pressure_0', 'pressure_1'].forEach(k => {
        fbos[k] = new THREE.WebGLRenderTarget(fboSize.x, fboSize.y, fboOpts);
      });

      function resizeFBOS() {
        w = Math.max(1, Math.round(resolution * container.clientWidth));
        h = Math.max(1, Math.round(resolution * container.clientHeight));
        fboSize.set(w, h);
        cellScale.set(1 / w, 1 / h);
        Object.values(fbos).forEach(f => f.setSize(w, h));
      }

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.autoClear = false;
      renderer.setClearColor(new THREE.Color(0x000000), 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      container.prepend(renderer.domElement);

      clock = new THREE.Clock();
      clock.start();

      function makePass(vs, fs, uniforms, outputFBO) {
        const scene = new THREE.Scene();
        const camera = new THREE.Camera();
        const material = new THREE.RawShaderMaterial({ vertexShader: vs, fragmentShader: fs, uniforms });
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(plane);
        return {
          scene, camera, material, uniforms, output: outputFBO,
          render() {
            renderer.setRenderTarget(this.output || null);
            renderer.render(this.scene, this.camera);
            renderer.setRenderTarget(null);
          }
        };
      }

      const advectionPass = makePass(face_vert, advection_frag, {
        boundarySpace: { value: cellScale },
        px: { value: cellScale },
        fboSize: { value: fboSize },
        velocity: { value: fbos.vel_0.texture },
        dt: { value: 0.014 },
        isBFECC: { value: true },
      }, fbos.vel_1);

      const mouseG = new THREE.PlaneGeometry(1, 1);
      const mouseM = new THREE.RawShaderMaterial({
        vertexShader: mouse_vert,
        fragmentShader: externalForce_frag,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          px: { value: cellScale },
          force: { value: new THREE.Vector2(0, 0) },
          center: { value: new THREE.Vector2(0, 0) },
          scale: { value: new THREE.Vector2(cursorSize, cursorSize) },
        },
      });
      const mouseMesh = new THREE.Mesh(mouseG, mouseM);
      const forceScene = new THREE.Scene();
      forceScene.add(mouseMesh);

      const divergencePass = makePass(face_vert, divergence_frag, {
        boundarySpace: { value: boundarySpace },
        velocity: { value: fbos.vel_viscous0.texture },
        px: { value: cellScale },
        dt: { value: 0.014 },
      }, fbos.div);

      const poissonPass = makePass(face_vert, poisson_frag, {
        boundarySpace: { value: boundarySpace },
        pressure: { value: fbos.pressure_0.texture },
        divergence: { value: fbos.div.texture },
        px: { value: cellScale },
      }, fbos.pressure_1);

      const pressurePass = makePass(face_vert, pressure_frag, {
        boundarySpace: { value: boundarySpace },
        pressure: { value: fbos.pressure_0.texture },
        velocity: { value: fbos.vel_viscous0.texture },
        px: { value: cellScale },
        dt: { value: 0.014 },
      }, fbos.vel_0);

      const outputScene = new THREE.Scene();
      const outputCamera = new THREE.Camera();
      const outputMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.RawShaderMaterial({
          vertexShader: face_vert,
          fragmentShader: color_frag,
          transparent: true,
          depthWrite: false,
          uniforms: {
            velocity: { value: fbos.vel_0.texture },
            boundarySpace: { value: new THREE.Vector2() },
            palette: { value: paletteTex },
            bgColor: { value: bgVec4 },
          },
        })
      );
      outputScene.add(outputMesh);

      pickAutoTarget();

      function onMouseMove(e) {
        const rect = container.getBoundingClientRect();
        const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
        isHoverInside = inside;
        if (!inside) return;
        lastUserInteraction = performance.now();
        if (autoActive) {
          autoActive = false;
          isAutoActive = false;
        }
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = (e.clientY - rect.top) / rect.height;
        mouseCoords.set(nx * 2 - 1, -(ny * 2 - 1));
        if (mouseTimer) clearTimeout(mouseTimer);
        mouseTimer = setTimeout(() => {}, 100);
      }

      function onTouchMove(e) {
        if (e.touches.length !== 1) return;
        const t = e.touches[0];
        const rect = container.getBoundingClientRect();
        if (t.clientX < rect.left || t.clientX > rect.right || t.clientY < rect.top || t.clientY > rect.bottom) return;
        lastUserInteraction = performance.now();
        if (autoActive) { autoActive = false; isAutoActive = false; }
        const nx = (t.clientX - rect.left) / rect.width;
        const ny = (t.clientY - rect.top) / rect.height;
        mouseCoords.set(nx * 2 - 1, -(ny * 2 - 1));
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove, { passive: true });

      const dt = 0.014;

      function simStep() {
        boundarySpace.copy(new THREE.Vector2(cellScale.x, cellScale.y));

        advectionPass.uniforms.dt.value = dt;
        advectionPass.uniforms.isBFECC.value = true;
        advectionPass.render();

        mouseM.uniforms.force.value.set((mouseDiff.x / 2) * mouseForce, (mouseDiff.y / 2) * mouseForce);
        mouseM.uniforms.center.value.copy(mouseCoords);
        mouseM.uniforms.scale.value.set(cursorSize, cursorSize);
        renderer.setRenderTarget(fbos.vel_1);
        renderer.render(forceScene, new THREE.Camera());
        renderer.setRenderTarget(null);

        divergencePass.uniforms.velocity.value = fbos.vel_1.texture;
        divergencePass.render();

        for (let i = 0; i < 32; i++) {
          const pIn = i % 2 === 0 ? fbos.pressure_0 : fbos.pressure_1;
          const pOut = i % 2 === 0 ? fbos.pressure_1 : fbos.pressure_0;
          poissonPass.uniforms.pressure.value = pIn.texture;
          poissonPass.uniforms.divergence.value = fbos.div.texture;
          poissonPass.output = pOut;
          poissonPass.render();
        }

        pressurePass.uniforms.velocity.value = fbos.vel_viscous0.texture;
        pressurePass.uniforms.pressure.value = fbos.pressure_0.texture;
        pressurePass.render();
      }

      function animate() {
        if (!running || disposed) return;

        mouseDiff.subVectors(mouseCoords, mouseCoordsOld);
        mouseCoordsOld.copy(mouseCoords);
        if (isAutoActive) mouseDiff.multiplyScalar(autoIntensity);

        if (autoDemo) {
          const now = performance.now();
          const idle = now - lastUserInteraction;
          if (idle > autoResumeDelay && !isHoverInside) {
            if (!autoActive) {
              autoActive = true;
              autoCurrent.copy(mouseCoords);
              autoLastTime = now;
              autoActivationTime = now;
            }
            isAutoActive = true;
            let autoDt = (now - autoLastTime) / 1000;
            autoLastTime = now;
            if (autoDt > 0.2) autoDt = 0.016;
            const dir = new THREE.Vector2().subVectors(autoTarget, autoCurrent);
            const dist = dir.length();
            if (dist < 0.01) { pickAutoTarget(); } else {
              dir.normalize();
              let ramp = 1;
              if (autoRampDuration > 0) {
                const t = Math.min(1, (now - autoActivationTime) / (autoRampDuration * 1000));
                ramp = t * t * (3 - 2 * t);
              }
              const step = autoSpeed * autoDt * ramp;
              const move = Math.min(step, dist);
              autoCurrent.addScaledVector(dir, move);
              mouseCoords.set(autoCurrent.x, autoCurrent.y);
            }
          }
        }

        simStep();

        renderer.setRenderTarget(null);
        renderer.render(outputScene, outputCamera);

        clock.getDelta();
        rafId = requestAnimationFrame(animate);
      }

      function start() { if (!running && !disposed) { running = true; animate(); } }
      function pause() { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = null; }

      function onResize() {
        if (!container) return;
        renderer.setSize(container.clientWidth, container.clientHeight);
        resizeFBOS();
      }
      window.addEventListener('resize', onResize);

      const visHandler = () => { if (document.hidden) pause(); else start(); };
      document.addEventListener('visibilitychange', visHandler);

      start();

      cleanupRef.current = () => {
        disposed = true;
        pause();
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', visHandler);
        if (renderer) {
          const canvas = renderer.domElement;
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
          renderer.dispose();
        }
        Object.values(fbos).forEach(f => f.dispose());
        paletteTex.dispose();
      };
    } catch (err) {
      console.warn('LiquidEther init failed:', err?.message);
    }

    return () => {
      disposed = true;
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [colors, autoDemo, autoSpeed, autoIntensity, takeoverDuration, autoResumeDelay, autoRampDuration, mouseForce, cursorSize, resolution]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative overflow-hidden pointer-events-none touch-none"
    />
  );
}

export default LiquidEther;
