'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Sparkles, ArrowLeft, Zap, BarChart3, Palette, Headphones, Link2 } from 'lucide-react';

export default function UpgradeSuccessPage() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);
  const onFinishedRef = useRef<(() => void) | null>(null);

  // Callback sicura
  const handleConfettiFinished = useCallback(() => {
    setShowConfetti(false);
  }, []);

  const features = [
    { icon: Link2, label: 'Link illimitati' },
    { icon: BarChart3, label: 'Analytics avanzati' },
    { icon: Palette, label: 'Personalizzazione completa' },
    { icon: Zap, label: 'Badge in evidenza' },
    { icon: Sparkles, label: 'Effetti premium' },
    { icon: Headphones, label: 'Supporto prioritario' },
  ];

  return (
    <div className="relative min-h-screen bg-[#0c0d12] overflow-hidden">
      {/* Confetti */}
      {showConfetti && <Confetti onFinished={handleConfettiFinished} />}

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Success Icon */}
        <div className="mb-8 animate-bounce">
          <div className="relative">
            <div className="absolute inset-0 bg-[#00d084] blur-2xl opacity-30 animate-pulse" />
            <CheckCircle2 className="h-24 w-24 text-[#00d084]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black text-white sm:text-5xl">
          Upgrade completato!
        </h1>
        
        <p className="mt-4 text-center text-lg text-white/60 sm:text-xl">
          Ora hai accesso a tutte le funzionalità Pro
        </p>

        {/* Features Grid */}
        <div className="mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.label}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-[#00d084]/30 hover:bg-white/[0.05]"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#00d084]/20 bg-[#00d084]/10 text-[#00d084] transition group-hover:scale-110 group-hover:bg-[#00d084]/20">
                <feature.icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-white">{feature.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => router.push('/dashboard')}
            className="group flex items-center gap-2 rounded-xl bg-[#00d084] px-6 py-3.5 text-sm font-black text-[#07100d] transition hover:bg-[#19e49b]"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            Torna alla dashboard
          </button>
          
          <button
            onClick={() => router.push('/dashboard?section=appearance')}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.02] px-6 py-3.5 text-sm font-bold text-white/70 transition hover:border-[#00d084]/30 hover:bg-[#00d084]/10 hover:text-[#00d084]"
          >
            <Sparkles className="h-4 w-4" />
            Personalizza ora
          </button>
        </div>

        {/* Footer Note */}
        <p className="mt-12 text-center text-sm text-white/40">
          Grazie per aver scelto BioLinkr Pro! 🚀
        </p>
      </div>

      {/* Inline Styles for Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// Confetti Component
function Confetti({ onFinished }: { onFinished: () => void }) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const onFinishedCalled = useRef(false);

  useEffect(() => {
    const colors = ['#00d084', '#5cf0bd', '#19e49b', '#ffffff', '#ffd700', '#ff6b6b', '#4ecdc4'];
    const newParticles: ConfettiParticle[] = [];

    // Crea 200 particelle
    for (let i = 0; i < 200; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -Math.random() * 200 - 50,
        size: Math.random() * 12 + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        speed: Math.random() * 4 + 3,
        wobble: Math.random() * 3,
        shape: Math.random() > 0.5 ? 'circle' : 'square',
      });
    }

    setParticles(newParticles);

    let animationFrameId: number;

    const animate = () => {
      setParticles(prev => {
        const updated = prev
          .map(p => ({
            ...p,
            y: p.y + p.speed,
            rotation: p.rotation + p.wobble,
            x: p.x + Math.sin(p.y * 0.05) * 0.3,
          }))
          .filter(p => p.y < 120);

        // Chiama onFinished solo una volta quando tutte le particelle sono uscite
        if (updated.length === 0 && !onFinishedCalled.current) {
          onFinishedCalled.current = true;
          // Usiamo setTimeout per evitare di chiamare durante il render
          setTimeout(() => onFinished(), 0);
        }

        return updated;
      });

      if (!onFinishedCalled.current) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Parte dopo 100ms
    const timer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onFinished]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: particle.shape === 'circle' ? '50%' : '2px',
            opacity: 0.9,
            boxShadow: `0 0 ${particle.size}px ${particle.color}40`,
          }}
        />
      ))}
    </div>
  );
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  speed: number;
  wobble: number;
  shape: 'circle' | 'square';
}