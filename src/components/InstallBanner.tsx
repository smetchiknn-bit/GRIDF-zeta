import { useEffect, useState } from 'react';
import { IconClose, IconDownload, Logo } from './Icons';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

/**
 * Баннер установки GRIT как Android-приложение (PWA).
 * Ловит beforeinstallprompt у Chrome/Edge, на iOS показывает подсказку.
 */
export default function InstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [gone, setGone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setStandalone(true);
      return;
    }
    const ua = navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    setIsIOS(ios);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setStandalone(true);
      setDeferred(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (gone || standalone) return null;
  if (!deferred && !isIOS) return null;

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === 'accepted') setGone(true);
    setDeferred(null);
  };

  return (
    <div className="slide-up-screen fixed inset-x-3 bottom-[84px] z-40 md:hidden" style={{ bottom: 'calc(84px + env(safe-area-inset-bottom))' }}>
      <div className="notch-sm relative overflow-hidden border border-flare/60 bg-plate shadow-[0_18px_50px_-12px_rgba(0,0,0,0.8)]">
        <span className="hazard absolute left-0 top-0 h-full w-[6px]" aria-hidden="true" />
        <div className="flex items-center gap-3.5 py-3.5 pl-5 pr-3">
          <Logo className="h-9 w-9 shrink-0 text-chalk" />
          <div className="min-w-0 flex-1">
            <div className="font-display text-[13px] font-bold uppercase leading-tight text-chalk">
              Поставь GRIT на главный экран
            </div>
            <div className="mt-0.5 truncate text-[11px] font-semibold text-dim">
              {isIOS
                ? 'Поделиться → «На экран „Домой"» — и он откроется как приложение'
                : 'Полноэкранный режим, офлайн-доступ, одна секунда'}
            </div>
          </div>
          {!isIOS && (
            <button
              onClick={install}
              className="flex shrink-0 items-center gap-1.5 bg-flare px-3.5 py-2.5 font-display text-[11px] font-bold uppercase tracking-wider text-ink transition-colors active:bg-flare-soft"
            >
              <IconDownload className="h-3.5 w-3.5" />
              Ставить
            </button>
          )}
          <button
            onClick={() => setGone(true)}
            className="shrink-0 p-1.5 text-dim transition-colors hover:text-chalk"
            aria-label="Скрыть"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
