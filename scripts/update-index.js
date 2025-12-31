import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const INDEX_FILE = path.resolve(PUBLIC_DIR, '.index');
const IGNORE_FILE = path.resolve(PUBLIC_DIR, '.assetsignore');

const updateIndex = () => {
    let ignoreList = [];
    if (fs.existsSync(IGNORE_FILE)) {
        const content = fs.readFileSync(IGNORE_FILE, 'utf-8');
        ignoreList = content.split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith('#'));
    }
    ignoreList.push('.assetsignore', '.index');

    let files = [];

    files = fs.readdirSync(PUBLIC_DIR);

    const currentFiles = files.filter(file => {
        if (ignoreList.includes(file)) return false;
        try {
            return fs.statSync(path.join(PUBLIC_DIR, file)).isFile();
        } catch (e) {
            return false;
        }
    });

    let indexContent = '';
    if (fs.existsSync(INDEX_FILE)) {
        indexContent = fs.readFileSync(INDEX_FILE, 'utf-8');
    }

    const existingFiles = new Set(
        indexContent.split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('//'))
    );

    const newFiles = currentFiles.filter(file => !existingFiles.has(file));

    if (newFiles.length === 0) {
        console.log('No new files to add.');
        return;
    }

    const now = new Date();
    const formatDate = (d) => {
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    let appendContent = '';

    if (indexContent.length > 0 && !indexContent.endsWith('\n\n')) {
        appendContent += '\n';
    }

    appendContent += `// (Added on ${formatDate(now)})\n`;
    appendContent += newFiles.join('\n') + '\n';

    try {
        fs.appendFileSync(INDEX_FILE, appendContent);
        console.log(`Added ${newFiles.length} new files to .index`);
    } catch (e) {
        console.error('Error:', e);
    }
};

updateIndex();
