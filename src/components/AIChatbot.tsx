import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Activity, 
  BarChart3, 
  Zap, 
  Wind, 
  Car, 
  Hospital, 
  Droplets, 
  MessageSquare, 
  ArrowRight,
  Brain,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ChatMessage, AIRecommendation } from '../types';
import { CityApi } from '../services/api';

interface AIChatbotProps {
  selectedWard: string;
  isDrawer?: boolean;
  onCloseDrawer?: () => void;
}

const DOMAIN_QUICK_FILTERS = [
  { id: 'all', label: 'All City Data', icon: Activity },
  { id: 'traffic', label: 'Traffic & Signals', icon: Car },
  { id: 'aqi', label: 'Weather & AQI', icon: Wind },
  { id: 'utility', label: 'Power & Water Grid', icon: Zap },
  { id: 'complaints', label: 'Complaints & BBMP', icon: MessageSquare },
  { id: 'emergency', label: 'Hospitals & Police', icon: Hospital },
  { id: 'ml', label: 'ML Explainability', icon: Brain }
];

const DOMAIN_PROMPTS: Record<string, string[]> = {
  all: [
    'Explain Bengaluru City Health Score',
    'Predict Silk Board peak congestion',
    'Show AQI in Whitefield',
    'Where is nearest hospital ICU bed'
  ],
  traffic: [
    'What is average speed on Outer Ring Road?',
    'Trigger Signal Green Wave on Silk Board Corridor',
    'Show accident blackspots near Koramangala'
  ],
  aqi: [
    'What is current PM2.5 at Central Silk Board?',
    'Deploy anti-smog mist cannon at Hebbal Flyover',
    'Is air quality safe for outdoor running in Yelahanka?'
  ],
  utility: [
    'Status of BESCOM 220kV Master Power Grid',
    'Check BWSSB Cauvery Stage V water supply rate',
    'Which wards report water deficits?'
  ],
  complaints: [
    'How many open pothole tickets in Indiranagar?',
    'What is average resolution time for BBMP complaints?',
    'Report garbage dump issue'
  ],
  emergency: [
    'Find nearest tertiary trauma center with free ICU beds',
    'Show police stations on duty in Silk Board',
    'What is ambulance dispatch SLA time?'
  ],
  ml: [
    'Explain XGBoost Traffic Regressor model weights',
    'What are top feature factors for AQI spikes?',
    'Simulate counterfactual: reduce vehicle density by 20%'
  ]
};

