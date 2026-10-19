import type { MuscleId } from './exercises';

export interface WorkoutItem {
  exId: string;
  reps?: number;
  sec?: number;
  note?: string;
}

export interface Workout {
  id: string;
  title: string;
  tag: string;
  level: 1 | 2 | 3;
  rounds: number;
  rest: number;
  focus: MuscleId[];
  description: string;
  items: WorkoutItem[];
  featured?: boolean;
}

export const WORKOUTS: Workout[] = [
  {
    id: 'fullbody-start',
    title: 'Фулбоди: старт',
    tag: 'База',
    level: 1,
    rounds: 3,
    rest: 45,
    focus: ['legs', 'chest', 'core'],
    description:
      'Втягивающий круг на всё тело. Освой технику, поймай ритм дыхания — железо не понадобится.',
    items: [
      { exId: 'squats', reps: 15 },
      { exId: 'knee-pushups', reps: 10, note: 'или классические, если легко' },
      { exId: 'lunges', reps: 10, note: 'на каждую ногу' },
      { exId: 'glute-bridge', reps: 15 },
      { exId: 'plank', sec: 30 },
      { exId: 'superman', reps: 12 },
    ],
  },
  {
    id: 'upper-power',
    title: 'Верх: сила',
    tag: 'Сила',
    level: 2,
    rounds: 4,
    rest: 45,
    focus: ['chest', 'arms', 'shoulders'],
    description:
      'Жимовая работа на грудь, плечи и трицепс. Четыре круга честного объёма без единой гантели.',
    items: [
      { exId: 'pushups', reps: 12 },
      { exId: 'pike-pushups', reps: 8 },
      { exId: 'narrow-pushups', reps: 10 },
      { exId: 'dips-chair', reps: 12, note: 'от стула или края дивана' },
      { exId: 'plank', sec: 40 },
    ],
  },
  {
    id: 'legs-day',
    title: 'Ноги и ягодицы',
    tag: 'Сила',
    level: 2,
    rounds: 4,
    rest: 40,
    focus: ['legs', 'glutes'],
    description:
      'Присед, выпады, изометрия у стены и взрыв в конце. Ноги будут помнить до послезавтра.',
    items: [
      { exId: 'squats', reps: 20 },
      { exId: 'side-lunges', reps: 12, note: 'по 6 на ногу' },
      { exId: 'wall-sit', sec: 40 },
      { exId: 'single-bridge', reps: 10, note: 'по 5 на ногу' },
      { exId: 'calf-raise', reps: 20 },
      { exId: 'jump-squats', reps: 10 },
    ],
  },
  {
    id: 'core-press',
    title: 'Кор и пресс',
    tag: 'Кор',
    level: 2,
    rounds: 3,
    rest: 30,
    focus: ['core'],
    description:
      'Пресс, косые и глубокая стабилизация. Короткие паузы — живот горит уже со второго круга.',
    items: [
      { exId: 'crunch', reps: 20 },
      { exId: 'leg-raise', reps: 12 },
      { exId: 'bicycle', reps: 20 },
      { exId: 'climber', sec: 30 },
      { exId: 'side-plank', sec: 30, note: 'по 15 с на сторону' },
      { exId: 'hollow', sec: 25 },
    ],
  },
  {
    id: 'hiit-blast',
    title: 'Взрывное кардио',
    tag: 'HIIT',
    level: 3,
    rounds: 3,
    rest: 20,
    focus: ['cardio', 'legs'],
    description:
      '40 секунд работы, 20 — передышки. Пульс до потолка, калории — следом. Разминка обязательна.',
    items: [
      { exId: 'burpee', sec: 40 },
      { exId: 'jack', sec: 40 },
      { exId: 'knees', sec: 40 },
      { exId: 'skater', sec: 40 },
      { exId: 'jump-squats', sec: 40 },
    ],
    featured: true,
  },
  {
    id: 'morning-flow',
    title: 'Утренний поток',
    tag: 'Мобильность',
    level: 1,
    rounds: 1,
    rest: 15,
    focus: ['stretch', 'back'],
    description:
      'Мягкий поток на 10 минут: позвоночник, бёдра, дыхание. Идеален сразу после сна.',
    items: [
      { exId: 'cat', sec: 40 },
      { exId: 'stretch', sec: 40 },
      { exId: 'pigeon', sec: 45, note: 'по 20 с на сторону' },
      { exId: 'glute-bridge', reps: 12 },
      { exId: 'superman', reps: 12 },
      { exId: 'child', sec: 45 },
    ],
  },
];

export const workoutById = (id: string): Workout =>
  WORKOUTS.find((w) => w.id === id) ?? WORKOUTS[0];

/** Оценка длительности в минутах (реповые упражнения считаем ~3 с/повтор). */
export function estimateMinutes(w: Workout, rounds: number, rest: number): number {
  const workSec = w.items.reduce((s, it) => s + (it.sec ?? (it.reps ?? 10) * 3), 0);
  const rests = rounds * w.items.length - 1;
  const total = rounds * workSec + Math.max(0, rests) * rest + 10;
  return Math.max(1, Math.round(total / 60));
}

/* ---------- движок сессии ---------- */

export type Step =
  | { kind: 'ready'; sec: number }
  | { kind: 'work'; exId: string; reps?: number; sec?: number; note?: string; round: number; index: number }
  | { kind: 'rest'; sec: number; next: string }
  | { kind: 'finish' };

export function buildSteps(w: Workout, rounds: number, rest: number): Step[] {
  const steps: Step[] = [{ kind: 'ready', sec: 10 }];
  for (let r = 1; r <= rounds; r++) {
    w.items.forEach((it, i) => {
      steps.push({ kind: 'work', exId: it.exId, reps: it.reps, sec: it.sec, note: it.note, round: r, index: i });
      const isLast = r === rounds && i === w.items.length - 1;
      if (!isLast) {
        const nextItem = i < w.items.length - 1 ? w.items[i + 1] : w.items[0];
        steps.push({ kind: 'rest', sec: i === w.items.length - 1 ? rest + 15 : rest, next: nextItem.exId });
      }
    });
  }
  steps.push({ kind: 'finish' });
  return steps;
}

export function totalTimedSeconds(steps: Step[]): number {
  return steps.reduce((s, st) => {
    if (st.kind === 'ready') return s + st.sec;
    if (st.kind === 'work') return s + (st.sec ?? 0);
    if (st.kind === 'rest') return s + st.sec;
    return s;
  }, 0);
}
