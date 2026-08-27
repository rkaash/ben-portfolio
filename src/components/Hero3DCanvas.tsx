import React, { useEffect, useRef } from 'react';
import { ThemeMode } from '../types';

interface Hero3DCanvasProps {
  theme: ThemeMode;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  baseRadius: number;
  color: string;
}

interface Node3D {
  x: number;
  y: number;
  z: number;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });
  const scrollRef = useRef<{ current: number; target: number; velocity: number; lastScroll: number }>({
    current: 0,
    target: 0,
    velocity: 0,
    lastScroll: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - width / 2;
      const y = e.clientY - height / 2;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleScroll = () => {
      const currentScroll = window.scrollY || document.documentElement.scrollTop;
      scrollRef.current.target = currentScroll;
      scrollRef.current.velocity = (currentScroll - scrollRef.current.lastScroll) * 0.1;
      scrollRef.current.lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Color palette based on theme
    const isDark = theme !== 'light';
    const primaryColor = theme === 'artistic'
      ? 'rgba(255, 62, 0, '
      : theme === 'cyberpunk' 
        ? 'rgba(236, 72, 153, ' 
        : theme === 'midnight' 
          ? 'rgba(129, 140, 248, ' 
          : 'rgba(56, 189, 248, ';
    const secondaryColor = theme === 'artistic'
      ? 'rgba(255, 158, 0, '
      : theme === 'cyberpunk'
        ? 'rgba(34, 211, 238, '
        : 'rgba(99, 102, 241, ';
    const accentBlue = 'rgba(59, 130, 246, ';

    // Generate Particles that encompass full 3D space
    const particleCount = Math.min(120, Math.max(60, Math.floor(width / 14)));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2.5,
        z: Math.random() * 1000 + 100,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        vz: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2.2 + 0.8,
        baseRadius: Math.random() * 2.2 + 0.8,
        color: Math.random() > 0.6 ? primaryColor : (Math.random() > 0.3 ? secondaryColor : accentBlue),
      });
    }

    // 3D Icosahedron / Polyhedron geometric nodes
    const fov = 450;
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVertices: [number, number, number][] = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ];
    
    // Normalize and scale icosahedron for central prominence
    const icosahedronScale = Math.min(width, height) * (width < 640 ? 0.32 : 0.25);
    const nodes: Node3D[] = rawVertices.map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return {
        x: (x / len) * icosahedronScale,
        y: (y / len) * icosahedronScale,
        z: (z / len) * icosahedronScale
      };
    });

    // Secondary inner geometric core for rich depth
    const innerScale = icosahedronScale * 0.55;
    const innerNodes: Node3D[] = rawVertices.map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return {
        x: (x / len) * innerScale,
        y: (y / len) * innerScale,
        z: (z / len) * innerScale
      };
    });

    // Edges of icosahedron
    const edges: [number, number][] = [
      [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
      [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
      [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
      [9, 4], [4, 2], [2, 6], [6, 8], [8, 9],
      [4, 5], [5, 9], [9, 1], [1, 8], [8, 7],
      [7, 6], [6, 10], [10, 2], [2, 11], [11, 4]
    ];

    let rotX = 0;
    let rotY = 0;
    let rotZ = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse easing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      // Smooth scroll interpolation with capped speed
      scrollRef.current.current += (scrollRef.current.target - scrollRef.current.current) * 0.06;
      scrollRef.current.velocity *= 0.88;

      const centerX = width / 2;
      const centerY = height / 2;

      // Fixed, elegant, constant rotational speed across the entire website
      rotX += 0.0016;
      rotY += 0.0020;
      rotZ += 0.0006;

      // Gentle interactive mouse perspective (non-accumulating)
      const currentRotX = rotX + mouseRef.current.y * 0.0003;
      const currentRotY = rotY + mouseRef.current.x * 0.0003;
      const currentRotZ = rotZ;

      // Gentle subtle breathing float
      const floatY = Math.sin(Date.now() * 0.0012) * 8;

      // 1. Draw 3D Polyhedral Wireframe Centerpiece
      const projectNode = (node: Node3D, rx: number, ry: number, rz: number, offsetY = 0) => {
        // Rotate around X
        let y1 = node.y * Math.cos(rx) - node.z * Math.sin(rx);
        let z1 = node.y * Math.sin(rx) + node.z * Math.cos(rx);

        // Rotate around Y
        let x2 = node.x * Math.cos(ry) + z1 * Math.sin(ry);
        let z2 = -node.x * Math.sin(ry) + z1 * Math.cos(ry);

        // Rotate around Z
        let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
        let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

        const distance = 500 + z2;
        const scale = fov / (distance > 0 ? distance : 1);
        const px = centerX + x3 * scale + mouseRef.current.x * 0.03;
        const py = centerY + offsetY + floatY + y3 * scale + mouseRef.current.y * 0.03;

        return { x: px, y: py, z: z2, scale };
      };

      const projectedNodes = nodes.map(node => projectNode(node, currentRotX, currentRotY, currentRotZ));
      const projectedInnerNodes = innerNodes.map(node => projectNode(node, -currentRotX * 1.2, currentRotY * 1.3, -currentRotZ));

      // Draw Outer Edges of 3D Shape
      edges.forEach(([i, j]) => {
        const p1 = projectedNodes[i];
        const p2 = projectedNodes[j];
        if (!p1 || !p2) return;

        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.04, Math.min(0.45, (avgZ + icosahedronScale) / (2 * icosahedronScale) * 0.35 + 0.08));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `${primaryColor}${alpha})`;
        ctx.lineWidth = isDark ? 1.1 : 0.9;
        ctx.stroke();
      });

      // Draw Inner Core Edges
      edges.forEach(([i, j]) => {
        const p1 = projectedInnerNodes[i];
        const p2 = projectedInnerNodes[j];
        if (!p1 || !p2) return;

        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.02, Math.min(0.25, (avgZ + innerScale) / (2 * innerScale) * 0.2 + 0.04));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `${secondaryColor}${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Connect outer nodes to inner nodes with subtle neural rays
      for (let k = 0; k < 12; k += 2) {
        const pOut = projectedNodes[k];
        const pIn = projectedInnerNodes[k];
        if (pOut && pIn) {
          ctx.beginPath();
          ctx.moveTo(pOut.x, pOut.y);
          ctx.lineTo(pIn.x, pIn.y);
          ctx.strokeStyle = `${accentBlue}0.15)`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // Draw Node vertices with glowing dots
      projectedNodes.forEach(p => {
        const alpha = Math.max(0.15, (p.z + icosahedronScale) / (2 * icosahedronScale) * 0.8);
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1.5, 3 * p.scale), 0, Math.PI * 2);
        ctx.fillStyle = `${secondaryColor}${alpha})`;
        ctx.fill();

        // Glow ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(3, 6 * p.scale), 0, Math.PI * 2);
        ctx.strokeStyle = `${primaryColor}${alpha * 0.3})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // 2. Render Interactive Background Floating Particle Constellations with smooth gentle drift
      const cappedScrollDrift = Math.max(-0.4, Math.min(0.4, scrollRef.current.velocity * 0.02));

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy - cappedScrollDrift;
        p.z += p.vz;

        if (p.x < -width) p.x = width;
        if (p.x > width) p.x = -width;
        if (p.y < -height * 1.5) p.y = height * 1.5;
        if (p.y > height * 1.5) p.y = -height * 1.5;
        if (p.z < 50) p.z = 1000;
        if (p.z > 1000) p.z = 50;

        const scale = fov / p.z;
        const px = centerX + p.x * scale + mouseRef.current.x * 0.02;
        const py = centerY + p.y * scale + mouseRef.current.y * 0.02;

        const alpha = Math.min(0.65, (1 - p.z / 1000) * (isDark ? 0.6 : 0.3));

        ctx.beginPath();
        ctx.arc(px, py, p.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.fill();

        // Connect nearby particles with subtle lines
        for (let j = idx + 1; j < Math.min(idx + 12, particles.length); j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * (isDark ? 0.12 : 0.06);
            const scale2 = fov / p2.z;
            const px2 = centerX + p2.x * scale2 + mouseRef.current.x * 0.02;
            const py2 = centerY + p2.y * scale2 + mouseRef.current.y * 0.02;

            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px2, py2);
            ctx.strokeStyle = `${primaryColor}${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      id="global-3d-background-canvas"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none w-screen h-screen z-0 opacity-80 transition-opacity duration-700"
    />
  );
};

