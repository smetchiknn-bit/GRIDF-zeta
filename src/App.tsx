import { useCallback, useState } from 'react';
import { workoutById, type Workout } from './data/workouts';
import HomeView from './components/HomeView';
import ProgramDetail from './components/ProgramDetail';
import WorkoutPlayer from './components/WorkoutPlayer';
import ExercisesView from './components/ExercisesView';
import ProgressView from './components/ProgressView';
import { Logo, IconFlame, IconHome, IconChart, PoseIcon } from './components/Icons';
import InstallBanner from './components/InstallBanner';
import type { ReactElement } from 'react';
import {
  loadRecords,
  saveRecords,
  uid,
  calcStreak,
  type SessionRecord,
} from './lib/storage';

type Tab = 'train' | 'exercises' | 'progress';

const TABS: Array<{ id: Tab; label: string; short: string; icon: ReactElement }> = [
  { id: 'train', label: 'Тренировки', short: 'Главная', icon: <IconHome className="h-5 w-5" /> },
  { id: 'exercises', label: 'Упражнения', short: 'База', icon: <PoseIcon name="squat" className="h-6 w-6" /> },
  { id: 'progress', label: 'Прогресс', short: 'Прогресс', icon: <IconChart className="h-5 w-5" /> },
];



export default function App() {
  const [tab, setTab] = useState<Tab>('train');
  const [programId, setProgramId] = useState<string | null>(null);
  const [session, setSession] = useState<{ w: Workout; rounds: number; rest: number } | null>(null);
  const [records, setRecords] = useState<SessionRecord[]>(() => loadRecords());

  const streak = calcStreak(records);

  const switchTab = (t: Tab) => {
    setTab(t);
    setProgramId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProgram = useCallback((id: string) => {
    setTab('train');
    setProgramId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const startWorkout = useCallback((w: Workout, rounds = w.rounds, rest = w.rest) => {
    setSession({ w, rounds, rest });
  }, []);

  const handleFinish = useCallback(
    (minutes: number) => {
      if (!session) return;
      const rec: SessionRecord = {
        id: uid(),
        date: new Date().toISOString(),
        workoutId: session.w.id,
        title: session.w.title,
        minutes,
        rounds: session.rounds,
      };
      setRecords((prev) => {
        const next = [...prev, rec];
        saveRecords(next);
        return next;
      });
    },
    [session],
  );

  const clearRecords = () => {
    saveRecords([]);
    setRecords([]);
  };

  const selectedProgram = programId ? workoutById(programId) : null;

  return (
    <div className="min-h-screen">
      {/* ======== шапка ======== */}
      <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-5 py-3.5 lg:px-8">
          <button onClick={() => switchTab('train')} className="group flex items-center gap-3 text-left">
            <Logo className="h-8 w-8 text-chalk transition-transform duration-300 group-hover:-rotate-6" />
            <span>
              <span className="block font-display text-base font-black uppercase leading-none tracking-wide text-chalk">
                GRIT<span className="text-flare">.</span>
              </span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.28em] text-dim">
                android · без железа
              </span>
            </span>
          </button>

          <nav className="hidden flex-1 justify-center gap-1 md:flex">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.14em] transition-all duration-200 ${
                  tab === t.id
                    ? 'bg-flare text-ink'
                    : 'text-muted hover:bg-steel hover:text-chalk'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 border border-line bg-coal px-3.5 py-2">
            <IconFlame className={`h-4 w-4 ${streak > 0 ? 'text-flare' : 'text-dim'}`} />
            <span className="num-display text-base font-bold text-chalk">{streak}</span>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-dim sm:inline">
              серия
            </span>
          </div>
        </div>
      </header>

      {/* ======== контент ======== */}
      <main className="app-main">
        {tab === 'train' && !selectedProgram && (
          <HomeView
            records={records}
            onOpenProgram={openProgram}
            onQuickStart={(w) => startWorkout(w)}
          />
        )}
        {tab === 'train' && selectedProgram && (
          <ProgramDetail
            workout={selectedProgram}
            onBack={() => setProgramId(null)}
            onStart={(rounds, rest) => startWorkout(selectedProgram, rounds, rest)}
          />
        )}
        {tab === 'exercises' && <ExercisesView />}
        {tab === 'progress' && (
          <ProgressView records={records} onClear={clearRecords} onGoTrain={() => switchTab('train')} />
        )}
      </main>

      {/* ======== подвал ======== */}
      <footer className="mt-4 border-t border-line/80">
        <div className="hazard h-[6px] w-full opacity-80" aria-hidden="true" />
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo className="h-6 w-6 text-chalk/70" />
            <div>
              <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-muted">
                GRIT<span className="text-flare">.</span>
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.3em] text-dim">
                android edition · pwa
              </span>
            </div>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-dim">
            Тренировки с собственным весом: ни гантелей, ни гирь, ни тренажёров. Прогресс
            хранится локально на устройстве, приложение работает офлайн. Разминка — на тебе,
            суставы скажут спасибо.
          </p>
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-dim">
            Пол · Стена · Таймер
          </span>
        </div>
      </footer>

      {/* ======== нижняя Android-навигация ======== */}
      {!session && (
        <>
          <InstallBanner />
          <nav
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-coal/95 backdrop-blur-md md:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            aria-label="Основная навигация"
          >
            <div className="grid grid-cols-3">
              {TABS.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => switchTab(t.id)}
                    className={`flex flex-col items-center gap-1 pb-2 pt-2.5 transition-colors ${
                      active ? 'text-flare' : 'text-dim active:text-muted'
                    }`}
                  >
                    <span
                      className={`flex h-8 items-center justify-center rounded-full px-5 transition-all duration-300 ${
                        active ? 'bg-flare/15' : ''
                      }`}
                    >
                      {t.icon}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {active ? t.label : t.short}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </>
      )}

      {/* ======== плеер ======== */}
      {session && (
        <WorkoutPlayer
          workout={session.w}
          rounds={session.rounds}
          rest={session.rest}
          onClose={() => setSession(null)}
          onFinish={handleFinish}
          onGoProgress={() => {
            setSession(null);
            setTab('progress');
            setProgramId(null);
          }}
        />
      )}
    </div>
  );
}
