import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { buildSteps, type Step, type Workout } from '../data/workouts';
import { exById, MUSCLE_LABELS } from '../data/exercises';
import { formatClock } from '../lib/storage';
import {
  IconBolt,
  IconCheck,
  IconClose,
  IconMute,
  IconPause,
  IconPlay,
  IconPrev,
  IconSkip,
  IconSound,
  PoseIcon,
} from './Icons';

type PhaseColor = { text: string; ring: string; glow: string };
const PHASE_STYLE: Record<string, PhaseColor> = {
  ready: { text: 'text-chalk', ring: '#f0ede4', glow: 'rgba(240,237,228,0.06)' },
  work: { text: 'text-flare', ring: '#ff5a26', glow: 'rgba(255,90,38,0.10)' },
  rest: { text: 'text-lime', ring: '#c9f16c', glow: 'rgba(201,241,108,0.08)' },
  finish: { text: 'text-lime', ring: '#c9f16c', glow: 'rgba(201,241,108,0.10)' },
};

export default function WorkoutPlayer({
  workout,
  rounds,
  rest,
  onClose,
  onFinish,
  onGoProgress,
}: {
  workout: Workout;
  rounds: number;
  rest: number;
  onClose: () => void;
  onFinish: (minutes: number) => void;
  onGoProgress: () => void;
}) {
  const steps = useMemo(() => buildSteps(workout, rounds, rest), [workout, rounds, rest]);
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(steps[0].kind === 'ready' ? steps[0].sec : 0);
  const [elapsedInStep, setElapsedInStep] = useState(0);
  const [sessionSec, setSessionSec] = useState(0);
  const [running, setRunning] = useState(false);
  const [muted, setMuted] = useState(() => localStorage.getItem('bez-zheleza:muted') === '1');
  const [confirmExit, setConfirmExit] = useState(false);

  const sessionSecRef = useRef(0);
  const finishedRef = useRef(false);
  const audioRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const step = steps[idx];
  const phase: string = step.kind === 'work' ? 'work' : step.kind;
  const style = PHASE_STYLE[phase] ?? PHASE_STYLE.work;

  /* ---------- звук ---------- */
  const beep = useCallback((freq: number, dur = 0.12) => {
    if (mutedRef.current) return;
    try {
      const ctx = audioRef.current ?? new AudioContext();
      audioRef.current = ctx;
      if (ctx.state === 'suspended') void ctx.resume();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + dur + 0.05);
    } catch {
      /* без звука тоже тренируются */
    }
  }, []);

  const toggleMute = () => {
    setMuted((m) => {
      localStorage.setItem('bez-zheleza:muted', m ? '0' : '1');
      return !m;
    });
  };

  /* ---------- сброс при смене шага ---------- */
  useEffect(() => {
    const s = steps[idx];
    setElapsedInStep(0);
    setTimeLeft(s.kind === 'ready' ? s.sec : s.kind === 'rest' ? s.sec : s.kind === 'work' ? s.sec ?? 0 : 0);
    if (s.kind === 'finish') {
      setRunning(false);
      beep(1180, 0.35);
    } else if (idx > 0) {
      beep(s.kind === 'rest' ? 540 : 920, 0.16);
    }
  }, [idx, steps, beep]);

  /* ---------- тик ---------- */
  useEffect(() => {
    if (!running) return;
    const s = steps[idx];
    if (s.kind === 'finish') return;
    const timed = s.kind === 'ready' || s.kind === 'rest' || (s.kind === 'work' && s.sec !== undefined);
    const iv = setInterval(() => {
      setSessionSec((v) => {
        sessionSecRef.current = v + 1;
        return v + 1;
      });
      if (timed) setTimeLeft((t) => Math.max(0, t - 1));
      else setElapsedInStep((e) => e + 1);
    }, 1000);
    return () => clearInterval(iv);
  }, [running, idx, steps]);

  /* ---------- автопереход и отсчёт вслух ---------- */
  useEffect(() => {
    if (!running) return;
    const s = steps[idx];
    const timed = s.kind === 'ready' || s.kind === 'rest' || (s.kind === 'work' && s.sec !== undefined);
    if (!timed) return;
    if (timeLeft === 0) {
      setIdx((i) => Math.min(i + 1, steps.length - 1));
    } else if (timeLeft <= 3) {
      beep(740, 0.07);
    }
  }, [timeLeft, running, idx, steps, beep]);

  const advance = useCallback(() => setIdx((i) => Math.min(i + 1, steps.length - 1)), [steps.length]);
  const back = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);

  /* ---------- завершение ---------- */
  useEffect(() => {
    if (step.kind === 'finish' && !finishedRef.current) {
      finishedRef.current = true;
      onFinish(Math.max(1, Math.round(sessionSecRef.current / 60)));
      confetti({
        particleCount: 140,
        spread: 78,
        origin: { y: 0.62 },
        colors: ['#ff5a26', '#c9f16c', '#f0ede4'],
      });
    }
  }, [step.kind, onFinish]);

  /* ---------- клавиатура ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (steps[idx].kind !== 'finish') setRunning((r) => !r);
      } else if (e.code === 'ArrowRight') {
        advance();
      } else if (e.code === 'ArrowLeft') {
        back();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, back, idx, steps]);

  /* ---------- вычисляемое ---------- */
  const timed = step.kind === 'ready' || step.kind === 'rest' || (step.kind === 'work' && step.sec !== undefined);
  const stepTotal = timed
    ? step.kind === 'ready'
      ? step.sec
      : step.kind === 'rest'
        ? step.sec
        : step.sec ?? 1
    : 1;
  const progress = timed ? timeLeft / stepTotal : 0;

  const nextStep: Step | null = idx + 1 < steps.length ? steps[idx + 1] : null;
  const nextLabel = nextStep
    ? nextStep.kind === 'rest'
      ? `Отдых ${nextStep.sec} с`
      : nextStep.kind === 'work'
        ? `${exById(nextStep.exId).name} · ${nextStep.sec ? formatClock(nextStep.sec) : `×${nextStep.reps}`}`
        : 'Финиш'
    : null;

  const doneSteps = steps.filter((s) => s.kind === 'work').length;

  return (
    <div className="slide-up-screen fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink">
      {/* фоновое свечение фазы */}
      <div
        className="pointer-events-none fixed inset-0 transition-all duration-700"
        style={{ background: `radial-gradient(820px 560px at 50% 34%, ${style.glow}, transparent 70%)` }}
        aria-hidden="true"
      />

      {/* ======== экран завершения ======== */}
      {step.kind === 'finish' ? (
        <FinishScreen
          workout={workout}
          rounds={rounds}
          sessionSec={sessionSec}
          workSteps={doneSteps}
          onGoProgress={onGoProgress}
          onClose={onClose}
        />
      ) : (
        <>
          {/* верхняя панель */}
          <header className="relative z-10 flex items-center justify-between gap-4 border-b border-line/70 px-5 py-4 lg:px-8">
            <div className="min-w-0">
              <div className="truncate font-display text-sm font-bold uppercase tracking-wider text-chalk">
                {workout.title}
              </div>
              <div className="mt-0.5 text-xs font-semibold uppercase tracking-[0.2em] text-dim">
                {step.kind === 'work'
                  ? `Круг ${step.round} / ${rounds}`
                  : step.kind === 'ready'
                    ? 'Приготовься'
                    : 'Восстановление'}
              </div>
            </div>
            <div className="num-display hidden text-lg font-bold text-muted sm:block">
              {formatClock(sessionSec)}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="flex h-10 w-10 items-center justify-center border border-line text-muted transition-colors hover:border-flare hover:text-flare"
                aria-label={muted ? 'Включить звук' : 'Выключить звук'}
              >
                {muted ? <IconMute className="h-5 w-5" /> : <IconSound className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setConfirmExit(true)}
                className="flex h-10 w-10 items-center justify-center border border-line text-muted transition-colors hover:border-flare hover:text-flare"
                aria-label="Прервать тренировку"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* дорожка шагов */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-[5px] px-5 py-3">
            {steps.map((s, i) => (
              <span
                key={i}
                className={`h-[7px] transition-all duration-300 ${
                  s.kind === 'finish' ? 'w-[7px] rotate-45' : i === idx ? 'w-6' : 'w-[14px]'
                } ${
                  i < idx
                    ? 'bg-chalk/50'
                    : i === idx
                      ? s.kind === 'rest'
                        ? 'bg-lime'
                        : 'bg-flare'
                      : s.kind === 'finish'
                        ? 'bg-line'
                        : 'bg-line'
                }`}
              />
            ))}
          </div>

          {/* ======== сцена ======== */}
          <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-8 text-center">
            <div key={idx} className="pop-in flex w-full max-w-xl flex-col items-center">
              {step.kind === 'ready' && (
                <>
                  <span className="font-display text-xs font-medium uppercase tracking-[0.4em] text-muted">
                    Приготовься
                  </span>
                  <TimeRing value={timeLeft} total={stepTotal} color={style.ring} label={formatClock(timeLeft)} />
                  <p className="mt-6 text-sm text-muted">
                    Первое упражнение —{' '}
                    <span className="font-bold text-chalk">
                      {nextStep?.kind === 'work' ? exById(nextStep.exId).name : '—'}
                    </span>
                  </p>
                </>
              )}

              {step.kind === 'rest' && (
                <>
                  <span className="font-display text-xs font-medium uppercase tracking-[0.4em] text-lime">
                    Отдых
                  </span>
                  <TimeRing value={timeLeft} total={stepTotal} color={style.ring} label={formatClock(timeLeft)} />
                  <div className="mt-6 flex items-center gap-3 border border-line bg-coal px-4 py-3">
                    <PoseIcon name={exById(step.next).icon} className="h-7 w-7 text-lime" />
                    <div className="text-left">
                      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-dim">Дальше</div>
                      <div className="font-display text-sm font-bold uppercase text-chalk">
                        {exById(step.next).name}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step.kind === 'work' && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center border border-line bg-steel text-flare">
                      <PoseIcon name={exById(step.exId).icon} className="h-7 w-7" />
                    </span>
                    <div className="text-left">
                      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-dim">
                        {step.index + 1} / {workout.items.length} ·{' '}
                        {exById(step.exId).muscles.map((m) => MUSCLE_LABELS[m]).join(' + ')}
                      </div>
                      <div className="font-display text-xl font-bold uppercase text-chalk sm:text-2xl">
                        {exById(step.exId).name}
                      </div>
                    </div>
                  </div>

                  {step.sec !== undefined ? (
                    <TimeRing value={timeLeft} total={stepTotal} color={style.ring} label={formatClock(timeLeft)} />
                  ) : (
                    <div className="mt-6 flex flex-col items-center">
                      <div className="num-display text-[92px] font-black leading-none text-chalk sm:text-[120px]">
                        ×{step.reps}
                      </div>
                      <div className="mt-1 text-xs font-bold uppercase tracking-[0.3em] text-dim">
                        повторений · в своём темпе
                      </div>
                      <div className="num-display mt-5 text-xl font-bold text-flare-soft">
                        {formatClock(elapsedInStep)}
                      </div>
                      {step.note && (
                        <div className="mt-4 border border-flare/40 bg-flare/10 px-4 py-2 text-sm font-semibold text-flare-soft">
                          {step.note}
                        </div>
                      )}
                      <button
                        onClick={advance}
                        className="notch-sm mt-7 inline-flex items-center gap-3 bg-lime px-10 py-4 font-display text-base font-bold uppercase tracking-wider text-ink transition-all hover:bg-[#d8f98b] active:translate-y-[2px]"
                      >
                        <IconCheck className="h-5 w-5" />
                        Сделано
                      </button>
                    </div>
                  )}

                  {step.sec !== undefined && step.note && (
                    <div className="mt-5 border border-flare/40 bg-flare/10 px-4 py-2 text-sm font-semibold text-flare-soft">
                      {step.note}
                    </div>
                  )}
                  {step.sec !== undefined && (
                    <p className="mt-4 max-w-sm text-xs leading-relaxed text-dim">
                      {exById(step.exId).short}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* следующее */}
            {nextLabel && step.kind !== 'rest' && (
              <div className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-dim">
                Дальше: <span className="text-muted">{nextLabel}</span>
              </div>
            )}
          </main>

          {/* ======== управление ======== */}
          <footer className="relative z-10 border-t border-line/70 px-5 py-5">
            <div className="mx-auto flex max-w-md items-center justify-center gap-4">
              <button
                onClick={back}
                disabled={idx === 0}
                className="flex h-12 w-12 items-center justify-center border border-line text-muted transition-colors hover:border-chalk hover:text-chalk disabled:opacity-25"
                aria-label="Назад"
              >
                <IconPrev className="h-5 w-5" />
              </button>
              <button
                onClick={() => setRunning((r) => !r)}
                className={`notch-sm flex h-16 w-28 items-center justify-center gap-2.5 font-display text-sm font-bold uppercase tracking-wider transition-all active:translate-y-[2px] ${
                  running ? 'bg-steel text-chalk hover:bg-line' : 'bg-flare text-ink hover:bg-flare-soft'
                }`}
              >
                {running ? <IconPause className="h-6 w-6" /> : <IconPlay className="h-6 w-6" />}
                {running ? 'Пауза' : 'Пуск'}
              </button>
              <button
                onClick={advance}
                className="flex h-12 w-12 items-center justify-center border border-line text-muted transition-colors hover:border-flare hover:text-flare"
                aria-label="Пропустить"
              >
                <IconSkip className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-dim/70">
              Пробел — пауза · стрелки — назад / вперёд
            </p>
          </footer>
        </>
      )}

      {/* подтверждение выхода */}
      {confirmExit && step.kind !== 'finish' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/85 p-5">
          <div className="notch w-full max-w-sm border border-line bg-plate p-7 rise-in">
            <div className="font-display text-xl font-bold uppercase text-chalk">Прервать тренировку?</div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Сессия не попадёт в прогресс. Железо подождёт, но серия дней — нет.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmExit(false)}
                className="flex-1 bg-flare px-4 py-3 font-display text-sm font-bold uppercase text-ink transition-colors hover:bg-flare-soft"
              >
                Остаться
              </button>
              <button
                onClick={onClose}
                className="flex-1 border border-line px-4 py-3 font-display text-sm font-bold uppercase text-muted transition-colors hover:border-flare hover:text-flare"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- кольцо таймера ---------- */
function TimeRing({
  value,
  total,
  color,
  label,
}: {
  value: number;
  total: number;
  color: string;
  label: string;
}) {
  const R = 118;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - value / total);
  return (
    <div className="relative mt-6 h-[290px] w-[290px]">
      <svg viewBox="0 0 280 280" className="h-full w-full -rotate-90">
        <circle cx="140" cy="140" r={R} fill="none" stroke="#2e3442" strokeWidth="7" />
        <circle
          cx="140"
          cy="140"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          className="ring-progress"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="num-display text-7xl font-black leading-none" style={{ color }}>
          {label}
        </span>
        <span className="tick-blink mt-2 h-1.5 w-10" style={{ background: color }} />
      </div>
    </div>
  );
}

/* ---------- финальный экран ---------- */
function FinishScreen({
  workout,
  rounds,
  sessionSec,
  workSteps,
  onGoProgress,
  onClose,
}: {
  workout: Workout;
  rounds: number;
  sessionSec: number;
  workSteps: number;
  onGoProgress: () => void;
  onClose: () => void;
}) {
  const kcal = Math.max(1, Math.round((sessionSec / 60) * (5 + workout.level)));
  return (
    <div className="relative z-10 flex min-h-full flex-col items-center justify-center px-5 py-12 text-center">
      <div className="pop-in flex h-20 w-20 items-center justify-center bg-lime">
        <IconCheck className="h-10 w-10 text-ink" />
      </div>
      <h2 className="mt-7 font-display text-5xl font-black uppercase tracking-tight text-chalk sm:text-6xl">
        Готово<span className="text-flare">.</span>
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        «{workout.title}» — {rounds} {rounds === 1 ? 'круг' : rounds < 5 ? 'круга' : 'кругов'} и {workSteps}{' '}
        подходов закрыты. Тело сказало спасибо, даже если сейчас спорит.
      </p>

      <div className="mt-9 grid w-full max-w-lg grid-cols-3 gap-px border border-line bg-line">
        {[
          { label: 'Время', value: formatClock(sessionSec) },
          { label: 'Ккал ≈', value: String(kcal) },
          { label: 'Подходов', value: String(workSteps) },
        ].map((s) => (
          <div key={s.label} className="bg-coal px-3 py-5">
            <div className="num-display text-3xl font-bold text-chalk">{s.value}</div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-dim">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <button
          onClick={onGoProgress}
          className="notch-sm inline-flex items-center gap-2.5 bg-flare px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-ink transition-colors hover:bg-flare-soft"
        >
          <IconBolt className="h-4 w-4" />
          Мой прогресс
        </button>
        <button
          onClick={onClose}
          className="notch-sm border border-line px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-chalk transition-colors hover:border-flare hover:text-flare"
        >
          На главную
        </button>
      </div>
    </div>
  );
}
