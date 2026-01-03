import {optimize} from 'svgo';
import {imageSize} from 'image-size';
import {uint8ArrayToBase64} from 'uint8array-extras';

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    return uint8ArrayToBase64(new Uint8Array(buffer));
}

export const parseImageDimensions = (buffer: ArrayBuffer): { width?: number; height?: number } | undefined => {
    try {
        const dimensions = imageSize(Buffer.from(buffer));
        return {width: dimensions.width, height: dimensions.height};
    } catch (e) {
        const text = new TextDecoder().decode(new Uint8Array(buffer.slice(0, Math.min(buffer.byteLength, 512))));
        const svgMatch = new RegExp(/<svg\s[^>]*?\bwidth\s*=\s*["']?(\d+)["']?[^>]*?\bheight\s*=\s*["']?(\d+)["']?/i).exec(text);
        if (svgMatch) return {width: Number(svgMatch[1]), height: Number(svgMatch[2])};
        return undefined;
    }
}

export const minifySVG = (svg: string): string => {
    const result = optimize(svg, {
        multipass: true,
        plugins: [
            'preset-default',
        ],
    });
    return result.data;
};
