// import React, { useState, useRef, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Send, Bot, X, MessageCircle, ChevronDown } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// interface Message {
//   id: string;
//   text: string;
//   sender: 'user' | 'bot';
//   timestamp: Date;
// }

// interface ChatbotConfig {
//   welcomeMessage: string;
//   knowledgeBase: {
//     question: string;
//     answer: string;
//     keywords: string[];
//   }[];
//   fallbackResponse: string;
// }

// const defaultConfig: ChatbotConfig = {
//   welcomeMessage: "👋 Hello! I'm your Business Card Design Assistant. I can help you with:\n• Available templates\n• Pricing & packages\n• Delivery timeline\n• Order process\n• Payment options\n\nWhat would you like to know?",
  
//   knowledgeBase: [
//     {
//       question: "How do I buy a business card?",
//       answer: "To buy a business card:\n1. Browse and select a template\n2. Fill your details (name, contact, etc.)\n3. Choose quantity.\n4. Make payment\n5. We'll print and deliver your cards\n\nNote: You cannot edit templates - you can only select from available designs.",
//       keywords: ["create", "buy", "purchase", "order", "how to", "process", "get", "obtain"]
//     },
//     {
//       question: "Can I edit the template?",
//       answer: "❌ No, you cannot edit or customize templates.\n\nYou can only:\n✓ Select from available templates\n✓ Fill your personal details\n✓ Select quantity\n\nAll designs are pre-made and cannot be modified.",
//       keywords: ["edit", "customize", "modify", "change", "design", "template", "alter", "adjust"]
//     },
//     {
//       question: "How long is delivery?",
//       answer: "📦 Delivery takes 6-7 working days:\n• Processing: 1-2 days\n• Printing: 2-3 days\n• Shipping: 2-3 days\n\nTotal: 6-7 working days from order confirmation.\nWe deliver across India.",
//       keywords: ["delivery", "shipping", "time", "how long", "arrive", "reach", "days", "duration", "when"]
//     },
//     {
//       question: "What templates are available?",
//       answer: "We offer 3 template types:\n•All are Premium Templates: ₹299 design fee started.\n Available templates for various business. Contact if you want any specific card.\n\nYou can only BUY templates, not edit them.",
//       keywords: ["templates", "designs", "styles", "available", "types", "options", "varieties"]
//     },
//     {
//       question: "What are the prices?",
//       answer: "Our pricing:\n•All are Premium Templates: Started from ₹299 + printing\n• Printing (100 cards):\n  - 15% discount \n• Bulk (500+): 25% discount\n\nAll prices include GST.",
//       keywords: ["price", "cost", "pricing", "how much", "expensive", "cheap", "rate", "charges"]
//     },
//     {
//       question: "Can I download the template?",
//       answer: "❌ No, you cannot download templates.\n\nYou can only:\n✓ Purchase physical printed cards\n✓ We handle all printing\n✓ No digital downloads\n\nWe professionally print before shipping.",
//       keywords: ["download", "digital", "file", "pdf", "image", "print", "save", "copy"]
//     },
//     {
//       question: "Can I upload my own logo?",
//       answer: "Yes, you can upload logos.\n\nOur templates come pre-designed.",
//       keywords: ["logo", "upload", "image", "picture", "brand", "company", "own", "personal"]
//     },
//     {
//       question: "What Card quality is available?",
//       answer: "We offer PVC Cards",
//       keywords: ["Paper", "quality", "thick", "material", "finish", "glossy", "matte", "gsm"]
//     },
//     {
//       question: "How do I make payment?",
//       answer: "Payment options:\n✓ Credit/Debit Cards\n✓ UPI\n✓ Net Banking\n\nPayment required before printing starts.",
//       keywords: ["payment", "pay", "money", "buy", "checkout", "card", "upi", "paypal"]
//     },
//     {
//       question: "What is the return policy?",
//       answer: "Return Policy:\n✓ Full refund if not printed\n✓ 50% refund if printing started\n✓ No refund after shipping\n✓ Damaged cards: free reprint\n\nContact support@yourbrand.com.",
//       keywords: ["return", "refund", "cancel", "policy", "money back", "guarantee", "warranty"]
//     },
//     {
//       question: "Do you deliver internationally?",
//       answer: "🌍 International Delivery:\n• Currently Unvailable for International Delivery.\n• If you want Contact Us\n\nIndia: 6-7 working days.",
//       keywords: ["international", "abroad", "overseas", "country", "worldwide", "global"]
//     },
//     {
//       question: "Can I see samples?",
//       answer: "📸 Sample Policy:\n• Digital preview only\n• No physical samples\n• Preview on website\n• Trusted by 5000+ customers\n\nNo physical samples due to costs.",
//       keywords: ["sample", "preview", "see", "before", "buying", "try", "test", "example"]
//     },
//     {
//       question: "How many cards should I order?",
//       answer: "Recommended quantities:\n• Startups: 100 cards\n• Professionals: 200-300 cards\n• Businesses: 500+ cards (15% discount)\n\nMost customers order 100-200 cards.",
//       keywords: ["how many", "quantity", "cards", "order", "number", "count", "amount"]
//     },
//     {
//       question: "What information do I need to provide?",
//       answer: "Required information:\n✓ Full name\n✓ Job title/position\n✓ Company name\n✓ Phone number\n✓ Email address\n✓ Website (optional)\n✓ Social media (optional)\n\nFill details in order form.",
//       keywords: ["information", "details", "provide", "need", "required", "data", "fill"]
//     },
//     {
//       question: "Can I track my order?",
//       answer: "📱 Order Tracking:\n✓ Tracking number provided\n✓ SMS/email updates\n✓ Track on our website\n✓ Customer support: +91 98765 43210\n\nYou'll receive tracking after shipping.",
//       keywords: ["track", "tracking", "order status", "where", "location", "delivery status"]
//     },
//     {
//       question: "What if I provide wrong address?",
//       answer: "⚠️ Address Policy:\n• Wrong address = No refund\n• Address changes allowed before printing\n• Double-check address before payment\n• Contact immediately if mistake found\n\nWe're not responsible for wrong addresses.",
//       keywords: ["address", "wrong", "mistake", "change", "correct", "location", "delivery address"]
//     }
//   ],
  
