import {uint8ArrayToBase64} from 'uint8array-extras';
import {imageSize} from 'image-size';

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    return uint8ArrayToBase64(new Uint8Array(buffer));
}

export const parseImageDimensions = (buffer: ArrayBuffer): { width?: number; height?: number } | undefined => {
    try {
        const dimensions = imageSize(Buffer.from(buffer));
        if (dimensions.width && dimensions.height) {
            return {width: dimensions.width, height: dimensions.height};
        }
    } catch {
    }

    try {
        const text = new TextDecoder().decode(new Uint8Array(buffer.slice(0, Math.min(buffer.byteLength, 1024))));
        const widthMatch = /width=["']?(\d+)["']?/i.exec(text);
        const heightMatch = /height=["']?(\d+)["']?/i.exec(text);
        const viewBoxMatch = /viewBox=["']?[\d\s]+ (\d+) (\d+)["']?/i.exec(text);

        let width = widthMatch ? Number(widthMatch[1]) : undefined;
        let height = heightMatch ? Number(heightMatch[1]) : undefined;

        if (!width && !height && viewBoxMatch) {
            width = Number(viewBoxMatch[1]);
            height = Number(viewBoxMatch[2]);
        }

        if (width || height) return {width, height};
    } catch {
    }

    return undefined;
}

export const minifySVG = (svg: string): string => {
    return svg.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
};
