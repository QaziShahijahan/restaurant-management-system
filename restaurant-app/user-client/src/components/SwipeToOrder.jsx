import React, { useRef, useState } from "react";

/**
 * Simple swipe-to-confirm control
 * Props:
 * - onConfirm(): callback when swipe succeeded
 * - label: text inside control
 */
export default function SwipeToOrder({ onConfirm, label = "Swipe to Order" }) {
  const trackRef = useRef();
  const knobRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState(0);

  const handlePointerDown = (e) => {
    setDragging(true);
    knobRef.current.setPointerCapture(e.pointerId);
    knobRef.current._startX = e.clientX;
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const track = trackRef.current;
    const knob = knobRef.current;
    const rect = track.getBoundingClientRect();
    const start = knob._startX || 0;
    let delta = e.clientX - start;
    // compute relative position between 0 and track width - knob width
    const max = rect.width - knob.offsetWidth - 4;
    delta = Math.max(0, Math.min(max, delta));
    knob.style.transform = `translateX(${delta}px)`;
    setPos(delta);
  };

  const handlePointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    const track = trackRef.current;
    const knob = knobRef.current;
    const rect = track.getBoundingClientRect();
    const max = rect.width - knob.offsetWidth - 4;
    // success threshold: 70%
    if (pos >= max * 0.7) {
      knob.style.transform = `translateX(${max}px)`;
      onConfirm();
      // reset after small delay
      setTimeout(() => {
        knob.style.transform = `translateX(0px)`;
        setPos(0);
      }, 600);
    } else {
      // reset
      knob.style.transform = `translateX(0px)`;
      setPos(0);
    }
  };

  return (
    <div className="swipe-track" ref={trackRef}>
      <div className="swipe-label">{label}</div>
      <div
        className="swipe-knob"
        ref={knobRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="button"
        tabIndex={0}
      >
        ➔
      </div>
    </div>
  );
}
