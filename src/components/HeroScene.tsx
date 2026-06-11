import { useEffect, useRef } from "react";
import * as THREE from "three";
import { prefersReducedMotion } from "../lib/gsap";

const VERT = /* glsl */ `
// Ashima simplex noise (3D)
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

uniform float uTime;
uniform float uSize;
uniform float uAmp;
attribute float aRand;
varying float vNoise;
varying float vRand;

void main() {
  vec3 dir = normalize(position);
  float n = snoise(dir * 1.6 + uTime * 0.12);
  float n2 = snoise(dir * 4.0 - uTime * 0.07);
  float displacement = n * uAmp + n2 * uAmp * 0.35;
  vec3 pos = position + dir * displacement;

  vNoise = n * 0.5 + 0.5;
  vRand = aRand;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.6 + vNoise + aRand * 0.6) * (1.0 / -mv.z);
}
`;

const FRAG = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vNoise;
varying float vRand;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float alpha = smoothstep(0.5, 0.05, d);
  vec3 color = mix(uColorB, uColorA, vNoise);
  // sparkle: a fraction of particles run hotter
  color += step(0.92, vRand) * 0.6;
  gl_FragColor = vec4(color, alpha * 0.85);
}
`;

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = prefersReducedMotion();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0, 6);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const COUNT = 6500;
    const positions = new Float32Array(COUNT * 3);
    const rands = new Float32Array(COUNT);
    const golden = Math.PI * (3 - Math.sqrt(5));
    const R = 1.9;
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      positions[i * 3] = Math.cos(theta) * radius * R;
      positions[i * 3 + 1] = y * R;
      positions[i * 3 + 2] = Math.sin(theta) * radius * R;
      rands[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rands, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 26 },
        uAmp: { value: 0.45 },
        uColorA: { value: new THREE.Color("#c8ff3e") },
        uColorB: { value: new THREE.Color("#7b61ff") },
      },
    });
    group.add(new THREE.Points(geo, mat));

    // --- wireframe cage ---
    const cageGeo = new THREE.IcosahedronGeometry(2.7, 1);
    const cage = new THREE.LineSegments(
      new THREE.WireframeGeometry(cageGeo),
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#e9ebee"),
        transparent: true,
        opacity: 0.06,
      })
    );
    group.add(cage);

    const mouse = { x: 0, y: 0 };
    const target = { rx: 0, ry: 0 };
    const onPointer = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    const placeGroup = () => {
      group.position.x = window.innerWidth > 880 ? 1.6 : 0;
      group.position.y = window.innerWidth > 880 ? 0.4 : 0.9;
    };
    placeGroup();
    window.addEventListener("resize", placeGroup);

    const clock = new THREE.Clock();
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(mount);

    const tick = () => {
      if (!visible) return;
      const t = clock.getElapsedTime();
      mat.uniforms.uTime.value = t;

      target.ry += ((mouse.x * 0.5 - target.ry) * 0.04);
      target.rx += ((mouse.y * 0.35 - target.rx) * 0.04);
      group.rotation.y = t * 0.08 + target.ry;
      group.rotation.x = target.rx;
      cage.rotation.y = -t * 0.05;
      cage.rotation.z = t * 0.03;

      const p = Math.min(window.scrollY / window.innerHeight, 1);
      group.position.z = p * 1.8;
      mat.uniforms.uAmp.value = 0.45 + p * 0.9;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    if (reduced) {
      renderer.render(scene, camera);
    } else {
      tick();
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("resize", placeGroup);
      geo.dispose();
      mat.dispose();
      cageGeo.dispose();
      cage.geometry.dispose();
      (cage.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="hero__canvas" ref={mountRef} aria-hidden="true" />;
}
