// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
      console.log('[PWA] Service worker registered');
    } catch (err) {
      console.warn('[PWA] SW registration failed', err);
    }
  });
}

// Install Prompt handling
let deferredPrompt = null;
const installBtn = document.getElementById('installButton');
const installedBadge = document.getElementById('installedBadge');

window.addEventListener('beforeinstallprompt', (e) => {
	console.log('[PWA] beforeinstallprompt fired 1');
  // Stop the mini-infobar on mobile
  e.preventDefault();
  console.log('[PWA] beforeinstallprompt fired 2');
  deferredPrompt = e;
  $("#installToast").toast("show");
  installBtn.style.display = 'inline-block';
  console.log('[PWA] beforeinstallprompt fired 3');
});

installBtn?.addEventListener('click', async () => {
	console.log("installBtn");
  if (!deferredPrompt) return;
  installBtn.style.display = 'none';
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log('[PWA] User install choice:', outcome);
  deferredPrompt = null;
});

window.addEventListener('appinstalled', () => {
  console.log('[PWA] Installed');
  installedBadge.style.display = 'inline-block';
});

// iOS tip (no beforeinstallprompt event)
const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isInStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
if (isiOS && !isInStandalone) {
  console.log('Tip: On iOS use Share → Add to Home Screen to install');
}
