const { OpenAI } = require('openai');

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
    const { text, metadata, chunkId } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required' });
    }

    // OpenAI API initialisieren
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Embedding mit text-embedding-3-large generieren
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: text,
      encoding_format: "float"
    });

    const embedding = response.data[0].embedding;

    res.status(200).json({
      id: chunkId,
      values: embedding,
      metadata: {
        ...metadata,
        text: text.slice(0, 100) + '...' // Nur für Debugging
      }
    });
  } catch (error) {
    console.error('Error generating embedding:', error);
    res.status(500).json({ error: 'Failed to generate embedding', details: error.message });
  }
};
