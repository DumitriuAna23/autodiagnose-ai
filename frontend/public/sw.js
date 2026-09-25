const CACHE_PREFIX =
  "autodiagnose-ai";

const CACHE_VERSION =
  "v1";


self.addEventListener(
  "install",
  () => {
    self.skipWaiting();
  }
);


self.addEventListener(
  "activate",
  (event) => {
    event.waitUntil(
      (async () => {
        const cacheNames =
          await caches.keys();

        await Promise.all(
          cacheNames
            .filter(
              (name) =>
                name.startsWith(
                  CACHE_PREFIX
                ) &&
                name !==
                  `${CACHE_PREFIX}-${CACHE_VERSION}`
            )
            .map(
              (name) =>
                caches.delete(
                  name
                )
            )
        );

        await self.clients.claim();
      })()
    );
  }
);


/*
 * Deliberately no fetch cache yet.
 *
 * AutoDiagnose AI contains authenticated,
 * user-specific diagnostic data. We do not
 * cache API responses or private pages until
 * an explicit offline-data strategy is added.
 */
