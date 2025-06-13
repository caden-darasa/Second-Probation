export function extractData(buffer, dataLength = 2000): string {
    let binaryData: string = "";

    const pngHeader = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]; // Header PNG
    const headerEndIndex: number = buffer.findIndex((_, i) =>
        pngHeader.every((byte, j) => buffer[i + j] === byte)
    ) + pngHeader.length;
    
    for (let i = headerEndIndex; i < buffer.length; i++) {
        if (binaryData.length < dataLength * 8) {
            const binaryByte: string = buffer[i].toString(2).padStart(8, "0");
            binaryData += binaryByte.slice(-1);
        } else {
            break;
        }
    }

    let result: string = "";
    for (let i = 0; i < binaryData.length; i += 8) {
        const byte: string = binaryData.slice(i, i + 8);
        result += String.fromCharCode(parseInt(byte, 2));
    }

    if (result.includes("0end")) {
        result = result.split("0end")[0];        
        return result;
    }

    return null;
}