//   fallbackResponse: "I can answer questions about:\n1. Templates & designs\n2. Pricing & packages\n3. Delivery (6-7 days)\n4. Order process\n5. Payment options\n6. Return policy\n\nFor specific questions, email support@gmail.com"
// };

// const AIChatbot: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       text: defaultConfig.welcomeMessage,
//       sender: 'bot',
//       timestamp: new Date()
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//    const [showWelcomePopup, setShowWelcomePopup] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const popupTimerRef = useRef<NodeJS.Timeout | null>(null);

// useEffect(() => {
//     // Popup sirf first time page load pe show karo
//     const hasSeenPopup = localStorage.getItem('chatbot_popup_seen');
    
//     if (!hasSeenPopup) {
//       // 2 second baad popup dikhao
//       const timer = setTimeout(() => {
//         setShowWelcomePopup(true);
//       }, 2000);
      
//       return () => clearTimeout(timer);
//     }
//   }, []);

//   // Popup auto close after 8 seconds
//   useEffect(() => {
//     if (showWelcomePopup) {
//       const timer = setTimeout(() => {
//         setShowWelcomePopup(false);
//         localStorage.setItem('chatbot_popup_seen', 'true');
//       }, 8000);
      
//       return () => clearTimeout(timer);
//     }
//   }, [showWelcomePopup]);




//   // Auto scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Focus input when chat opens
//   useEffect(() => {
//     if (isOpen && inputRef.current) {
//       setTimeout(() => inputRef.current?.focus(), 300);
//     }
//   }, [isOpen]);

//   // Improved matching algorithm
//   const findBestAnswer = (question: string): string => {
//     const lowerQuestion = question.toLowerCase().trim();
    
