
/**
 * Simple utility for browser-based text-to-speech functionality
 */

export const speakText = (text: string) => {
  // Stop any current speech
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  
  // Create a new speech synthesis utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Slightly slow down the rate for better clarity
  utterance.rate = 0.9;
  
  // Use a voice that sounds natural if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => 
    voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Female')
  );
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  // Speak the text
  window.speechSynthesis.speak(utterance);
  
  return {
    stop: () => {
      window.speechSynthesis.cancel();
    }
  };
};
