import fs from 'node:fs';
import path from 'node:path';
import {execSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const VERSION_FILE = path.resolve(PUBLIC_DIR, '.version');

const getCommitHash = () => {
    try {
        return execSync('git rev-parse --short HEAD').toString().trim();
    } catch (e) {
        console.warn('Failed to get git commit hash, using "unknown".', e.message);
        return 'unknown';
    }
};

const updateVersion = () => {
    const hash = getCommitHash();
    let content = hash;

    if (fs.existsSync(VERSION_FILE)) {
        const lines = fs.readFileSync(VERSION_FILE, 'utf-8').split('\n');
        if (lines.length > 0) {
            lines[0] = hash;
            content = lines.join('\n');
        }
    }

    if (!fs.existsSync(PUBLIC_DIR)) {
        fs.mkdirSync(PUBLIC_DIR, {recursive: true});
    }

    fs.writeFileSync(VERSION_FILE, content);
    console.log(`Generated .version: ${hash}`);
};

updateVersion();
