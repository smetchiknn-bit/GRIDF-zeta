import { useMemo, useState } from 'react';
import {
  calcStreak,
  dayKey,
  formatDateRu,
  type SessionRecord,
  weekdayShort,
} from '../lib/storage';
import { Reveal, SectionHead } from './bits';
import { IconArrowRight, IconBolt, IconClock, IconFlame, IconTrash, PoseIcon } from './Icons';
import { workoutById } from '../data/workouts';
import { exById } from '../data/exercises';

export default function ProgressView({
  records,
  onClear,
  onGoTrain,
}: {
  records: SessionRecord[];
  onClear: () => void;
  onGoTrain: () => void;
}) {
  const [confirmClear, setConfirmClear] = useState(false);
  const streak = calcStreak(records);
  const totalMinutes = records.reduce((s, r) => s + r.minutes, 0);

  const weekCount = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86_400_000;
    return records.filter((r) => new Date(r.date).getTime() >= weekAgo).length;
  }, [records]);

  /* график последних 14 дней */
  const chart = useMemo(() => {
    const days: Array<{ key: string; label: string; minutes: number; isToday: boolean }> = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dayKey(d);
      days.push({
        key,
        label: weekdayShort(d),
        minutes: records
          .filter((r) => dayKey(new Date(r.date)) === key)
          .reduce((s, r) => s + r.minutes, 0),
        isToday: i === 0,
      });
    }
    const max = Math.max(1, ...days.map((d) => d.minutes));
    return { days, max };
  }, [records]);

  const sorted = useMemo(
    () => [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [records],
  );

  if (records.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center lg:px-8">
        <div className="rise-in">
          <div className="num-display text-[120px] font-black leading-none text-ghost">00:00</div>
          <h2 className="mt-4 font-display text-3xl font-black uppercase text-chalk">
            Прогресс пока пуст
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
            Здесь появятся минуты, серия дней и график активности. Первая тренировка — самая
            важная: она превращает ноль в единицу.
          </p>
          <button
            onClick={onGoTrain}
            className="notch-sm mt-8 inline-flex items-center gap-2.5 bg-flare px-8 py-4 font-display text-sm font-bold uppercase tracking-wider text-ink transition-colors hover:bg-flare-soft"
          >
            <IconBolt className="h-4 w-4" />
            Провести первую
            <IconArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <Reveal>
        <SectionHead
          index="Журнал"
          title="Твой прогресс"
          aside={
            <div className="flex items-center gap-2 border border-line bg-coal px-4 py-2.5">
              <IconFlame className={`h-5 w-5 ${streak > 0 ? 'text-flare' : 'text-dim'}`} />
              <span className="num-display text-xl font-bold text-chalk">{streak}</span>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-dim">
                {streak === 1 ? 'день' : streak >= 2 && streak <= 4 ? 'дня' : 'дней'} подряд
              </span>
            </div>
          }
        />
      </Reveal>

      {/* сводные плитки */}
      <div className="grid gap-px border border-line bg-line sm:grid-cols-[1.4fr_1fr_1fr]">
        <Reveal className="bg-coal p-7">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-dim">
            <IconBolt className="h-4 w-4 text-flare" /> Всего тренировок
          </div>
          <div className="num-display mt-3 text-6xl font-black text-chalk">{records.length}</div>
          <div className="mt-2 text-sm font-semibold text-muted">
            {weekCount} за последнюю неделю
          </div>
        </Reveal>
        <Reveal delay={80} className="bg-coal p-7">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-dim">
            <IconClock className="h-4 w-4 text-lime" /> Минут под нагрузкой
          </div>
          <div className="num-display mt-3 text-6xl font-black text-lime">{totalMinutes}</div>
          <div className="mt-2 text-sm font-semibold text-muted">
            ≈ {(totalMinutes / 60).toFixed(1).replace('.', ',')} часа работы
          </div>
        </Reveal>
        <Reveal delay={160} className="bg-coal p-7">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-dim">
            <IconFlame className="h-4 w-4 text-flare" /> Средняя сессия
          </div>
          <div className="num-display mt-3 text-6xl font-black text-chalk">
            {Math.round(totalMinutes / records.length)}
          </div>
          <div className="mt-2 text-sm font-semibold text-muted">минут за подход к телу</div>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* график */}
        <Reveal>
          <div className="notch h-full border border-line bg-plate p-7">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-chalk">
                Активность · 14 дней
              </h3>
              <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-dim">
                <span className="h-2 w-2 bg-flare" /> сегодня
                <span className="ml-2 h-2 w-2 bg-lime" /> раньше
              </span>
            </div>
            <div className="mt-8 flex h-44 gap-[7px]">
              {chart.days.map((d) => {
                const h = d.minutes === 0 ? 4 : Math.max(10, (d.minutes / chart.max) * 100);
                return (
                  <div key={d.key} className="group relative flex h-full flex-1 flex-col items-center gap-2">
                    <div
                      className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap border border-line bg-ink px-2 py-1 text-[10px] font-bold text-chalk opacity-0 transition-opacity group-hover:opacity-100"
                      style={{ bottom: `calc(${h}% + 16px)` }}
                    >
                      {d.minutes > 0 ? `${d.minutes} мин` : 'отдых'}
                    </div>
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className={`w-full transition-all duration-500 ${
                          d.minutes === 0
                            ? 'bg-line'
                            : d.isToday
                              ? 'bg-flare'
                              : 'bg-lime group-hover:bg-[#d8f98b]'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        d.isToday ? 'text-flare' : 'text-dim'
                      }`}
                    >
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* история */}
        <Reveal delay={120}>
          <div className="notch flex h-full flex-col border border-line bg-plate">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-chalk">
                История
              </h3>
              <span className="text-xs font-bold text-dim">{sorted.length}</span>
            </div>
            <ul className="max-h-[420px] flex-1 overflow-y-auto">
              {sorted.map((r) => {
                const w = workoutById(r.workoutId);
                const firstEx = exById(w.items[0]?.exId ?? 'squats');
                return (
                  <li
                    key={r.id}
                    className="flex items-center gap-4 border-b border-line/70 px-6 py-3.5 transition-colors hover:bg-coal/70"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-steel text-lime">
                      <PoseIcon name={firstEx.icon} className="h-6 w-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-display text-[13px] font-bold uppercase text-chalk">
                        {r.title}
                      </div>
                      <div className="text-xs font-semibold text-dim">
                        {formatDateRu(r.date)} · {r.rounds}{' '}
                        {r.rounds === 1 ? 'круг' : r.rounds < 5 ? 'круга' : 'кругов'}
                      </div>
                    </div>
                    <span className="num-display text-sm font-bold text-lime">{r.minutes} мин</span>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-line p-4">
              {confirmClear ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onClear();
                      setConfirmClear(false);
                    }}
                    className="flex-1 bg-flare px-3 py-2.5 font-display text-[11px] font-bold uppercase tracking-wider text-ink"
                  >
                    Стереть всё
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="flex-1 border border-line px-3 py-2.5 font-display text-[11px] font-bold uppercase tracking-wider text-muted hover:text-chalk"
                  >
                    Отмена
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="flex w-full items-center justify-center gap-2 border border-line px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-dim transition-colors hover:border-flare hover:text-flare"
                >
                  <IconTrash className="h-3.5 w-3.5" />
                  Очистить историю
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {/* мотивационная вставка */}
      <Reveal delay={100}>
        <div className="relative mt-10 overflow-hidden border border-line bg-[linear-gradient(120deg,#241c17,#1c1f26_60%)] px-7 py-8">
          <div className="dots-bg pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
          <div className="relative flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="font-display text-2xl font-black uppercase text-chalk sm:text-3xl">
                Серия — хрупкая вещь<span className="text-flare">.</span>
              </div>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                Даже 10 минут потока засчитываются в серию. Лучше короткая тренировка, чем
                длинная отговорка.
              </p>
            </div>
            <button
              onClick={onGoTrain}
              className="notch-sm inline-flex items-center gap-2.5 bg-lime px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-ink transition-colors hover:bg-[#d8f98b]"
            >
              <IconBolt className="h-4 w-4" />
              Продлить серию
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
