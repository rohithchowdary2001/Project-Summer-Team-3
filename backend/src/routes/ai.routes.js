const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/suggest-books', async (req, res) => {
  const { books } = req.body;
  const prompt = `Suggest 5 books for someone who likes these: ${books.join(', ')}.`;

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OpenAI API key is missing." });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });
    res.json({ suggestions: completion.choices[0].message.content });
  } catch (error) {
    console.error('AI suggestion error:', error);
    res.status(500).json({ error: "AI suggestion failed", details: error.message });
  }
});

module.exports = router;