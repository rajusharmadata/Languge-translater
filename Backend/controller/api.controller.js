import translate from 'translate';

const translateController = async (req, res) => {
  try {
    const { l1, l2, text } = req.body;
    console.log(l1,l2,text);

    if (!l1 || !l2 || !text) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide 'text', 'l1' (source language), and 'l2' (target language).",
      });
    }

    // Translate
    const translatedText = await translate(text, { from: l1, to: l2 });

    return res.status(200).json({
      success: true,
      original: text,
      translated: translatedText,
      from: l1,
      to: l2,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Translation failed.',
      error: error.message,
    });
  }
};

export { translateController };
