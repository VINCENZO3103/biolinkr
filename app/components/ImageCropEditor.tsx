"use client";

import { PointerEvent, useRef } from "react";

type ImageCropEditorProps = {
  src: string;
  x: number;
  y: number;
  onChange: (x: number, y: number) => void;
  label?: string;
  size?: number;
  iconSize: number;
};

export default function ImageCropEditor({
  src,
  x,
  y,
  onChange,
  label = "Ritaglia icona",
  size = 220,
  iconSize,
}: ImageCropEditorProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const initializedRef = useRef(false);

  function updatePosition(event: PointerEvent<HTMLDivElement>) {
    const frame = frameRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();

    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;

    if (!initializedRef.current) {
      // Primo movimento: inizializza e non applica spostamento
      lastPosRef.current = { x: currentX, y: currentY };
      initializedRef.current = true;
      return;
    }

    let dx = 0;
    let dy = 0;

    if (lastPosRef.current) {
      dx = currentX - lastPosRef.current.x;
      dy = currentY - lastPosRef.current.y;
    }

    lastPosRef.current = { x: currentX, y: currentY };

    // Converti spostamento in percentuale rispetto al frame
    // Invertiamo il segno: trascini a destra -> x diminuisce (immagine va a sinistra)
    const stepX = -(dx / rect.width) * 100;
    const stepY = -(dy / rect.height) * 100;

    let nextX = x + stepX;
    let nextY = y + stepY;

    nextX = Math.max(0, Math.min(100, nextX));
    nextY = Math.max(0, Math.min(100, nextY));

    onChange(nextX, nextY);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    lastPosRef.current = { x: event.clientX, y: event.clientY };
    initializedRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

    updatePosition(event);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    draggingRef.current = false;
    lastPosRef.current = null;
    initializedRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <div className="mt-5">
      <p className="mb-2 text-sm font-bold text-white/80">{label}</p>

      <div
        ref={frameRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative mx-auto flex items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white/15 shadow-[0_2px_8px_rgba(0,0,0,0.16)] touch-none select-none"
        style={{ width: size, height: size }}
      >
        <img
  src={src}
  alt="Anteprima ritaglio"
  draggable={false}
  className="absolute left-1/2 top-1/2 h-auto w-auto"
  style={{
    width: `${size * (iconSize / 36)}px`,
    height: `${size * (iconSize / 36)}px`,
    transform: "translate(-50%, -50%)",
    objectFit: "cover",
    objectPosition: `${x}% ${y}%`,
  }}
/>
      </div>

      <p className="mt-2 text-center text-xs text-white/45">
        Trascina l'immagine per scegliere la porzione visibile.
      </p>
    </div>
  );
}