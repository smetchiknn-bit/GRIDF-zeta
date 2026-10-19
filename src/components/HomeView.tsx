import { useMemo } from 'react';
import { WORKOUTS, estimateMinutes, type Workout } from '../data/workouts';
import { MUSCLE_LABELS } from '../data/exercises';
import { calcStreak, type SessionRecord } from '../lib/storage';
import { Reveal, Ticker, LevelPips, SectionHead, NotchButton } from './bits';
import { IconArrowRight, IconBolt, IconClock, IconFlame, IconTimer, PoseIcon } from './Icons';

function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000);
}

export default function HomeView({
  records,
  onOpenProgram,
  onQuickStart,
}: {
  records: SessionRecord[];
  onOpenProgram: (id: string) => void;
  onQuickStart: (w: Workout) => void;
}) {
  const todayWorkout = useMemo(() => WORKOUTS[dayOfYear() % WORKOUTS.length], []);
  const streak = calcStreak(records);
  const totalMinutes = records.reduce((s, r) => s + r.minutes, 0);
  const todayDate = useMemo(
    () =>
      new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }).format(
        new Date(),
      ),
    [],
  );

  return (
    <div>
      {/* ======== стартовая доска ======== */}
      <section className="relative overflow-hidden">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-flare/[0.06] blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-12 sm:pt-16 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14 lg:px-8">
          {/* левая колонка */}
          <div className="rise-in">
            <div className="mb-6 flex items-center gap-4">
              <span className="hazard inline-block h-[7px] w-16" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-muted">
                Android-приложение · 0 инвентаря
              </span>
            </div>

            <h1 className="font-display text-[13vw] font-black uppercase leading-[0.98] tracking-tight sm:text-6xl lg:text-[64px]">
              <span className="text-ghost">Железо</span>
              <br />
              <span className="text-chalk">не нужно.</span>
              <br />
              <span className="text-chalk">Работает</span>
              <br />
              <span className="text-ghost-flare">тело.</span>
            </h1>

            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
              Ни гантелей, ни гирь, ни абонемента. Шесть программ на собственном весе,
              таймер-наставник и прогресс, который копится в этом браузере. Пол, стена
              и десять минут — всё, что требуется.
            </p>

            {/* живая статистика */}
            <div className="mt-9 flex flex-wrap items-stretch gap-px overflow-hidden border border-line bg-line">
              {[
                { n: String(records.length), label: 'тренировок', icon: <IconBolt className="h-4 w-4" /> },
                { n: String(totalMinutes), label: 'минут в деле', icon: <IconClock className="h-4 w-4" /> },
                { n: String(streak), label: 'дней подряд', icon: <IconFlame className="h-4 w-4" /> },
              ].map((s, i) => (
                <div key={s.label} className={`flex-1 bg-coal px-5 py-4 ${i > 0 ? 'hidden sm:block' : ''}`}>
                  <div className="flex items-center gap-2 text-flare">{s.icon}</div>
                  <div className="num-display mt-1 text-3xl font-bold text-chalk">{s.n}</div>
                  <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-dim">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
              <NotchButton onClick={() => onQuickStart(todayWorkout)}>
                Начать сегодня
                <IconArrowRight className="h-4 w-4" />
              </NotchButton>
              <NotchButton
                variant="ghost"
                onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Все программы
              </NotchButton>
            </div>
          </div>

          {/* тренировка дня */}
          <Reveal delay={140} className="lg:pt-2">
            <div className="notch relative flex min-h-[440px] flex-col overflow-hidden border border-line bg-plate lg:min-h-full">
              <div className="absolute inset-0 dots-bg opacity-40" aria-hidden="true" />
              <div
                className="absolute inset-0 bg-gradient-to-t from-coal via-coal/40 to-coal/10"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(26,29,36,0.97) 8%, rgba(26,29,36,0.55) 46%, rgba(26,29,36,0.25) 100%)`,
                }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 mix-blend-multiply"
                style={{ background: 'linear-gradient(to top, #1a1d24 6%, rgba(26,29,36,.25) 55%, rgba(255,90,38,.12))' }}
                aria-hidden="true"
              />

              <div className="relative mt-6 flex items-center justify-between px-6">
                <span className="inline-flex items-center gap-2 bg-ink/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-chalk">
                  <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-lime" />
                  Тренировка дня
                </span>
                <span className="text-xs font-semibold capitalize text-chalk/70">{todayDate}</span>
              </div>

              <div className="relative mt-auto p-6 sm:p-7">
                <div className="mb-3 flex items-center gap-3">
                  <span className="hazard inline-block h-[5px] w-10" aria-hidden="true" />
                  <span className="font-display text-[11px] font-medium uppercase tracking-[0.28em] text-flare">
                    {todayWorkout.tag} · {todayWorkout.rounds}{' '}
                    {todayWorkout.rounds === 1 ? 'круг' : todayWorkout.rounds < 5 ? 'круга' : 'кругов'}
                  </span>
                </div>
                <h3 className="font-display text-3xl font-bold uppercase leading-tight text-chalk sm:text-4xl">
                  {todayWorkout.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
                  {todayWorkout.description}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-chalk/80">
                  <span className="inline-flex items-center gap-2">
                    <IconTimer className="h-4 w-4 text-flare" />
                    ≈ {estimateMinutes(todayWorkout, todayWorkout.rounds, todayWorkout.rest)} мин
                  </span>
                  <span>{todayWorkout.items.length} упражнений</span>
                  <LevelPips level={todayWorkout.level} />
                </div>
                <div className="mt-6 flex gap-3">
                  <NotchButton variant="lime" onClick={() => onQuickStart(todayWorkout)} className="flex-1 justify-center">
                    <IconBolt className="h-4 w-4" />
                    Старт
                  </NotchButton>
                  <NotchButton variant="ghost" onClick={() => onOpenProgram(todayWorkout.id)}>
                    Подробнее
                  </NotchButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Ticker />

      {/* ======== программы ======== */}
      <section id="programs" className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-16 lg:px-8">
        <Reveal>
          <SectionHead
            index="01 / Программы"
            title="Выбери свой круг"
            aside={
              <span className="text-sm font-semibold text-dim">
                {WORKOUTS.length} программ · от потока до HIIT
              </span>
            }
          />
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {WORKOUTS.map((w, i) => (
            <Reveal
              key={w.id}
              delay={i * 70}
              className={`h-full ${w.featured ? 'md:col-span-2 lg:col-span-2' : ''}`}
            >
              <ProgramCard w={w} onOpen={() => onOpenProgram(w.id)} />
            </Reveal>
          ))}
          {/* пустая ячейка-заглушка с призывом */}
          <Reveal delay={420}>
            <div className="notch-sm group flex h-full min-h-[210px] flex-col justify-between border border-dashed border-line p-6 transition-colors hover:border-flare/60">
              <span className="text-5xl font-display font-black text-ghost">+1</span>
              <div>
                <p className="font-display text-lg font-bold uppercase text-chalk">
                  Седьмая программа — твоя
                </p>
                <p className="mt-2 text-sm leading-relaxed text-dim">
                  Собирай круги из библиотеки упражнений: 29 движений, любые сочетания.
                  Начни с готовой программы, а аппетит придёт во время еды.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ======== как это работает ======== */}
      <section className="relative border-t border-line/70 bg-coal/60">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <Reveal>
            <SectionHead index="02 / Механика" title="Таймер ведёт — ты работаешь" />
          </Reveal>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="relative">
              <div className="absolute left-[19px] top-4 hidden h-[calc(100%-30px)] w-px bg-line sm:block" aria-hidden="true" />
              {[
                {
                  n: '01',
                  t: 'Выбери программу',
                  d: 'Шесть готовых кругов: от мягкого утреннего потока до взрывного HIIT. Настрой число кругов и длину отдыха под себя.',
                },
                {
                  n: '02',
                  t: 'Следуй за таймером',
                  d: 'Экран ведёт по упражнениям: секунды капают, круги сменяются, сигнал подсказывает смену. Реповые движения — в своём темпе, жмёшь «Готово».',
                },
                {
                  n: '03',
                  t: 'Копи серию',
                  d: 'Каждая тренировка падает в прогресс: минуты, серия дней, график активности. Закрыл день — пламя горит.',
                },
              ].map((s, i) => (
                <Reveal key={s.n} delay={i * 120}>
                  <div className="relative flex gap-5 pb-9 last:pb-0">
                    <span className="relative z-10 mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center border border-line bg-ink font-display text-sm font-bold text-flare sm:flex">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold uppercase text-chalk">{s.t}</h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{s.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="notch relative h-full border border-line bg-plate p-7">
                <div className="dots-bg pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
                <p className="relative font-display text-xs font-medium uppercase tracking-[0.3em] text-flare">
                  Инвентарь для старта
                </p>
                <ul className="relative mt-6 space-y-4">
                  {[
                    { icon: 'squat', name: 'Пол', note: 'ровный кусок пола — уже тренажёрный зал' },
                    { icon: 'wall', name: 'Стена', note: 'для «стульчика» и вертикалей' },
                    { icon: 'dip', name: 'Стул', note: 'опционально: обратные отжимания' },
                    { icon: 'plank', name: 'Коврик', note: 'опционально: локтям мягче' },
                  ].map((it) => (
                    <li
                      key={it.name}
                      className="group flex items-center gap-4 border border-line bg-coal px-4 py-3 transition-all duration-200 hover:translate-x-1 hover:border-flare/50"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-steel text-lime transition-colors group-hover:text-flare">
                        <PoseIcon name={it.icon} className="h-6 w-6" />
                      </span>
                      <div>
                        <div className="font-display text-sm font-bold uppercase text-chalk">{it.name}</div>
                        <div className="text-xs text-dim">{it.note}</div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="relative mt-6 border-t border-line pt-5 text-sm leading-relaxed text-muted">
                  Всё. Никаких «куплю гантели — и начну». Начни сейчас, в чём есть.
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProgramCard({ w, onOpen }: { w: Workout; onOpen: () => void }) {
  const minutes = estimateMinutes(w, w.rounds, w.rest);
  return (
    <button
      onClick={onOpen}
      className={`notch-sm group relative flex h-full w-full flex-col border p-6 text-left transition-all duration-300 hover:-translate-y-1.5 ${
        w.featured
          ? 'border-flare/70 bg-[linear-gradient(135deg,#241c17,#1c1f26_55%)] hover:border-flare'
          : 'border-line bg-coal hover:border-flare/60'
      }`}
    >
      {w.featured && <span className="hazard absolute left-0 top-0 h-[6px] w-full" aria-hidden="true" />}
      <div className="flex items-start justify-between gap-3">
        <span
          className={`px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.22em] ${
            w.featured ? 'bg-flare text-ink' : 'bg-steel text-chalk/80'
          }`}
        >
          {w.tag}
        </span>
        <div className="flex items-center gap-3 pt-0.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-dim">
            <IconTimer className="h-3.5 w-3.5" />≈ {minutes} мин
          </span>
          <LevelPips level={w.level} />
        </div>
      </div>

      <h3
        className={`mt-5 font-display font-bold uppercase leading-tight text-chalk ${
          w.featured ? 'text-3xl sm:text-4xl' : 'text-xl'
        }`}
      >
        {w.title}
      </h3>
      <p className={`mt-3 leading-relaxed text-muted ${w.featured ? 'max-w-lg text-sm' : 'line-clamp-2 text-[13px]'}`}>
        {w.description}
      </p>

      <div className="mt-auto flex items-end justify-between gap-3 pt-6">
        <div className="flex flex-wrap gap-1.5">
          {w.focus.map((f) => (
            <span key={f} className="border border-line px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-dim">
              {MUSCLE_LABELS[f]}
            </span>
          ))}
          <span className="border border-line px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-dim">
            {w.items.length} упр. · {w.rounds} кр.
          </span>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-steel text-chalk transition-all duration-300 group-hover:border-flare group-hover:bg-flare group-hover:text-ink">
          <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
}