//     // Remove common words for better matching
//     const stopWords = ['what', 'how', 'can', 'do', 'is', 'are', 'the', 'a', 'an', 'and', 'for', 'of', 'to', 'in'];
//     const questionWords = lowerQuestion.split(' ').filter(word => 
//       !stopWords.includes(word) && word.length > 2
//     );
    
//     let bestMatch = null;
//     let highestScore = 0;

//     // Score each knowledge base item
//     defaultConfig.knowledgeBase.forEach(item => {
//       let score = 0;
      
//       // Exact question match
//       if (lowerQuestion.includes(item.question.toLowerCase())) {
//         score += 100;
//       }
      
//       // Check each keyword
//       item.keywords.forEach(keyword => {
//         const keywordLower = keyword.toLowerCase();
        
//         // Exact keyword match
//         if (lowerQuestion.includes(keywordLower)) {
//           score += 5;
//         }
        
//         // Partial keyword match
//         if (keywordLower.length > 3) {
//           questionWords.forEach(word => {
//             if (word.includes(keywordLower) || keywordLower.includes(word)) {
//               score += 3;
//             }
//           });
//         }
//       });
      
//       // Check for synonyms and variations
//       const synonymPatterns: Record<string, string[]> = {
//         edit: ['change', 'modify', 'customize', 'alter', 'adjust'],
//         delivery: ['shipping', 'dispatch', 'time', 'duration', 'arrive', 'when'],
//         template: ['design', 'layout', 'style', 'format'],
//         price: ['cost', 'pricing', 'how much', 'rate', 'charges']
//       };
      
//       Object.entries(synonymPatterns).forEach(([mainWord, synonyms]) => {
//         if (item.keywords.some(k => k.toLowerCase() === mainWord)) {
//           if (synonyms.some(syn => lowerQuestion.includes(syn))) {
//             score += 4;
//           }
//         }
//       });
      
//       if (score > highestScore) {
//         highestScore = score;
//         bestMatch = item;
//       }
//     });

//     // If we have a good match
//     if (bestMatch && highestScore >= 3) {
//       return bestMatch.answer;
//     }

//     // Check for common phrases
//     const commonPhrases = [
//       { 
//         patterns: [/can i edit/, /can i customize/, /can i change/, /edit.*template/, /customize.*template/], 
//         response: "❌ No, you cannot edit or customize templates. You can only select from available designs and fill your details."
//       },
//       { 
//         patterns: [/how long.*delivery/, /delivery.*time/, /when.*arrive/, /shipping.*time/, /delivery.*days/], 
//         response: "📦 Delivery takes 6-7 working days from order confirmation. We deliver across India."
//       },
//       { 
//         patterns: [/hello|hi|hey|h/, /good morning|good afternoon|good evening/], 
//         response: "👋 Hello! I'm your Business Card Assistant. How can I help you today?"
//       },
//       { 
//         patterns: [/thank|thanks|thank you/], 
//         response: "You're welcome! 😊 Let me know if you need any more help."
//       },
//       { 
//         patterns: [/bye|goodbye|see you/], 
//         response: "Goodbye! Feel free to come back if you have more questions. 👋"
//       },
//       { 
//         patterns: [/help|what can you do|help me/], 
//         response: defaultConfig.welcomeMessage
//       }
//     ];

//     for (const phrase of commonPhrases) {
//       for (const pattern of phrase.patterns) {
//         if (pattern.test(lowerQuestion)) {
//           return phrase.response;
//         }
//       }
//     }

//     return defaultConfig.fallbackResponse;
//   };

//   const handleSend = () => {
//     if (!input.trim()) return;

//     // Add user message
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       text: input,
//       sender: 'user',
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsTyping(true);

//     // Simulate typing delay
//     setTimeout(() => {
//       const botResponse = findBestAnswer(input);
      
//       const botMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         text: botResponse,
//         sender: 'bot',
//         timestamp: new Date()
//       };

//       setMessages(prev => [...prev, botMessage]);
//       setIsTyping(false);
//     }, 800);
//   };

//   const handleQuickQuestion = (question: string) => {
//     setInput(question);
//     setTimeout(() => handleSend(), 100);
//   };

