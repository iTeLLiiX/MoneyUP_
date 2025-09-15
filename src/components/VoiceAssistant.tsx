import React, { useState, useEffect } from 'react';

interface VoiceAssistantProps {
  onTransactionAdd: (type: 'income' | 'expense', amount: number, description: string, category: string) => void;
  isEnabled: boolean;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onTransactionAdd, isEnabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const startListening = () => {
    if (!isSupported || !isEnabled) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'de-DE';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      processVoiceCommand(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Parse amount
    const amountMatch = lowerCommand.match(/(\d+(?:[.,]\d{1,2})?)\s*(?:euro|€|eur)/);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '.')) : 0;
    
    // Determine type
    const isIncome = lowerCommand.includes('einkommen') || lowerCommand.includes('gehalt') || lowerCommand.includes('erhalten');
    const type = isIncome ? 'income' : 'expense';
    
    // Determine category
    let category = 'other_expense';
    if (lowerCommand.includes('lebensmittel') || lowerCommand.includes('einkauf') || lowerCommand.includes('supermarkt')) {
      category = 'groceries';
    } else if (lowerCommand.includes('tankstelle') || lowerCommand.includes('benzin') || lowerCommand.includes('tanken')) {
      category = 'transport';
    } else if (lowerCommand.includes('restaurant') || lowerCommand.includes('essen') || lowerCommand.includes('kantine')) {
      category = 'restaurant';
    } else if (lowerCommand.includes('gehalt') || lowerCommand.includes('lohn')) {
      category = 'salary';
    } else if (lowerCommand.includes('miete') || lowerCommand.includes('wohnung')) {
      category = 'housing';
    }
    
    // Create description
    const description = command.trim();
    
    if (amount > 0) {
      onTransactionAdd(type, amount, description, category);
      
      // Speak confirmation
      speak(`Transaktion hinzugefügt: ${type === 'income' ? 'Einkommen' : 'Ausgabe'} von ${amount} Euro für ${description}`);
    } else {
      speak('Entschuldigung, ich konnte den Betrag nicht verstehen. Bitte versuchen Sie es erneut.');
    }
  };

  const speak = (text: string) => {
    if (!isEnabled) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  if (!isSupported || !isEnabled) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      <button
        onClick={startListening}
        disabled={isListening}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: isListening ? '#ef4444' : '#10b981',
          color: 'white',
          cursor: isListening ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.2s ease',
          animation: isListening ? 'pulse 1.5s infinite' : 'none'
        }}
        onMouseOver={(e) => {
          if (!isListening) {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = '#059669';
          }
        }}
        onMouseOut={(e) => {
          if (!isListening) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = '#10b981';
          }
        }}
      >
        <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
      </button>
      
      {isListening && (
        <div style={{
          position: 'absolute',
          bottom: '70px',
          right: '0',
          backgroundColor: '#1f2937',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}>
          Höre zu...
        </div>
      )}
      
      {transcript && (
        <div style={{
          position: 'absolute',
          bottom: '70px',
          right: '0',
          backgroundColor: '#1f2937',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          maxWidth: '200px',
          wordWrap: 'break-word',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}>
          "{transcript}"
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default VoiceAssistant;
