// tweaks.js  (compiled from tweaks.jsx — edit the .jsx source, not this file)
// Halldorophone Tweaks — three expressive controls that reshape the page's
// feel as a whole, not single-property knobs:
//
//   • Mood    — palette + temperature (paper-archive ↔ warm-studio ↔ dark-feedback)
//   • Voice   — typeface system (document sans / specimen serif / manuscript mono)
//   • Density — coordinated spacing + size + line-height (compressed ↔ open)
//
// Values are applied as data-* attributes on <html> (mood, voice) and a CSS
// custom property `--density`. Styles in tweak-modes.css do the heavy lifting.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mood": "archive",
  "voice": "document",
  "density": 1
} /*EDITMODE-END*/;

function HalldoTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.mood = t.mood;
    root.dataset.voice = t.voice;
    root.style.setProperty('--density', t.density);
  }, [t.mood, t.voice, t.density]);
  return /*#__PURE__*/React.createElement(TweaksPanel, {
    title: "Tweaks"
  }, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Mood"
  }, /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Palette",
    value: t.mood,
    options: [{
      value: 'archive',
      label: 'Archive'
    }, {
      value: 'studio',
      label: 'Studio'
    }, {
      value: 'feedback',
      label: 'Feedback'
    }],
    onChange: v => setTweak('mood', v)
  })), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Voice"
  }, /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Typeface",
    value: t.voice,
    options: [{
      value: 'document',
      label: 'Document'
    }, {
      value: 'specimen',
      label: 'Specimen'
    }, {
      value: 'manuscript',
      label: 'Mono'
    }],
    onChange: v => setTweak('voice', v)
  })), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Density"
  }, /*#__PURE__*/React.createElement(TweakSlider, {
    label: "Breathing",
    value: t.density,
    min: 0.7,
    max: 1.45,
    step: 0.05,
    onChange: v => setTweak('density', v)
  })));
}

const root = ReactDOM.createRoot(document.getElementById('tweaks-root'));
root.render(/*#__PURE__*/React.createElement(HalldoTweaks, null));
