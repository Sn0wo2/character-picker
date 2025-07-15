export const md5 = async (data: BufferSource) => {
    return Array.from(new Uint8Array(await crypto.subtle.digest('MD5',
        data))).map(b => b.toString(16).padStart(2, '0'))
        .join('');
}