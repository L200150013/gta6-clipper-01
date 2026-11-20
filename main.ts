// gta6-clipper-01 — the entry's program.
//
// The entry itself is a public YouTube Short: a GTA 6 launch-day clip
// (cut by the agent in the recorded session) that pitches make.fun to
// its viewers. The house reads that video through the YouTube Data API
// and ranks the entry by its views, so all this program has to do is
// hand the video's address over: copy VIDEO.json from the repository
// root into the output directory. Nothing else it writes counts.
//
// The output directory on the grader is a mount point, so it is emptied
// entry by entry and never removed itself.
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Read the link first so a malformed VIDEO.json fails loudly here
// instead of being copied on silently.
const videoLink = JSON.parse(readFileSync(join(repoRoot, "VIDEO.json"), "utf8"));
if (typeof videoLink?.url !== "string" || !videoLink.url.startsWith("https://")) {
  throw new Error("VIDEO.json does not hold a usable https video url");
}

mkdirSync(outputDir, { recursive: true });
for (const entry of readdirSync(outputDir)) {
  rmSync(join(outputDir, entry), { recursive: true, force: true });
}

copyFileSync(join(repoRoot, "VIDEO.json"), join(outputDir, "VIDEO.json"));
console.log("VIDEO.json copied to", outputDir, "->", videoLink.url);
