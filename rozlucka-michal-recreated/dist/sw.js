/* Pro Michala service worker — PWA + push handler */
const SW_VERSION = "v2";
const API_BASE = "https://rozlucka-api.agenticprague.com";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {});

self.addEventListener("push", (event) => {
  event.waitUntil(handlePush(event));
});

async function handlePush(event) {
  let title = "Pro Michala";
  let body = "Nová zpráva";
  let submissionId = null;
  let image = null;
  let clickUrl = "/?mode=michalo";

  // 1. Try payload (we don't use it today, but support if backend ever adds aes128gcm)
  let data = null;
  try {
    if (event.data) data = event.data.json();
  } catch {}
  if (data && typeof data === "object") {
    title = data.title || title;
    body = data.body || body;
    submissionId = data.submissionId || null;
    image = data.image || null;
    clickUrl = data.url || clickUrl;
  } else {
    // 2. Try a recent broadcast (admin-sent push)
    let used = false;
    try {
      const r = await fetch(`${API_BASE}/api/latest-broadcast`, { cache: "no-store" });
      if (r.ok) {
        const j = await r.json();
        const b = j && j.broadcast;
        if (b && b.ts && Date.now() - b.ts < 5 * 60 * 1000) {
          title = b.title || "Pro Michala";
          body = b.body || "";
          clickUrl = b.url || "/";
          used = true;
        }
      }
    } catch {}
    // 3. Fall back to latest submission
    if (!used) {
      try {
        const res = await fetch(`${API_BASE}/api/feed?limit=1`, { cache: "no-store" });
        if (res.ok) {
          const j = await res.json();
          const latest = j.submissions && j.submissions[0];
          if (latest) {
            title = `Nová zpráva od ${latest.name} 📸`;
            body = (latest.q3_meeting || latest.q2_relation || "").slice(0, 80);
            submissionId = latest.id;
            image = latest.photoUrl || null;
            clickUrl = `/?mode=michalo&focus=${encodeURIComponent(submissionId)}`;
          }
        }
      } catch {}
    }
  }

  await self.registration.showNotification(title, {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-72.png",
    image,
    data: { submissionId, url: clickUrl },
    tag: submissionId ? `rozlucka-${submissionId}` : `rozlucka-${title}`,
    renotify: true,
    requireInteraction: false,
    silent: false,
  });
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const url = data.url || (data.submissionId ? `/?mode=michalo&focus=${encodeURIComponent(data.submissionId)}` : "/?mode=michalo");

  event.waitUntil(
    (async () => {
      const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of list) {
        try {
          await client.focus();
          client.navigate(url).catch(() => {});
          return;
        } catch {}
      }
      await self.clients.openWindow(url);
    })()
  );
});
