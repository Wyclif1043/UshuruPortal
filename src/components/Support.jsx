// src/components/Support.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './layout/Sidebar';

const Support = () => {
  const { username } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('contacts');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Hello! I'm your Ushuru Investment assistant. How can I help you today? You can ask me about land plots, investments, contributions, or any other society-related queries.",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [isChatOpen]);

  const contactMethods = [
    {
      icon: 'fas fa-phone',
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      details: '+254 796 851 111',
      action: 'tel:+254796851111',
      color: '#10B981'
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email Support',
      description: 'Send us an email for detailed queries',
      details: 'info@uic.co.ke',
      action: 'mailto:info@uic.co.ke',
      color: '#3B82F6'
    },
    {
      icon: 'fab fa-whatsapp',
      title: 'WhatsApp',
      description: 'Chat with us on WhatsApp',
      details: '+254 796 851 111',
      action: 'https://whatsapp.com/channel/0029Vb6yu688vd1N05QCRX1m',
      color: '#25D366'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Visit Office',
      description: 'Come see us in person',
      details: '4th Floor, Ushuru Sacco Centre, Wood Avenue, Kilimani, Nairobi',
      action: '#',
      color: '#EF4444'
    }
  ];

  // const supportTeam = [
  //   {
  //     name: 'Helen Njeri',
  //     role: 'Customer Support Manager',
  //     email: 'info@uic.co.ke',
  //     phone: '+254 722 000 001',
  //     image: '/images/team1.jpg'
  //   },
  //   {
  //     name: '',
  //     role: 'Member Relations Officer',
  //     email: 'info@uic.co.ke',
  //     phone: '+254 722 000 002',
  //     image: '/images/team2.jpg'
  //   },
  //   {
  //     name: 'David Ochieng',
  //     role: 'Land & Investments Officer',
  //     email: 'david.ochieng@ushuruinvestment.co.ke',
  //     phone: '+254 722 000 003',
  //     image: '/images/team3.jpg'
  //   }
  // ];

  const faqs = [
    {
      question: "How do I book a land plot?",
      answer: "You can book a land plot through your member portal under the 'Investments' section. Select your preferred plot and follow the booking process."
    },
    {
      question: "What are the payment plans available?",
      answer: "We offer flexible payment plans including monthly installments, quarterly payments, and lump sum payments. Contact our support team for customized plans."
    },
    {
      question: "How can I check my contribution balance?",
      answer: "Your contribution balance is available in the 'Contributions' section of your member portal. You can also download monthly statements."
    },
    {
      question: "What documents do I need for land ownership?",
      answer: "You'll need your ID, KRA PIN, passport photos, and the signed agreement forms. Our team will guide you through the entire process."
    }
  ];

  const landInquiries = [
    "Available land plots and locations",
    "Land prices and payment plans",
    "Booking process and requirements",
    "Title deed processing timeline",
    "Infrastructure development plans",
    "Land transfer and resale policies"
  ];

  const chatbotResponses = {
    greetings: [
      "Hello! How can I assist you with Ushuru Investment today?",
      "Hi there! Welcome to Ushuru Investment support.",
      "Greetings! I'm here to help with your investment queries."
    ],
    land: {
      "available plots": "We have various land plots available in Kitengela, Machakos, and Juja. Would you like to know about specific locations?",
      "prices": "Land prices vary by location and plot size. Kitengela plots start from KES 500,000, Machakos from KES 350,000, and Juja from KES 600,000.",
      "booking": "To book a plot, visit the Investments section, select your preferred plot, and pay the booking fee of KES 50,000.",
      "payment plans": "We offer 6, 12, and 24-month payment plans. You can also get customized plans based on your financial capability.",
      "title deed": "Title deeds are processed within 3-6 months after completing payment. We handle all the legal processes for you.",
      "infrastructure": "All our projects include access roads, water connection, and electricity. Some locations also have perimeter fencing.",
      "default": "I can help you with land plot availability, prices, booking process, payment plans, and title deed information. What specific information do you need?"
    },
    contributions: {
      "balance": "You can check your contribution balance in the Contributions section of your portal.",
      "payment": "You can make contributions via M-Pesa, bank transfer, or at our office. Use your member number as reference.",
      "default": "I can help with contribution balances, payment methods, and statements."
    },
    general: {
      "membership": "To become a member, you need to be 18+ years, have a Kenyan ID, and pay the membership fee of KES 5,000.",
      "meetings": "We hold annual general meetings and quarterly member updates. Notifications are sent via SMS and email.",
      "default": "I understand you're asking about {query}. Let me connect you with our support team for more detailed assistance."
    }
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return chatbotResponses.greetings[Math.floor(Math.random() * chatbotResponses.greetings.length)];
    }

    // Land-related queries
    if (message.includes('land') || message.includes('plot') || message.includes('property')) {
      if (message.includes('available') || message.includes('location')) {
        return chatbotResponses.land["available plots"];
      } else if (message.includes('price') || message.includes('cost')) {
        return chatbotResponses.land["prices"];
      } else if (message.includes('book') || message.includes('reserve')) {
        return chatbotResponses.land["booking"];
      } else if (message.includes('payment') || message.includes('installment')) {
        return chatbotResponses.land["payment plans"];
      } else if (message.includes('title') || message.includes('deed')) {
        return chatbotResponses.land["title deed"];
      } else if (message.includes('road') || message.includes('water') || message.includes('electricity')) {
        return chatbotResponses.land["infrastructure"];
      } else {
        return chatbotResponses.land["default"];
      }
    }

    // Contribution queries
    if (message.includes('contribution') || message.includes('saving') || message.includes('deposit')) {
      if (message.includes('balance') || message.includes('check')) {
        return chatbotResponses.contributions["balance"];
      } else if (message.includes('pay') || message.includes('send')) {
        return chatbotResponses.contributions["payment"];
      } else {
        return chatbotResponses.contributions["default"];
      }
    }

    // General queries
    if (message.includes('member') || message.includes('join')) {
      return chatbotResponses.general["membership"];
    } else if (message.includes('meeting') || message.includes('agm')) {
      return chatbotResponses.general["meetings"];
    }

    // Default response
    return "I'm not sure I understand. Could you please rephrase your question? You can ask me about land plots, contributions, or general membership information.";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot typing
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        {/* Header */}
        <div className="support-header">
          <div className="header-content">
            <h1>Support Center</h1>
            <p>We're here to help you with any questions about your investments</p>
          </div>
          <div className="user-welcome">
            <span>Welcome, {username}</span>
          </div>
        </div>

        {/* Support Content */}
        <div className="support-content">
          {/* Tabs Navigation */}
          <div className="tabs-navigation">
            <button 
              className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
              onClick={() => setActiveTab('contacts')}
            >
              <i className="fas fa-address-book"></i>
              Contact Support
            </button>
            <button 
              className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              <i className="fas fa-question-circle"></i>
              FAQ
            </button>
            <button 
              className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => setActiveTab('team')}
            >
              <i className="fas fa-users"></i>
              Support Team
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div className="contacts-grid">
                {contactMethods.map((contact, index) => (
                  <div key={index} className="contact-card">
                    <div className="contact-icon" style={{ backgroundColor: contact.color + '20' }}>
                      <i className={contact.icon} style={{ color: contact.color }}></i>
                    </div>
                    <h3>{contact.title}</h3>
                    <p>{contact.description}</p>
                    <div className="contact-details">
                      <span>{contact.details}</span>
                    </div>
                    <a 
                      href={contact.action} 
                      className="contact-btn"
                      target={contact.action.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                    >
                      <i className={contact.icon}></i>
                      {contact.title.includes('WhatsApp') ? 'Start Chat' : 'Contact Now'}
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="faq-section">
                <div className="faq-list">
                  {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                      <div className="faq-question">
                        <h4>{faq.question}</h4>
                        <i className="fas fa-chevron-down"></i>
                      </div>
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div className="team-grid">
                {supportTeam.map((member, index) => (
                  <div key={index} className="team-card">
                    <div className="member-image">
                      <i className="fas fa-user-circle"></i>
                    </div>
                    <div className="member-info">
                      <h3>{member.name}</h3>
                      <p className="role">{member.role}</p>
                      <div className="contact-info">
                        <p><i className="fas fa-envelope"></i> {member.email}</p>
                        <p><i className="fas fa-phone"></i> {member.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chatbot Floating Button */}
        <button 
          className="chatbot-toggle"
          onClick={() => setIsChatOpen(true)}
        >
          <i className="fas fa-robot"></i>
          <span className="notification-dot"></span>
        </button>

        {/* Chatbot Modal */}
        {isChatOpen && (
          <div className="chatbot-modal">
            <div className="chatbot-header">
              <div className="chatbot-info">
                <div className="chatbot-avatar">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="chatbot-details">
                  <h3>Ushuru Assistant</h3>
                  <span className="status online">Online</span>
                </div>
              </div>
              <button 
                className="close-chat"
                onClick={() => setIsChatOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <div className="message-content">
                    <p>{message.text}</p>
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            <div className="quick-questions">
              <p>Quick questions about land:</p>
              <div className="question-chips">
                {landInquiries.map((question, index) => (
                  <button
                    key={index}
                    className="question-chip"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about land plots, contributions, or investments..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background-color: #f8fafc;
        }

        .main-content {
          flex: 1;
          margin-left: 300px;
          padding: 0;
          position: relative;
        }

        /* Header */
        .support-header {
          background: linear-gradient(135deg, #7A1F23 0%, #5a1519 100%);
          color: white;
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: bold;
        }

        .header-content p {
          margin: 0.5rem 0 0 0;
          opacity: 0.9;
        }

        .user-welcome {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.75rem 1.5rem;
          border-radius: 2rem;
          backdrop-filter: blur(10px);
        }

        /* Support Content */
        .support-content {
          padding: 2rem;
          max-width: 1200px;
        }

        /* Tabs */
        .tabs-navigation {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          font-size: 1rem;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab-btn:hover {
          color: #7A1F23;
        }

        .tab-btn.active {
          color: #7A1F23;
          border-bottom-color: #7A1F23;
        }

        /* Contacts Grid */
        .contacts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .contact-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .contact-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .contact-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .contact-icon i {
          font-size: 2rem;
        }

        .contact-card h3 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .contact-card p {
          margin: 0 0 1rem 0;
          color: #6b7280;
        }

        .contact-details {
          margin: 1.5rem 0;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.5rem;
        }

        .contact-details span {
          font-weight: 600;
          color: #1f2937;
        }

        .contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #7A1F23;
          color: white;
          text-decoration: none;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .contact-btn:hover {
          background: #5a1519;
          transform: translateY(-2px);
        }

        /* FAQ Section */
        .faq-item {
          background: white;
          border-radius: 1rem;
          margin-bottom: 1rem;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .faq-question {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          background: #f8fafc;
        }

        .faq-question h4 {
          margin: 0;
          color: #1f2937;
        }

        .faq-answer {
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb;
          background: white;
        }

        .faq-answer p {
          margin: 0;
          color: #6b7280;
          line-height: 1.6;
        }

        /* Team Grid */
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .team-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .member-image {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7A1F23;
          font-size: 2.5rem;
        }

        .member-info h3 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .role {
          margin: 0 0 1rem 0;
          color: #7A1F23;
          font-weight: 600;
        }

        .contact-info p {
          margin: 0.25rem 0;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Chatbot */
        .chatbot-toggle {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7A1F23, #5a1519);
          color: white;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(122, 31, 35, 0.3);
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .chatbot-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(122, 31, 35, 0.4);
        }

        .notification-dot {
          position: absolute;
          top: 0;
          right: 0;
          width: 12px;
          height: 12px;
          background: #10B981;
          border-radius: 50%;
          border: 2px solid white;
        }

        /* Chatbot Modal */
        .chatbot-modal {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 400px;
          height: 600px;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 10px 50px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          z-index: 1001;
          overflow: hidden;
        }

        .chatbot-header {
          padding: 1.5rem;
          background: linear-gradient(135deg, #7A1F23, #5a1519);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chatbot-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .chatbot-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chatbot-details h3 {
          margin: 0;
          font-size: 1.1rem;
        }

        .status {
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .status.online:before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #10B981;
          border-radius: 50%;
          margin-right: 0.5rem;
        }

        .close-chat {
          background: none;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .chat-messages {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          background: #f8fafc;
        }

        .message {
          margin-bottom: 1rem;
          display: flex;
        }

        .user-message {
          justify-content: flex-end;
        }

        .bot-message {
          justify-content: flex-start;
        }

        .message-content {
          max-width: 80%;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          position: relative;
        }

        .user-message .message-content {
          background: #7A1F23;
          color: white;
          border-bottom-right-radius: 0.25rem;
        }

        .bot-message .message-content {
          background: white;
          color: #1f2937;
          border: 1px solid #e5e7eb;
          border-bottom-left-radius: 0.25rem;
        }

        .message-time {
          font-size: 0.7rem;
          opacity: 0.7;
          display: block;
          margin-top: 0.25rem;
        }

        .quick-questions {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
          background: white;
        }

        .quick-questions p {
          margin: 0 0 0.5rem 0;
          font-size: 0.8rem;
          color: #6b7280;
        }

        .question-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .question-chip {
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .question-chip:hover {
          background: #7A1F23;
          color: white;
        }

        .chat-input {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 0.5rem;
          background: white;
        }

        .chat-input input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 2rem;
          outline: none;
        }

        .chat-input input:focus {
          border-color: #7A1F23;
        }

        .chat-input button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #7A1F23;
          color: white;
          border: none;
          cursor: pointer;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .main-content {
            margin-left: 0;
          }

          .support-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .chatbot-modal {
            width: 350px;
            height: 500px;
          }
        }

        @media (max-width: 768px) {
          .support-content {
            padding: 1rem;
          }

          .tabs-navigation {
            flex-direction: column;
          }

          .contacts-grid {
            grid-template-columns: 1fr;
          }

          .team-grid {
            grid-template-columns: 1fr;
          }

          .chatbot-modal {
            width: 100%;
            height: 100%;
            bottom: 0;
            right: 0;
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Support;