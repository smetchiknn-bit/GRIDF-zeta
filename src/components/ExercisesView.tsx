import { useMemo, useState } from 'react';
import {
  EXERCISES,
  LEVEL_LABELS,
  MUSCLE_LABELS,
  type Exercise,
  type MuscleId,
} from '../data/exercises';
import { LevelPips, Reveal, SectionHead } from './bits';
import { IconClose, IconSearch, PoseIcon } from './Icons';

const MUSCLE_FILTERS: Array<MuscleId | 'all'> = [
  'all',
  'chest',
  'back',
  'shoulders',
  'arms',
  'legs',
  'glutes',
  'core',
  'cardio',
  'stretch',
];

export default function ExercisesView() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<MuscleId | 'all'>('all');
  const [selected, setSelected] = useState<Exercise | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXERCISES.filter((e) => {
      const byMuscle = filter === 'all' || e.muscles.includes(filter);
      const byQuery =
        q === '' || e.name.toLowerCase().includes(q) || e.short.toLowerCase().includes(q);
      return byMuscle && byQuery;
    });
  }, [query, filter]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <Reveal>
        <SectionHead
          index="Библиотека"
          title="29 движений — и этого хватит"
          aside={
            <span className="text-sm font-semibold text-dim">
              Найдено: {list.length} / {EXERCISES.length}
            </span>
          }
        />
      </Reveal>

      {/* поиск + фильтры */}
      <Reveal delay={80}>
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center">
          <label className="relative block flex-1">
            <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти упражнение: планка, бёрпи, мост…"
              className="w-full border border-line bg-coal py-3 pl-11 pr-4 text-sm font-semibold text-chalk placeholder:font-medium placeholder:text-dim focus:border-flare focus:outline-none"
            />
          </label>
        </div>
        <div className="mb-10 flex flex-wrap gap-2">
          {MUSCLE_FILTERS.map((m) => (
            <button
              key={m}
              onClick={() => setFilter(m)}
              className={`px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-all ${
                filter === m
                  ? 'bg-flare text-ink'
                  : 'border border-line bg-coal text-muted hover:border-flare/60 hover:text-chalk'
              }`}
            >
              {m === 'all' ? 'Все' : MUSCLE_LABELS[m]}
            </button>
          ))}
        </div>
      </Reveal>

      {list.length === 0 ? (
        <div className="border border-dashed border-line py-24 text-center">
          <div className="text-6xl font-display font-black text-ghost">0</div>
          <p className="mt-4 text-sm font-semibold text-dim">
            Ничего не нашлось. Попробуй другое слово — или сбрось фильтр.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setFilter('all');
            }}
            className="mt-5 border border-line px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-chalk transition-colors hover:border-flare hover:text-flare"
          >
            Сбросить
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((ex, i) => (
            <Reveal key={ex.id} delay={(i % 6) * 60} className="h-full">
              <button
                onClick={() => setSelected(ex)}
                className="notch-sm group flex h-full w-full flex-col border border-line bg-coal p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-flare/60"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-14 w-14 items-center justify-center border border-line bg-steel text-lime transition-colors duration-300 group-hover:border-flare/50 group-hover:text-flare">
                    <PoseIcon name={ex.icon} className="h-9 w-9" />
                  </span>
                  <LevelPips level={ex.level} />
                </div>
                <h3 className="mt-4 font-display text-base font-bold uppercase leading-snug text-chalk">
                  {ex.name}
                </h3>
                <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-relaxed text-muted">{ex.short}</p>
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {ex.muscles.map((m) => (
                    <span
                      key={m}
                      className="border border-line px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-dim"
                    >
                      {MUSCLE_LABELS[m]}
                    </span>
                  ))}
                  <span className="ml-auto font-display text-[10px] font-bold uppercase tracking-[0.2em] text-flare opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Техника →
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      )}

      {/* модалка техники */}
      {selected && <ExerciseModal ex={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function ExerciseModal({ ex, onClose }: { ex: Exercise; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-ink/85 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="notch slide-up-screen relative w-full max-w-lg border border-line bg-plate p-7 sm:p-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-line text-muted transition-colors hover:border-flare hover:text-flare"
          aria-label="Закрыть"
        >
          <IconClose className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-4 pr-10">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center border border-line bg-steel text-flare">
            <PoseIcon name={ex.icon} className="h-10 w-10" />
          </span>
          <div>
            <h3 className="font-display text-xl font-bold uppercase leading-tight text-chalk">{ex.name}</h3>
            <div className="mt-1.5 flex items-center gap-3">
              <LevelPips level={ex.level} />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-dim">
                {LEVEL_LABELS[ex.level]}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted">{ex.short}</p>

        <div className="mt-6">
          <p className="font-display text-[11px] font-medium uppercase tracking-[0.3em] text-lime">
            Техника
          </p>
          <ol className="mt-3 space-y-2.5">
            {ex.cues.map((c, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-chalk/90">
                <span className="num-display mt-0.5 shrink-0 text-sm font-bold text-flare">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {c}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 border-l-2 border-flare bg-flare/10 px-4 py-3">
          <p className="font-display text-[11px] font-medium uppercase tracking-[0.3em] text-flare">
            Частая ошибка
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-chalk/85">{ex.mistake}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {ex.muscles.map((m) => (
            <span
              key={m}
              className="border border-line px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-dim"
            >
              {MUSCLE_LABELS[m]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
