"use client";

import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { runSceneTransition } from "./transitions";
import { useCoarsePointer, useReducedMotion } from "./use-reduced-motion";
import type { SceneTransition } from "./types";

type Layer<Id extends string> = { id: Id; key: number };

/**
 * The scene state machine for an experience. Scenes are rooms the visitor moves between,
 * not pages; while a transition runs, both rooms are mounted so the camera can move from one into the other.
 */
export function useSceneDirector<Id extends string>(initial: Id) {
  const counter = useRef(0);
  const [current, setCurrent] = useState<Layer<Id>>({ id: initial, key: 0 });
  const [leaving, setLeaving] = useState<Layer<Id> | null>(null);
  const [transition, setTransition] = useState<SceneTransition>({
    kind: "cut",
  });
  const [history, setHistory] = useState<Id[]>([]);

  const go = useCallback(
    (id: Id, how: SceneTransition = { kind: "fade" }) => {
      if (leaving || id === current.id) return;
      counter.current += 1;
      setLeaving(current);
      setTransition(how);
      setHistory((past) => (how.kind === "retreat" ? past.slice(0, -1) : [...past, current.id]));
      setCurrent({ id, key: counter.current });
    },
    [current, leaving],
  );

  const settle = useCallback(() => setLeaving(null), []);

  /** Step back out to the previous room (the camera pulls back rather than pushing forward). */
  const back = useCallback(
    (fallback: Id, origin?: { x: number; y: number }) => {
      const previous = history[history.length - 1] ?? fallback;
      go(previous, { kind: "retreat", origin });
    },
    [go, history],
  );

  return {
    current,
    leaving,
    transition,
    history,
    busy: leaving !== null,
    go,
    back,
    settle,
  };
}

export type SceneDirector<Id extends string> = ReturnType<typeof useSceneDirector<Id>>;

type SceneStackProps<Id extends string> = {
  director: SceneDirector<Id>;
  /** Accessible name of each scene, announced when it becomes active. */
  label: (id: Id) => string;
  render: (id: Id) => ReactNode;
  className?: string;
};

/**
 * Renders the active scene (and, during a move, the outgoing one) as stacked full-screen layers,
 * runs the camera transition between them, then moves focus to the new scene for keyboard and screen-reader users.
 */
export function SceneStack<Id extends string>({ director, label, render, className = "" }: SceneStackProps<Id>) {
  const layers = useRef(new Map<number, HTMLElement>());
  const reduced = useReducedMotion();
  const lowPower = useCoarsePointer();
  const { current, leaving, transition, settle } = director;

  useLayoutEffect(() => {
    if (!leaving) return;
    const incoming = layers.current.get(current.key);
    const outgoing = layers.current.get(leaving.key) ?? null;
    if (!incoming) return;
    let cancelled = false;
    runSceneTransition(outgoing, incoming, transition, {
      reduced,
      lowPower,
    }).then(() => {
      if (cancelled) return;
      settle();
      const target = incoming.querySelector<HTMLElement>("[data-scene-focus]") ?? incoming;
      target.focus({ preventScroll: true });
    });
    return () => {
      cancelled = true;
    };
  }, [current.key, leaving, transition, reduced, lowPower, settle]);

  const stack = leaving ? [leaving, current] : [current];

  return (
    <div className={`absolute inset-0 overflow-hidden bg-stage ${className}`}>
      {stack.map((layer) => (
        <section
          key={layer.key}
          ref={(element) => {
            if (element) layers.current.set(layer.key, element);
            else layers.current.delete(layer.key);
          }}
          aria-label={label(layer.id)}
          aria-hidden={layer.key !== current.key}
          inert={layer.key !== current.key}
          tabIndex={-1}
          data-scene={layer.id}
          className="absolute inset-0 overflow-hidden outline-none will-change-transform"
        >
          {render(layer.id)}
        </section>
      ))}
      <p aria-live="polite" className="sr-only">
        {label(current.id)}
      </p>
    </div>
  );
}
