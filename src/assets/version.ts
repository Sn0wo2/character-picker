export const VERSION = (globalThis.VERSION || '' as string)
    .split(/\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('//'));

export const getVersion = async () => {
    try {
        const hash = VERSION[0] || 'dev';
        const url = VERSION[1] || "https://github.com/Sn0wo2/character-picker";
        return {hash, url};
    } catch (e) {
        console.warn('Failed to fetch version:', e);
        return {hash: 'unknown', url: ''};
    }
};
