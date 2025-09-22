export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    const chunk = 0x8000;
    let binary = "";
    for (let i = 0; i < bytes.length; i += chunk) {
        const sub = bytes.subarray(i, i + chunk);
        binary += String.fromCharCode.apply(null, Array.prototype.slice.call(sub));
    }
    return btoa(binary);
}

export const parseImageDimensions = (buffer: ArrayBuffer): { width: number; height: number } | undefined => {
    const dv = new DataView(buffer);
    const len = buffer.byteLength;

    // PNG
    if (len >= 24 && dv.getUint8(0) === 0x89 && dv.getUint8(1) === 0x50 && dv.getUint8(2) === 0x4E && dv.getUint8(3) === 0x47) {
        const width = dv.getUint32(16);
        const height = dv.getUint32(20);
        return {width, height};
    }

    // GIF
    if (len >= 10 && dv.getUint8(0) === 0x47 && dv.getUint8(1) === 0x49 && dv.getUint8(2) === 0x46) {
        const width = dv.getUint16(6, true);
        const height = dv.getUint16(8, true);
        return {width, height};
    }

    // JPEG
    if (len > 2 && dv.getUint8(0) === 0xFF && dv.getUint8(1) === 0xD8) {
        let offset = 2;
        while (offset + 9 < len) {
            if (dv.getUint8(offset) !== 0xFF) {
                offset++;
                continue;
            }
            const marker = dv.getUint8(offset + 1);
            offset += 2;
            if (marker === 0xD8 || marker === 0x01) continue;
            if (marker >= 0xD0 && marker <= 0xD9) continue;
            if (offset + 2 > len) break;
            const segmentLength = dv.getUint16(offset);
            if (segmentLength < 2) break;
            if (
                marker === 0xC0 || marker === 0xC1 || marker === 0xC2 || marker === 0xC3 ||
                marker === 0xC5 || marker === 0xC6 || marker === 0xC7 ||
                marker === 0xC9 || marker === 0xCA || marker === 0xCB ||
                marker === 0xCD || marker === 0xCE || marker === 0xCF
            ) {
                if (offset + 5 > len) break;
                const height = dv.getUint16(offset + 3);
                const width = dv.getUint16(offset + 5);
                return {width, height};
            }
            offset += segmentLength;
        }
    }

    // SVG
    const text = new TextDecoder().decode(new Uint8Array(buffer.slice(0, Math.min(len, 512))));
    const svgMatch = text.match(/<svg\s[^>]*?\bwidth\s*=\s*["']?(\d+)["']?[^>]*?\bheight\s*=\s*["']?(\d+)["']?/i);
    if (svgMatch) return {width: Number(svgMatch[1]), height: Number(svgMatch[2])};

    return undefined;
}
