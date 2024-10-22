
export async function createJWT(payload: any, secret: string): Promise<string> {
    const encoder = new TextEncoder();

    // Create the header
    const header = {
        alg: "HS384",
        typ: "JWT"
    };

    // Base64URL encode the header and payload
    const base64UrlEncode = (obj: object) => {
        return btoa(JSON.stringify(obj))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    };

    const encodedHeader = base64UrlEncode(header);
    const encodedPayload = base64UrlEncode(payload);

    // Create the data to sign
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    // Convert the secret to a CryptoKey
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: { name: "SHA-384" } },
        false,
        ["sign"]
    );

    // Sign the data
    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(dataToSign)
    );

    // Base64URL encode the signature
    const base64UrlEncodeArrayBuffer = (buffer: ArrayBuffer) => {
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    };

    const encodedSignature = base64UrlEncodeArrayBuffer(signature);

    // Combine the parts to form the JWT
    return `${dataToSign}.${encodedSignature}`;
}
