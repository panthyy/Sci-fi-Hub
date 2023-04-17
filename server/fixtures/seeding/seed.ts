import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";

unstable_dev("fixtures/seeding/seedScript.ts", {
  experimental: { disableExperimentalWarning: true },
  config: "wrangler.toml",
  local: true,
  persist: true,
  persistTo: ".wrangler/state",
}).then((worker) => {
  worker.fetch().then((resp) => {
    if (resp) {
      resp.text().then((text) => {
        console.log(text);
        worker.stop();
      });
    }
  });
});
