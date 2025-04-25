module.exports = async (req, res) => {
  // CORS-Header
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { fileBuffer, fileType, fileName } = req.body || {};
    
    // Einfache Verarbeitung für den Test
    if (!fileBuffer) {
      return res.status(200).json({ 
        text: "Test-Antwort - keine Datei übermittelt",
        metadata: {
          testMode: true,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Base64-String in Text umwandeln
    const text = Buffer.from(fileBuffer, 'base64').toString('utf-8');
    
    // Erfolgreiche Antwort
    res.status(200).json({ 
      text,
      metadata: {
        fileName,
        fileType,
        extractionTime: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Failed to process request', details: error.message });
  }
};
