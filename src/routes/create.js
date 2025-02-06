const express = require('express');
const log = require('../services/logger');
const generateSlide = require('../services/imageGenerator');
// const uploadImage = require('../services/uploader');
const authenticate = require('../auth');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    console.log('📥 Recebendo payload...');
    const slides = req.body.slides;
    log('INFO', 'Received payload for slide generation.', { payload: req.body });

    if (!slides || !Array.isArray(slides)) {
      return res.status(400).json({ error: 'Payload inválido. Esperado um array de slides.' });
    }

    let urls = [];

    for (const slide of slides) {
        const imagePath = await generateSlide(slide);
//        const imageUrl = await uploadImage(imagePath);
        urls.push({ slide_number: slide.slide_number, url: imagePath });
    }

    log('INFO', 'Slides generated and uploaded successfully.', { urls });

    console.log('✅ Slides gerados e enviados com sucesso!');
    res.json({ urls });

  } catch (error) {
    log('ERROR', 'Failed to process slides.', { error: error.message });
    console.error(`❌ Erro no processamento: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;