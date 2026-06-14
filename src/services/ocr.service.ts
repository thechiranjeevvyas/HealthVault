import Tesseract from 'tesseract.js';
import { getFileBuffer } from '@/lib/storage';

export interface OcrResult {
  text: string;
  confidence: number;
  words: number;
  success: boolean;
  error?: string;
}

export function cleanOcrText(raw: string): string {
  // Replace 3+ consecutive newlines with 2
  let cleaned = raw.replace(/\n{3,}/g, '\n\n');
  // Replace tabs with spaces
  cleaned = cleaned.replace(/\t/g, ' ');
  // Remove non-printable characters (keep standard ASCII and unicode letters/numbers/punctuation)
  cleaned = cleaned.replace(/[^\x20-\x7E\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\n]/g, '');
  // Trim whitespace
  return cleaned.trim();
}

export function isOcrSupported(fileType: string): boolean {
  return ["JPG", "PNG", "WEBP"].includes(fileType);
}

export async function extractTextFromImage(filePath: string): Promise<OcrResult> {
  try {
    const buffer = await getFileBuffer(filePath);
    const result = await Tesseract.recognize(buffer, 'eng', {
      logger: () => {} // Suppress progress logs
    });
    
    const rawText = result.data.text;
    const confidence = result.data.confidence;
    const cleanedText = cleanOcrText(rawText);
    const words = cleanedText.split(/\s+/).filter(w => w.length > 0).length;

    return {
      text: cleanedText,
      confidence,
      words,
      success: true
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown OCR Error";
    return {
      success: false,
      error: message,
      text: '',
      confidence: 0,
      words: 0
    };
  }
}
