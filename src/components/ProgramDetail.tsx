import { useMemo, useState } from 'react';
import { estimateMinutes, type Workout } from '../data/workouts';
import { exById, LEVEL_LABELS, MUSCLE_LABELS } from '../data/exercises';
import { formatClock } from '../lib/storage';
import { LevelPips, NotchButton } from './bits';
import { IconArrowLeft, IconBolt, IconClock, IconTimer, PoseIcon } from './Icons';

const REST_OPTIONS = [15, 30, 45, 60, 90];

export default function ProgramDetail({
  workout,
  onBack,
  onStart,
}: {
  workout: Workout;
  onBack: () => void;
  onStart: (rounds: number, rest: number) => void;
}) {
  const [rounds, setRounds] = useState(workout.rounds);
  const [rest, setRest] = useState(workout.rest);
  const minutes = useMemo(() => estimateMinutes(workout, rounds, rest), [workout, rounds, rest]);

  return (
    <div className="slide-up-screen mx-auto max-w-5xl px-5 py-10 lg:px-8">
      <button
        onClick={onBack}
        className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-dim transition-colors hover:text-flare"
      >
        <IconArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Все программы
      </button>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* левая колонка — план */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-flare px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.22em] text-ink">
              {workout.tag}
            </span>
            <span className="flex items-center gap-2 border border-line px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-muted">
              <LevelPips level={workout.level} />
              {LEVEL_LABELS[workout.level]}
            </span>
            <span className="border border-line px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-muted">
              {workout.focus.map((f) => MUSCLE_LABELS[f]).join(' + ')}
            </span>
          </div>

          <h1 className="mt-5 font-display text-4xl font-black uppercase leading-[1.02] tracking-tight text-chalk sm:text-5xl">
            {workout.title}
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">{workout.description}</p>

          <ol className="mt-9">
            {workout.items.map((it, i) => {
              const ex = exById(it.exId);
              return (
                <li
                  key={`${it.exId}-${i}`}
                  className="group flex items-center gap-4 border-b border-line/80 py-4 transition-colors first:border-t hover:bg-coal/60 sm:gap-6 sm:px-3"
                >
                  <span className="num-display w-8 shrink-0 text-2xl font-bold text-ghost transition-colors group-hover:text-flare">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-line bg-steel text-lime transition-colors group-hover:border-flare/50 group-hover:text-flare">
                    <PoseIcon name={ex.icon} className="h-7 w-7" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-[15px] font-bold uppercase text-chalk">{ex.name}</div>
                    <div className="mt-0.5 truncate text-xs text-dim">
                      {ex.muscles.map((m) => MUSCLE_LABELS[m]).join(' · ')}
                      {it.note ? <span className="text-flare-soft"> — {it.note}</span> : null}
                    </div>
                  </div>
                  <span
                    className={`num-display shrink-0 px-3 py-1.5 text-lg font-bold ${
                      it.sec ? 'bg-steel text-lime' : 'bg-steel text-chalk'
                    }`}
                  >
                    {it.sec ? formatClock(it.sec) : `×${it.reps}`}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* правая колонка — настройки */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="notch border border-line bg-plate p-6">
            <p className="font-display text-xs font-medium uppercase tracking-[0.3em] text-flare">
              Настрой под себя
            </p>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wider text-chalk">Круги</span>
                <span className="num-display text-xl font-bold text-lime">{rounds}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRounds((r) => Math.max(1, r - 1))}
                  disabled={rounds <= 1}
                  className="h-11 flex-1 border border-line bg-coal font-display text-xl font-bold text-chalk transition-colors hover:border-flare hover:text-flare disabled:opacity-30 disabled:hover:border-line disabled:hover:text-chalk"
                  aria-label="Меньше кругов"
                >
                  −
                </button>
                <div className="flex h-11 flex-1 items-center justify-center gap-1.5 border border-line bg-steel">
                  {Array.from({ length: rounds }).map((_, i) => (
                    <span key={i} className="h-2 w-2 rotate-45 bg-flare" />
                  ))}
                </div>
                <button
                  onClick={() => setRounds((r) => Math.min(workout.rounds + 2, r + 1))}
                  disabled={rounds >= workout.rounds + 2}
                  className="h-11 flex-1 border border-line bg-coal font-display text-xl font-bold text-chalk transition-colors hover:border-flare hover:text-flare disabled:opacity-30 disabled:hover:border-line disabled:hover:text-chalk"
                  aria-label="Больше кругов"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 text-sm font-bold uppercase tracking-wider text-chalk">
                Отдых между подходами
              </div>
              <div className="flex flex-wrap gap-2">
                {REST_OPTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRest(r)}
                    className={`px-3.5 py-2 text-sm font-bold transition-all ${
                      rest === r
                        ? 'bg-flare text-ink'
                        : 'border border-line bg-coal text-muted hover:border-flare/60 hover:text-chalk'
                    }`}
                  >
                    {r} c
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-px border border-line bg-line">
              <div className="bg-coal px-4 py-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-dim">
                  <IconTimer className="h-3.5 w-3.5 text-flare" /> Время
                </div>
                <div className="num-display mt-1 text-2xl font-bold text-chalk">≈ {minutes} мин</div>
              </div>
              <div className="bg-coal px-4 py-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-dim">
                  <IconClock className="h-3.5 w-3.5 text-flare" /> Подходов
                </div>
                <div className="num-display mt-1 text-2xl font-bold text-chalk">
                  {rounds * workout.items.length}
                </div>
              </div>
            </div>

            <NotchButton
              onClick={() => onStart(rounds, rest)}
              className="mt-6 w-full justify-center text-base"
            >
              <IconBolt className="h-5 w-5" />
              Начать тренировку
            </NotchButton>
            <p className="mt-3 text-center text-xs leading-relaxed text-dim">
              Таймер возьмёт на себя время — тебе останутся только повторения.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