export const AIChatbot: React.FC<AIChatbotProps> = ({
  selectedWard,
  isDrawer = false,
  onCloseDrawer
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeDomain, setActiveDomain] = useState<string>('all');
  
  // Voice Input (Speech-to-Text) State
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Voice Output (Text-to-Speech) State
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState<boolean>(true);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  // Feedback Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load chat history from backend on mount
  useEffect(() => {
    async function loadHistory() {
      const history = await CityApi.getChatHistory();
      if (history && history.length > 0) {
        setMessages(history);
      } else {
        setMessages([
          {
            id: 'msg-1',
            sender: 'bot',
            text: `Hello! I am SmartCity AI, the conversational intelligence engine for Bengaluru. I am connected to live PostGIS, BESCOM, BWSSB, and traffic sensors across all 12 wards. How can I assist your command team?`,
            timestamp: 'Just now',
            dataCard: {
              title: 'Bengaluru Command Twin Connected',
              metrics: [
                { label: 'Overall City Health', value: '84 / 100', badge: 'Optimal' },
                { label: 'Selected Ward', value: selectedWard },
                { label: 'Sensors Active', value: '1,420 Live' }
              ]
            }
          }
        ]);
      }
    }
    loadHistory();
  }, [selectedWard]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Setup Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
          setInput(transcript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceListening = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition API is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Text-to-Speech Helper
  const speakText = (text: string, msgId?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (currentlySpeakingId === msgId) {
      setCurrentlySpeakingId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setCurrentlySpeakingId(null);
    utterance.onerror = () => setCurrentlySpeakingId(null);

    if (msgId) setCurrentlySpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Send Chat Message
  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const response = await CityApi.askAIChatbot(query, selectedWard);
      setMessages((prev) => [...prev, response]);

      if (isVoiceOutputEnabled && response.text) {
        speakText(response.text, response.id);
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  // Clear History
  const handleClearHistory = async () => {
    await CityApi.clearChatHistory();
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: 'Chat history cleared. SmartCity AI engine re-initialized.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setToastMessage('Chat history cleared');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Execute Action from AI Recommendation Button
  const handleExecuteRecommendation = async (rec: AIRecommendation) => {
    if (rec.actionType === 'GREEN_WAVE') {
      await CityApi.triggerGreenWave('Silk Board Junction', 15);
      setToastMessage('Signal Green Wave Activated for 15 mins');
    } else if (rec.actionType === 'SMOG_CANNON') {
      await CityApi.deploySmogCannon('aqi-1');
      setToastMessage('Anti-Smog Mist Cannon Deployed at Silk Board');
    } else if (rec.actionType === 'WATER_TANKER') {
      setToastMessage('2 Emergency BWSSB Tankers Dispatched to Whitefield Zone 3');
    }

    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-[#0B1220] ${isDrawer ? 'h-full border-l border-slate-200 dark:border-slate-800' : 'p-4 lg:p-6 max-w-[1200px] mx-auto min-h-[calc(100vh-6rem)] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm'}`}>
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 text-center flex items-center justify-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              SmartCity AI Conversational Intelligence
              <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md font-mono">ML Ready</span>
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">PostGIS Geo-Spatial & Multi-Domain City Analytics Engine</p>
          </div>
        </div>

        {/* Voice & History Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsVoiceOutputEnabled(!isVoiceOutputEnabled)}
            className={`p-2 rounded-xl border text-xs transition-colors ${isVoiceOutputEnabled ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-600' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'}`}
            title={isVoiceOutputEnabled ? "Voice Speech Output Enabled" : "Voice Output Muted"}
          >
            {isVoiceOutputEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={handleClearHistory}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {isDrawer && onCloseDrawer && (
            <button onClick={onCloseDrawer} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Domain Quick Categories Filter Tabs */}
      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {DOMAIN_QUICK_FILTERS.map((d) => {
          const Icon = d.icon;
          const isActive = activeDomain === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setActiveDomain(d.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{d.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[88%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-indigo-600 text-white'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className="space-y-2.5 flex-1">
              <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-tl-none shadow-sm'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="whitespace-pre-line">{msg.text}</p>
                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => speakText(msg.text, msg.id)}
                      className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0 ${currentlySpeakingId === msg.id ? 'text-blue-600 animate-pulse' : 'text-slate-400'}`}
                      title="Read aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* 1. Metric Data Card */}
                {msg.dataCard && (
                  <div className="mt-3 p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-sm">
                    <span className="font-bold text-[11px] text-blue-600 dark:text-blue-400 block mb-2">{msg.dataCard.title}</span>
                    <div className="space-y-1.5">
                      {msg.dataCard.metrics.map((m, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 dark:text-slate-400">{m.label}:</span>
                          <span className="font-bold font-mono flex items-center gap-1.5">
                            {m.value}
                            {m.badge && (
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-sans ${m.badge === 'Gridlock' || m.badge === 'Poor' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {m.badge}
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. ML Explainability Card */}
                {msg.explainabilityCard && (
                  <div className="mt-3 p-3 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800/60 text-indigo-950 dark:text-indigo-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-indigo-600" /> ML Explainability: {msg.explainabilityCard.modelName}
                      </span>
                      <span className="text-[10px] font-mono bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-1.5 py-0.5 rounded font-bold">
                        {msg.explainabilityCard.confidencePercent}% Confidence
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-bold text-indigo-600 uppercase">Top Feature Importance Weights:</div>
                      {msg.explainabilityCard.features.map((feat, fi) => (
                        <div key={fi} className="space-y-0.5">
                          <div className="flex justify-between text-[10px]">
                            <span>{feat.featureName} ({feat.value})</span>
                            <span className="font-bold font-mono">{feat.weight}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-indigo-200 dark:bg-indigo-900 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${feat.weight}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {msg.explainabilityCard.counterfactualText && (
                      <div className="mt-2 text-[10px] bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900/60 text-indigo-900 dark:text-indigo-200 italic">
                        <b>Counterfactual Simulation:</b> {msg.explainabilityCard.counterfactualText}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Actionable AI Recommendations */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommended Command Actions:</span>
                    {msg.recommendations.map((rec) => (
                      <div
                        key={rec.id}
                        className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-blue-800/80 flex items-center justify-between gap-2 shadow-sm"
                      >
                        <div>
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white">{rec.title}</h5>
                          <p className="text-[10px] text-slate-500">Dept: <b>{rec.department}</b> | Expected Gain: <b className="text-emerald-600">+{rec.expectedHealthGain} Score Points</b></p>
                        </div>
                        <button
                          onClick={() => handleExecuteRecommendation(rec)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] shadow-sm shrink-0 flex items-center gap-1 transition-colors"
                        >
                          Execute <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              <span className="text-[10px] text-slate-400 block px-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic font-medium p-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-spin" /> SmartCity AI is querying PostGIS spatial database & ML model predictors...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Dynamic Context Suggestions */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {(DOMAIN_PROMPTS[activeDomain] || DOMAIN_PROMPTS.all).map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold transition-colors shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box with Voice Mic Button */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Mic Toggle */}
          <button
            type="button"
            onClick={toggleVoiceListening}
            className={`p-2.5 rounded-xl border transition-all ${isListening ? 'bg-red-500 text-white border-red-600 animate-pulse' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
            title={isListening ? "Listening... Click to stop" : "Click to speak via Speech-to-Text"}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening to your voice query..." : `Ask SmartCity AI about ${selectedWard} traffic, AQI, hospital beds...`}
            className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-sm transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default AIChatbot;
