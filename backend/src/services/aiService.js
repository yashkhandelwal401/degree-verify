import Tesseract from 'tesseract.js';

/**
 * AI Service: This "reads" the PDF to verify the University Name.
 */
export async function verifySource(filePath, universityName) {
  try {
    // 1. AI scans the document for text
    const result = await Tesseract.recognize(filePath, 'eng');
    const text = result.data.text.toLowerCase();
    
    // 2. Check if the university name is actually written in the PDF
    const isVerified = text.includes(universityName.toLowerCase());
    
    return {
      isVerified: isVerified,
      confidence: result.data.confidence,
      textSnippet: text.substring(0, 100) 
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return { isVerified: false, confidence: 0 };
  }
}