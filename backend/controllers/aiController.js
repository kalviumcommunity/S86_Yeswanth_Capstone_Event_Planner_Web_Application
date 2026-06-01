exports.getSuggestions = async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic || !topic.trim()) {
      return res.status(400).json({ message: 'Event topic or concept is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      // Direct REST fetch to Google Gemini 1.5 Flash API
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const prompt = `You are an expert luxury event coordinator. 
Generate a creative event theme concept for the following topic: "${topic}".
Your response must be a single, valid JSON object containing exactly these three fields (do not wrap in markdown tags or backticks):
{
  "theme": "A short creative title for the event theme",
  "palette": "A curated harmonious color palette",
  "suggestion": "A detailed, luxury styling tip or decor idea for the event"
}`;

      try {
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          let text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          
          // Clean markdown wrappers if returned
          if (text.startsWith('```')) {
            text = text.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
          }
          
          const parsed = JSON.parse(text);
          return res.status(200).json({
            theme: parsed.theme || 'Creative Gathering Concept',
            palette: parsed.palette || 'Sage, Sand & Muted Gold',
            suggestion: parsed.suggestion || 'Use custom textured table linens and suspended warm LED filaments.'
          });
        }
      } catch (geminiError) {
        console.warn('Gemini request failed, entering procedural fallback:', geminiError.message);
      }
    }

    // Advanced Procedural Fallback Generator
    const cleanTopic = topic.toLowerCase();
    let theme = '';
    let palette = '';
    let suggestion = '';

    if (cleanTopic.includes('wed') || cleanTopic.includes('marry') || cleanTopic.includes('marriage') || cleanTopic.includes('anniversary')) {
      const options = [
        {
          theme: 'Ethereal Botanical Haven',
          palette: 'Sage, Mint, Warm Gold & Ivory',
          suggestion: 'Install suspended foliage clusters over the main banquet table with low-voltage warm fairy lights to mirror a forest canopy.'
        },
        {
          theme: 'Classic French Riviera Romance',
          palette: 'Dusty Rose, Champagne & Slate Blue',
          suggestion: 'Drape chiffon runners over weathered oak tables, matching with gold-rimmed glassware and tapered cream wax candles.'
        },
        {
          theme: 'Gilded Ivy Cathedral',
          palette: 'Peach Fuzz, Cream & Antique Brass',
          suggestion: 'Arrange wild garden rose arches at the altar with loose jasmine vines trailing along the floor aisles.'
        }
      ];
      const selected = options[Math.floor(Math.random() * options.length)];
      theme = selected.theme;
      palette = selected.palette;
      suggestion = selected.suggestion;
    } else if (cleanTopic.includes('party') || cleanTopic.includes('birth') || cleanTopic.includes('celebrate') || cleanTopic.includes('gala')) {
      const options = [
        {
          theme: 'Neon Minimalist Oasis',
          palette: 'Deep Indigo, Mint Glow & Brushed Slate',
          suggestion: 'Utilize custom neon monogram signage at the entrance, framed by giant monsteras and gold metal grids.'
        },
        {
          theme: 'Midnight Sparkle Masquerade',
          palette: 'Black Velvet, Shimmering Gold & Deep Violet',
          suggestion: 'Drape deep velvet tablecloths, set up low-lit amber spotlights, and scatter reflective gold foil accents to create a high-contrast atmosphere.'
        },
        {
          theme: 'Sun-Drenched Citrus Cabana',
          palette: 'Tangerine, Seafoam Green & Warm Sand',
          suggestion: 'Construct an outdoor mocktail bar accented with suspended dried orange wheels, bamboo pillars, and fresh rosemary sprigs.'
        }
      ];
      const selected = options[Math.floor(Math.random() * options.length)];
      theme = selected.theme;
      palette = selected.palette;
      suggestion = selected.suggestion;
    } else if (cleanTopic.includes('corporate') || cleanTopic.includes('meet') || cleanTopic.includes('conference') || cleanTopic.includes('tech') || cleanTopic.includes('launch')) {
      const options = [
        {
          theme: 'Industrial Loft Futurist',
          palette: 'Charcoal Gray, Cobalt Blue & Mint Accents',
          suggestion: 'Incorporate geometric matte black iron structures with integrated warm LED strip lighting as backdrop partition walls.'
        },
        {
          theme: 'Sustainable Green Exchange',
          palette: 'Forest Green, Cork, White & Kraft Paper Brown',
          suggestion: 'Use recycled wooden tabletops, living potted herb centerpieces, and spotlighting to evoke a clean eco-conscious atmosphere.'
        },
        {
          theme: 'Sophisticated Indigo Lounge',
          palette: 'Slate Gray, Warm Brass & Brushed Platinum',
          suggestion: 'Arrange a cozy fireplace chat layout using modular velvet armchairs and low-hanging copper pendant lights.'
        }
      ];
      const selected = options[Math.floor(Math.random() * options.length)];
      theme = selected.theme;
      palette = selected.palette;
      suggestion = selected.suggestion;
    } else {
      const options = [
        {
          theme: 'Chic Organic Modernist',
          palette: 'Terracotta, Sand, Ochre & Seafoam',
          suggestion: 'Utilize raw linen table runnings, micro-dosed pottery installations, and pampas grass columns for a highly textural sensory layout.'
        },
        {
          theme: 'Coastal Driftwood Sanctuary',
          palette: 'Sea Salt White, Sand, Sage & Slate Blue',
          suggestion: 'Drape white sails overhead, accented with driftwood cluster arrangements and thick woven jute table runners.'
        },
        {
          theme: 'Monochromatic Architectural Minimalist',
          palette: 'Matte Black, Crisp White & Emerald Glow',
          suggestion: 'Create a high-contrast visual layout using black metal wire chairs, crisp linen tablecloths, and statement emerald banana leaf branches.'
        }
      ];
      const selected = options[Math.floor(Math.random() * options.length)];
      theme = selected.theme;
      palette = selected.palette;
      suggestion = selected.suggestion;
    }

    return res.status(200).json({ theme, palette, suggestion });

  } catch (err) {
    console.error('AI suggestion controller error:', err);
    res.status(500).json({ message: 'Failed to generate suggestions', error: err.message });
  }
};
