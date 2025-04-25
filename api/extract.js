const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { DocxLoader } = require("langchain/document_loaders/fs/docx");
const { TextLoader } = require("langchain/document_loaders/fs/text");

module.exports = async (req, res) => {
  // CORS-Header
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileBuffer, fileType, fileName } = req.body;

    // Base64-String in Buffer umwandeln
    const buffer = Buffer.from(fileBuffer, 'base64');

    let text = '';

    // Je nach Dateityp den passenden Loader verwenden
    if (fileType.includes('pdf')) {
      const loader = new PDFLoader(buffer);
      const docs = await loader.load();
      text = docs.map(doc => doc.pageContent).join('\n\n');
    }
    else if (fileType.includes('docx') || fileType.includes('word')) {
      const loader = new DocxLoader(buffer);
      const docs = await loader.load();
      text = docs.map(doc => doc.pageContent).join('\n\n');
    }
    else if (fileType.includes('text') || fileType.includes('txt')) {
      const loader = new TextLoader(buffer);
      const docs = await loader.load();
      text = docs.map(doc => doc.pageContent).join('\n\n');
    }
    else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    res.status(200).json({
      text,
      metadata: {
        fileName,
        fileType,
        extractionTime: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error extracting text:', error);
    res.status(500).json({ error: 'Failed to extract text', details: error.message });
  }
};
