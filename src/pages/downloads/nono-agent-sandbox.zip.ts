import type { APIRoute } from 'astro';
import { zipSync, type Zippable } from 'fflate';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';

const KIT_NAME = 'nono-agent-sandbox';
const KIT_DIR = join(process.cwd(), 'public', 'downloads', KIT_NAME);

// Fixed timestamp so the archive is reproducible between builds.
const MTIME = new Date('2026-01-01T00:00:00Z');

/** Collects every file of the kit, keeping the Unix mode so `bin/*` stays executable. */
function collectFiles(dir: string, prefix: string, files: Zippable): void {
    for (const entry of readdirSync(dir).sort()) {
        const fullPath = join(dir, entry);
        const archivePath = posix.join(prefix, entry);
        const stats = statSync(fullPath);

        if (stats.isDirectory()) {
            collectFiles(fullPath, archivePath, files);
        } else if (stats.isFile()) {
            files[archivePath] = [
                readFileSync(fullPath),
                { mtime: MTIME, os: 3, attrs: ((0o100000 | (stats.mode & 0o777)) << 16) >>> 0 },
            ];
        }
    }
}

export const GET: APIRoute = () => {
    const files: Zippable = {};
    collectFiles(KIT_DIR, KIT_NAME, files);

    return new Response(zipSync(files, { level: 9 }), {
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${KIT_NAME}.zip"`,
        },
    });
};