//   // Updated quick questions
//   const quickQuestions = [
//     "Can I edit the template?",
//     "How long is delivery?",
//     "What are the prices?",
//     "How do I buy?"
//   ];

//   // Toggle chatbot
//   const toggleChatbot = () => setIsOpen(!isOpen);

//   return (
//     <>
//       {/* Chatbot Toggle Button */}
//       <motion.button
//         onClick={toggleChatbot}
//         className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group"
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.95 }}
//         aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
//       >
//         <div className="relative">
//           {isOpen ? (
//             <X className="w-7 h-7" />
//           ) : (
//             <MessageCircle className="w-7 h-7" />
//           )}
//           {!isOpen && (
//             <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
//           )}
//         </div>
//         <span className="absolute right-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//           {isOpen ? "Close chat" : "Need help?"}
//         </span>
//       </motion.button>


// {/* Welcome Popup Notification */}
// <AnimatePresence>
//   {showWelcomePopup && !isOpen && (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.8, y: 10 }}
//       animate={{ opacity: 1, scale: 1, y: 0 }}
//       exit={{ opacity: 0, scale: 0.8, y: 10 }}
//       className="fixed bottom-24 right-20 z-50"
//       onClick={() => setShowWelcomePopup(false)}
//     >
//       {/* Popup Bubble */}
//       <div className="relative">
//         {/* Tail/Arrow */}
//         <div className="absolute -right-1 bottom-3 w-4 h-4 bg-white transform rotate-45"></div>
        
//         {/* Popup Content */}
//         <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-[280px]">
//           <div className="flex items-start gap-3">
//             <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
//               <Bot className="w-5 h-5 text-white" />
//             </div>
//             <div className="flex-1">
//               <div className="flex justify-between items-start">
//                 <h4 className="font-bold text-gray-800 text-sm">May I help you? 🤖</h4>
//                 <button 
//                   onClick={() => setShowWelcomePopup(false)}
//                   className="text-gray-400 hover:text-gray-600 ml-2"
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </div>
//               <p className="text-xs text-gray-600 mt-1">
//                 I'm your AI assistant! I can answer questions about business cards, pricing, delivery, and more.
//               </p>
//               <div className="flex items-center gap-2 mt-3">
//                 <button
//                   onClick={() => {
//                     setShowWelcomePopup(false);
//                     setIsOpen(true);
//                   }}
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs px-3 py-1.5 rounded-full transition-colors font-medium flex-1"
//                 >
//                   Ask a question
//                 </button>
//                 <button
//                   onClick={() => setShowWelcomePopup(false)}
//                   className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1.5"
//                 >
//                   Maybe later
//                 </button>
//               </div>
//             </div>
//           </div>
          
//           {/* Close indicator */}
//           <div className="text-[10px] text-gray-400 text-center mt-2">
//             Click outside to close
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   )}
// </AnimatePresence>




