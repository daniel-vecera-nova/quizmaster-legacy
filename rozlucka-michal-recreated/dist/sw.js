/* Pro Michala service worker — PWA + push handler */
const SW_VERSION = "v1";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch — pass through; PWA cache is intentionally minimal (always-fresh feed)
self.addEventListener("fetch", () => {});

// Push handler — fetches the latest entry and shows a notification
self.addEventListener("push", (event) => {
  event.waitUntil(handlePush(event));
});

async function handlePush(event) {
  let data = null;
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch {
    /* empty push */
  }

  // Default fallback (in case data is not provided)
  let title = "Pro Michala";
  let body = "Nová zpráva";
  let submissionId = null;
  let image = null;

  if (data && typeof data === "object") {
    title = data.title || title;
    body = data.body || body;
    submissionId = data.submissionId || null;
    image = data.image || null;
  } else {
    // No payload — fetch the latest submission from the feed
    try {
      const res = await fetch("/api/feed?limit=1");
      if (res.ok) {
        const j = await res.json();
        const latest = j.submissions?.[0];
        if (latest) {
          title = `Nová zpráva od ${latest.name} 📸`;
          body = (latest.q3_meeting || latest.q2_relation || "").slice(0, 80);
          submissionId = latest.id;
          image = latest.photoUrl || null;
        }
      }
    } catch {}
  }

  await self.registration.showNotification(title, {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-72.png",
    image,
    data: { submissionId },
    tag: submissionId ? `rozlucka-${submissionId}` : "rozlucka",
    renotify: true,
    requireInteraction: false,
    silent: false,
  });
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const submissionId = event.notification.data?.submissionId;
  const url = submissionId
    ? `/?mode=michalo&focus=${encodeURIComponent(submissionId)}`
    : "/?mode=michalo";

  event.waitUntil(
    (async () => {
      const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of list) {
        try {
          if (client.url.includes("/")) {
            await client.focus();
            client.navigate(url).catch(() => {});
            return;
          }
        } catch {}
      }
      await self.clients.openWindow(url);
    })()
  );
});
