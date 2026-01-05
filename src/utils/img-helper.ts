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
        // ignore
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
        // ignore
    }

    return undefined;
}

export const minifySVG = (svg: string): string => {
    return svg
        // 移除 XML 注释
        .replaceAll(/<!--[\s\S]*?-->/g, '')

        // 移除标签之间的空白（只匹配完全由空格/换行组成的间隔）
        .replaceAll(/>\s+</g, '><')

        // 使用正向断言 (?=[^<]*>) 确保只处理标签内部，不触碰文本内容
        .replaceAll(/\s+(?=[^<]*>)/g, ' ')

        // e.g., fill = "red" -> fill="red"
        .replaceAll(/\s*=\s*(?=[^<]*>)/g, '=')

        // e.g., <rect /> -> <rect/>
        .replaceAll(/\s+(\/?>)/g, '$1')
        .trim();
};