//       {/* Chatbot Modal */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: 20, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 20, scale: 0.95 }}
//             className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
//             role="dialog"
//             aria-label="Chatbot assistant"
//             aria-modal="true"
//           >
//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-white/20 p-2 rounded-full">
//                     <Bot className="w-6 h-6" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-lg">Business Card Assistant</h3>
//                     <div className="flex items-center gap-1 text-xs opacity-90">
//                       <span className="bg-white/20 px-1.5 py-0.5 rounded">AI-powered</span>
//                       <span>•</span>
//                       <span>{defaultConfig.knowledgeBase.length} topics covered</span>
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setIsOpen(false)}
//                   className="hover:bg-white/20 p-2 rounded-full transition-colors"
//                   aria-label="Close chatbot"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             {/* Quick Questions Section - FIXED VISIBILITY */}
//             <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
//               <div className="flex items-center justify-between mb-3">
//                 <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
//                   <span className="bg-blue-100 text-blue-700 p-1 rounded">💬</span>
//                   Common Questions
//                 </h4>
//                 <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full">
//                   Click to ask
//                 </span>
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 {quickQuestions.map((q, i) => (
//                   <motion.button
//                     key={i}
//                     onClick={() => handleQuickQuestion(q)}
//                     className="text-xs bg-white border border-gray-200 hover:border-blue-400 hover:bg-white text-gray-700 px-3 py-2.5 rounded-lg transition-all shadow-sm hover:shadow text-left"
//                     whileHover={{ scale: 1.02, y: -1 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <span className="font-medium text-gray-800">{q}</span>
//                   </motion.button>
//                 ))}
//               </div>
//             </div>

//             {/* Chat Messages */}
//             <div className="flex-1 p-4 overflow-y-auto h-[calc(100%-210px)] bg-gradient-to-b from-gray-50 to-white">
//               <div className="space-y-4">
//                 {messages.map((msg) => (
//                   <motion.div
//                     key={msg.id}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div
//                       className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${msg.sender === 'user'
//                           ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
//                           : 'bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow'
//                         }`}
//                     >
//                       <div className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</div>
//                       <div className={`text-xs mt-2 flex items-center gap-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
//                         <span className="font-medium">{msg.sender === 'user' ? 'You' : 'Assistant'}</span>
//                         <span>•</span>
//                         <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
                
//                 {isTyping && (
//                   <div className="flex justify-start">
//                     <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow">
//                       <div className="flex items-center gap-3">
//                         <div className="flex gap-1.5">
//                           <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse"></div>
//                           <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
//                           <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
//                         </div>
//                         <span className="text-xs text-gray-600 font-medium">Thinking...</span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 <div ref={messagesEndRef} />
//               </div>
//             </div>

//             {/* Input Area */}
//             <div className="border-t p-4 bg-white">
//               <div className="flex gap-2">
//                 <input
//                   ref={inputRef}
//                   type="text"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//                   placeholder="Ask about business cards (e.g., 'can I edit?', 'delivery time?')..."
//                   className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                   disabled={isTyping}
//                   aria-label="Type your question"
//                 />
//                 <Button
//                   onClick={handleSend}
//                   disabled={!input.trim() || isTyping}
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full px-6 min-w-[60px] shadow"
//                   aria-label="Send message"
//                 >
//                   <Send className="w-4 h-4" />
//                 </Button>
//               </div>
             
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Backdrop */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/20 z-40"
//           onClick={() => setIsOpen(false)}
//           aria-hidden="true"
//         />
//       )}
//     </>
//   );
// };

// export default AIChatbot;




import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Send, Bot, X, MessageCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotConfig {
  welcomeMessage: string;
  knowledgeBase: {
    question: string;
    answer: string;
    keywords: string[];
  }[];
  fallbackResponse: string;
}

const defaultConfig: ChatbotConfig = {
  welcomeMessage: "👋 Hello! I'm your Business Card Design Assistant. I can help you with:\n• Available templates\n• Pricing & packages\n• Delivery timeline\n• Order process\n• Payment options\n\nWhat would you like to know?",
  
  knowledgeBase: [
    {
      question: "How do I buy a business card?",
      answer: "To buy a business card:\n1. Browse and select a template\n2. Fill your details (name, contact, etc.)\n3. Choose quantity.\n4. Make payment\n5. We'll print and deliver your cards\n\nNote: You cannot edit templates - you can only select from available designs.",
      keywords: ["create", "buy", "purchase", "order", "how to", "process", "get", "obtain"]
    },
    {
      question: "Can I edit the template?",
      answer: "❌ No, you cannot edit or customize templates.\n\nYou can only:\n✓ Select from available templates\n✓ Fill your personal details\n✓ Select quantity\n\nAll designs are pre-made and cannot be modified.",
      keywords: ["edit", "customize", "modify", "change", "design", "template", "alter", "adjust"]
    },
    {
      question: "How long is delivery?",
      answer: "📦 Delivery takes 6-7 working days:\n• Processing: 1-2 days\n• Printing: 2-3 days\n• Shipping: 2-3 days\n\nTotal: 6-7 working days from order confirmation.\nWe deliver across India.",
      keywords: ["delivery", "shipping", "time", "how long", "arrive", "reach", "days", "duration", "when"]
    },
    {
      question: "What templates are available?",
      answer: "We offer 3 template types:\n•All are Premium Templates: ₹299 design fee started.\n Available templates for various business. Contact if you want any specific card.\n\nYou can only BUY templates, not edit them.",
      keywords: ["templates", "designs", "styles", "available", "types", "options", "varieties"]
    },
    {
      question: "What are the prices?",
      answer: "Our pricing:\n•All are Premium Templates: Started from ₹299 + printing\n• Printing (100 cards):\n  - 15% discount \n• Bulk (500+): 25% discount\n\nAll prices include GST.",
      keywords: ["price", "cost", "pricing", "how much", "expensive", "cheap", "rate", "charges"]
    },
    {
      question: "Can I download the template?",
      answer: "❌ No, you cannot download templates.\n\nYou can only:\n✓ Purchase physical printed cards\n✓ We handle all printing\n✓ No digital downloads\n\nWe professionally print before shipping.",
      keywords: ["download", "digital", "file", "pdf", "image", "print", "save", "copy"]
    },
    {
      question: "Can I upload my own logo?",
      answer: "Yes, you can upload logos.\n\nOur templates come pre-designed.",
      keywords: ["logo", "upload", "image", "picture", "brand", "company", "own", "personal"]
    },
    {
      question: "What Card quality is available?",
      answer: "We offer PVC Cards",
      keywords: ["Paper", "quality", "thick", "material", "finish", "glossy", "matte", "gsm"]
    },
    {
      question: "How do I make payment?",
      answer: "Payment options:\n✓ Credit/Debit Cards\n✓ UPI\n✓ Net Banking\n\nPayment required before printing starts.",
      keywords: ["payment", "pay", "money", "buy", "checkout", "card", "upi", "paypal"]
    },
    {
      question: "What is the return policy?",
      answer: "Return Policy:\n✓ Full refund if not printed\n✓ 50% refund if printing started\n✓ No refund after shipping\n✓ Damaged cards: free reprint\n\nContact support@yourbrand.com.",
      keywords: ["return", "refund", "cancel", "policy", "money back", "guarantee", "warranty"]
    },
    {
      question: "Do you deliver internationally?",
      answer: "🌍 International Delivery:\n• Currently Unvailable for International Delivery.\n• If you want Contact Us\n\nIndia: 6-7 working days.",
      keywords: ["international", "abroad", "overseas", "country", "worldwide", "global"]
    },
    {
      question: "Can I see samples?",
      answer: "📸 Sample Policy:\n• Digital preview only\n• No physical samples\n• Preview on website\n• Trusted by 5000+ customers\n\nNo physical samples due to costs.",
      keywords: ["sample", "preview", "see", "before", "buying", "try", "test", "example"]
    },
    {
      question: "How many cards should I order?",
      answer: "Recommended quantities:\n• Startups: 100 cards\n• Professionals: 200-300 cards\n• Businesses: 500+ cards (15% discount)\n\nMost customers order 100-200 cards.",
      keywords: ["how many", "quantity", "cards", "order", "number", "count", "amount"]
    },
    {
      question: "What information do I need to provide?",
      answer: "Required information:\n✓ Full name\n✓ Job title/position\n✓ Company name\n✓ Phone number\n✓ Email address\n✓ Website (optional)\n✓ Social media (optional)\n\nFill details in order form.",
      keywords: ["information", "details", "provide", "need", "required", "data", "fill"]
    },
    {
      question: "Can I track my order?",
      answer: "📱 Order Tracking:\n✓ Tracking number provided\n✓ SMS/email updates\n✓ Track on our website\n✓ Customer support: +91 98765 43210\n\nYou'll receive tracking after shipping.",
      keywords: ["track", "tracking", "order status", "where", "location", "delivery status"]
    },
    {
      question: "What if I provide wrong address?",
      answer: "⚠️ Address Policy:\n• Wrong address = No refund\n• Address changes allowed before printing\n• Double-check address before payment\n• Contact immediately if mistake found\n\nWe're not responsible for wrong addresses.",
      keywords: ["address", "wrong", "mistake", "change", "correct", "location", "delivery address"]
    }
  ],
  
  fallbackResponse: "I can answer questions about:\n1. Templates & designs\n2. Pricing & packages\n3. Delivery (6-7 days)\n4. Order process\n5. Payment options\n6. Return policy\n\nFor specific questions, email support@gmail.com"
};

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: defaultConfig.welcomeMessage,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Auto show popup on page load for 10 seconds
  useEffect(() => {
    // Sirf first time page load pe show karo
    const hasSeenPopup = sessionStorage.getItem('chatbot_initial_popup_seen');
    
    if (!hasSeenPopup) {
      // 1 second baad popup dikhao
      const timer = setTimeout(() => {
        setShowWelcomePopup(true);
        
        // 10 seconds baad auto close
        const autoCloseTimer = setTimeout(() => {
          setShowWelcomePopup(false);
          sessionStorage.setItem('chatbot_initial_popup_seen', 'true');
        }, 10000); // 10 seconds
      
        popupTimerRef.current = autoCloseTimer;
      }, 1000); // 1 second delay
      
      return () => {
        clearTimeout(timer);
        if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
      };
    }
  }, []);

  // Handle hover on chatbot icon
  const handleMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    hoverTimerRef.current = setTimeout(() => {
      setIsHovering(false);
    }, 300); // Small delay to prevent flickering
  };

  // Show popup on hover (if chat is not open)
  useEffect(() => {
    if (isHovering && !isOpen) {
      setShowWelcomePopup(true);
    } else if (!isHovering && !isOpen) {
      // Small delay before hiding on mouse leave
      const timer = setTimeout(() => {
        setShowWelcomePopup(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
    
    // Chat open hone par popup hide karo
    if (isOpen) {
      setShowWelcomePopup(false);
    }
  }, [isHovering, isOpen]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  // Improved matching algorithm
  const findBestAnswer = (question: string): string => {
    const lowerQuestion = question.toLowerCase().trim();
    
    // Remove common words for better matching
    const stopWords = ['what', 'how', 'can', 'do', 'is', 'are', 'the', 'a', 'an', 'and', 'for', 'of', 'to', 'in'];
    const questionWords = lowerQuestion.split(' ').filter(word => 
      !stopWords.includes(word) && word.length > 2
    );
    
    let bestMatch = null;
    let highestScore = 0;

    // Score each knowledge base item
    defaultConfig.knowledgeBase.forEach(item => {
      let score = 0;
      
      // Exact question match
      if (lowerQuestion.includes(item.question.toLowerCase())) {
        score += 100;
      }
      
      // Check each keyword
      item.keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        
        // Exact keyword match
        if (lowerQuestion.includes(keywordLower)) {
          score += 5;
        }
        
        // Partial keyword match
        if (keywordLower.length > 3) {
          questionWords.forEach(word => {
            if (word.includes(keywordLower) || keywordLower.includes(word)) {
              score += 3;
            }
          });
        }
      });
      
      // Check for synonyms and variations
      const synonymPatterns: Record<string, string[]> = {
        edit: ['change', 'modify', 'customize', 'alter', 'adjust'],
        delivery: ['shipping', 'dispatch', 'time', 'duration', 'arrive', 'when'],
        template: ['design', 'layout', 'style', 'format'],
        price: ['cost', 'pricing', 'how much', 'rate', 'charges']
      };
      
      Object.entries(synonymPatterns).forEach(([mainWord, synonyms]) => {
        if (item.keywords.some(k => k.toLowerCase() === mainWord)) {
          if (synonyms.some(syn => lowerQuestion.includes(syn))) {
            score += 4;
          }
        }
      });
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    });

    // If we have a good match
    if (bestMatch && highestScore >= 3) {
      return bestMatch.answer;
    }

    // Check for common phrases
    const commonPhrases = [
      { 
        patterns: [/can i edit/, /can i customize/, /can i change/, /edit.*template/, /customize.*template/], 
        response: "❌ No, you cannot edit or customize templates. You can only select from available designs and fill your details."
      },
      { 
        patterns: [/how long.*delivery/, /delivery.*time/, /when.*arrive/, /shipping.*time/, /delivery.*days/], 
        response: "📦 Delivery takes 6-7 working days from order confirmation. We deliver across India."
      },
      { 
        patterns: [/hello|hi|hey|h/, /good morning|good afternoon|good evening/], 
        response: "👋 Hello! I'm your Business Card Assistant. How can I help you today?"
      },
      { 
        patterns: [/thank|thanks|thank you/], 
        response: "You're welcome! 😊 Let me know if you need any more help."
      },
      { 
        patterns: [/bye|goodbye|see you/], 
        response: "Goodbye! Feel free to come back if you have more questions. 👋"
      },
      { 
        patterns: [/help|what can you do|help me/], 
        response: defaultConfig.welcomeMessage
      }
    ];

    for (const phrase of commonPhrases) {
      for (const pattern of phrase.patterns) {
        if (pattern.test(lowerQuestion)) {
          return phrase.response;
        }
      }
    }

    return defaultConfig.fallbackResponse;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = findBestAnswer(input);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  // Updated quick questions
  const quickQuestions = [
    "Can I edit the template?",
    "How long is delivery?",
    "What are the prices?",
    "How do I buy?"
  ];

  // Toggle chatbot
  const toggleChatbot = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={toggleChatbot}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        <div className="relative">
          {isOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <MessageCircle className="w-7 h-7" />
          )}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </div>
        <span className="absolute right-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {isOpen ? "Close chat" : "Need help?"}
        </span>
      </motion.button>

      {/* Welcome Popup Notification */}
      <AnimatePresence>
        {showWelcomePopup && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="fixed bottom-24 right-24 z-50"
            onClick={(e) => {
              e.stopPropagation();
              setShowWelcomePopup(false);
            }}
          >
            {/* Popup Bubble */}
            <div className="relative">
              {/* Tail/Arrow pointing to chatbot icon */}
              <div className="absolute -right-2 bottom-4 w-4 h-4 bg-white transform rotate-45"></div>
              
              {/* Popup Content - Simpler version */}
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-[240px]">
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-800 text-sm">May I help you? 🤖</h4>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowWelcomePopup(false);
                        }}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Ask me anything about business cards!
                    </p>
                    {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowWelcomePopup(false);
                        setIsOpen(true);
                      }}
                      className="mt-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs px-3 py-1.5 rounded-full transition-colors font-medium"
                    >
                      Open Chat
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
            role="dialog"
            aria-label="Chatbot assistant"
            aria-modal="true"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Business Card Assistant</h3>
                    <div className="flex items-center gap-1 text-xs opacity-90">
                      <span className="bg-white/20 px-1.5 py-0.5 rounded">AI-powered</span>
                      <span>•</span>
                      <span>{defaultConfig.knowledgeBase.length} topics covered</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-2 rounded-full transition-colors"
                  aria-label="Close chatbot"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Questions Section */}
            <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 p-1 rounded">💬</span>
                  Common Questions
                </h4>
                <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full">
                  Click to ask
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((q, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-xs bg-white border border-gray-200 hover:border-blue-400 hover:bg-white text-gray-700 px-3 py-2.5 rounded-lg transition-all shadow-sm hover:shadow text-left"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium text-gray-800">{q}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto h-[calc(100%-210px)] bg-gradient-to-b from-gray-50 to-white">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${msg.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow'
                        }`}
                    >
                      <div className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</div>
                      <div className={`text-xs mt-2 flex items-center gap-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                        <span className="font-medium">{msg.sender === 'user' ? 'You' : 'Assistant'}</span>
                        <span>•</span>
                        <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse"></div>
                          <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <span className="text-xs text-gray-600 font-medium">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t p-4 bg-white">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about business cards (e.g., 'can I edit?', 'delivery time?')..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={isTyping}
                  aria-label="Type your question"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full px-6 min-w-[60px] shadow"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default AIChatbot;