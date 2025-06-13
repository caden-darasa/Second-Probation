import pako from 'pako';

interface PNGChunk {
    length: number;
    type: string;
    data: Uint8Array;
    crc: Uint8Array;
}

export class HordeMode {
    private static PNG_SIGNATURE = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    private static readonly formatChecker = /^[\x00-\x7F]*$/;

    static isValidMessage(message: string): boolean {
        if (!message || message.length === 0) {
            return false;
        }
        return HordeMode.formatChecker.test(message);
    }

    /**
     * Extracts hidden message from a PNG file
     */
    static extractMessageFromUint8Array(fileData: Uint8Array): string {
        if (!this.isPNG(fileData)) {
            throw new Error('File is not a valid PNG');
        }

        const chunks = this.parseChunks(fileData);
        console.log("chunks length:", chunks.length);
        const idatChunk = chunks.find(chunk => chunk.type === 'IDAT');
        const ihdrChunk = chunks.find(chunk => chunk.type === 'IHDR');
        
        if (!idatChunk || !ihdrChunk) {
            throw new Error('Invalid PNG structure');
        }

        console.log("Decompress data");
        // Decompress the image data
        const decompressedData = pako.inflate(idatChunk.data);
        
        let binaryMessage = '';
        let currentByte = '';
        let message = '';

        console.log("read width");
        // Create a DataView to read the 32-bit integer
        const widthView = new DataView(ihdrChunk.data.buffer, ihdrChunk.data.byteOffset, 4);
        const width = widthView.getUint32(0, false) * 3; // false for big-endian

        console.log("read compressed data");
        for (let i = 0; i < decompressedData.length; i++) {
            // Skip filter byte at the start of each scanline
            if (i % (width + 1) === 0) continue;

            const bit = decompressedData[i] & 1;
            currentByte += bit;

            if (currentByte.length === 8) {
                const charCode = parseInt(currentByte, 2);
                if (charCode === 0) break; // Found null terminator

                message += String.fromCharCode(charCode);
                currentByte = '';
            }
        }

        if (message.endsWith("ED")) {
            message = message.substring(0, message.length - 2);
        }
        if (!this.isValidMessage(message)) {
            return null;
        }
        console.log("mSg", message);
        return message;
    }

    private static isPNG(data: Uint8Array): boolean {
        if (data.length < 8) return false;
        for (let i = 0; i < 8; i++) {
            if (data[i] !== this.PNG_SIGNATURE[i]) return false;
        }
        return true;
    }

    private static parseChunks(data: Uint8Array): PNGChunk[] {
        const chunks: PNGChunk[] = [];
        let offset = 8; // Skip PNG signature

        while (offset < data.length) {
            // Create a DataView for reading the length
            const lengthView = new DataView(data.buffer, data.byteOffset + offset, 4);
            const length = lengthView.getUint32(0, false); // false for big-endian

            // Extract type (4 bytes after length)
            const typeArray = data.slice(offset + 4, offset + 8);
            const type = new TextDecoder().decode(typeArray);

            // Extract data and CRC
            const chunkData = data.slice(offset + 8, offset + 8 + length);
            const crc = data.slice(offset + 8 + length, offset + 8 + length + 4);

            chunks.push({ length, type, data: chunkData, crc });
            offset += 12 + length;
        }

        return chunks;
    }

    private static serializeChunk(chunk: PNGChunk): Uint8Array {
        // Create a buffer for the length (4 bytes)
        const lengthArray = new Uint8Array(4);
        new DataView(lengthArray.buffer).setUint32(0, chunk.data.length, false); // false for big-endian

        // Convert type to Uint8Array
        const typeArray = new TextEncoder().encode(chunk.type);

        // Concatenate all parts
        const totalLength = 4 + 4 + chunk.data.length + 4;
        const result = new Uint8Array(totalLength);
        
        result.set(lengthArray, 0);
        result.set(typeArray, 4);
        result.set(chunk.data, 8);
        result.set(chunk.crc, 8 + chunk.data.length);

        return result;
    }
}