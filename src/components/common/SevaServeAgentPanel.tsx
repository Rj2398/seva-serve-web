"use client";
import React, { useState } from 'react'

const SevaServeAgentPanel = () => {

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      text: 'What service do I need for a water leakage?',
      type: 'text'
    },
    {
      id: 2,
      sender: 'agent',
      text: "It looks like you're facing a water leakage issue. To help you better, I need a bit more info.",
      type: 'options',
      options: ['Bathroom Leakage', 'Tap Leakage', 'Toilet Leakage', 'Wall Seepage', 'Pipe Joint Leakage']
    },
    {
      id: 3,
      sender: 'user',
      text: 'Bathroom Leakage',
      type: 'text'
    },
    {
      id: 4,
      sender: 'agent',
      text: 'Great! Describe the issue briefly so we can understand better.',
      type: 'text'
    },
    {
      id: 5,
      sender: 'user',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: '/images/home/img-agent-pic.svg', // Optional image
      type: 'text'
    },
    {
      id: 6,
      sender: 'agent',
      text: 'I’ve analyzed the image. It seems related to Pipe Joint Leakage.',
      link: { text: 'View Details', url: 'issue-details.html' },
      type: 'text'
    }
  ]);

  const initialServices = [
    { label: 'Plumbing', icon: '/images/home/top-right-plumbing.svg' },
    { label: 'Cleaning', icon: '/images/home/top-right-plumbing.svg' },
    { label: 'Furniture Work', icon: '/images/home/top-right-plumbing.svg' },
    { label: 'Laundry', icon: '/images/home/top-right-plumbing.svg' },
    { label: 'Painting', icon: '/images/home/top-right-plumbing.svg' }
  ];


  const suggestedQuestions = [
    'What service do I need for a water leakage?',
    'How can I book a deep cleaning service?',
    'Do you provide same-day laundry setup?',
    'What is the cost for wall painting?',
    'Emergency plumbing service available?'
  ];


  const [inputValue, setInputValue] = useState('');
const [editingMessageId, setEditingMessageId] = useState(null); // Track kaunsa message edit ho rha h
  const [editingText, setEditingText] = useState('');


const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // <-- Ye line page refresh rokti hai
    
    if (!inputValue.trim()) return;

    // 1. User ka message state mein add karo
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue
    };

    setMessages((prevMessages: any[]) => [...prevMessages, userMessage]);
    setInputValue(''); // Input box clear karo

    // 2. Fake API Response (Demo ke liye - 1 second baad agent ka reply)
    setTimeout(() => {
      const agentReply = {
        id: Date.now() + 1,
        sender: 'agent',
        text: `I have noted your issue about: "${inputValue}". Connecting you with an expert...`
      };
      setMessages((prevMessages: any[]) => [...prevMessages, agentReply]);
    }, 1000);
  };



  const sendMessage = (userText: string) => {
    // User message object
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: userText
    };

    setMessages((prev: any[]) => [...prev, userMessage]);

    // Simulated API response (Yahan aapka backend trigger hoga)
    setTimeout(() => {
      let botResponse:any = {
        id: Date.now() + 1,
        sender: 'agent',
        text: `It looks like you're facing an issue with "${userText}". To help you better, select a sub-category:`
      };

      // Agar user ne plumbing choose kiya tha, to sub-categories options bhejo
      if (userText.toLowerCase().includes('plumbing') || userText.toLowerCase().includes('leakage')) {
        botResponse.options = ['Bathroom Leakage', 'Tap Leakage', 'Toilet Leakage', 'Wall Seepage', 'Pipe Joint Leakage'];
      }

      setMessages((prev: any[]) => [...prev, botResponse]);
    }, 1000);
  };



  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const startEdit = (msgId:any, currentText: string) => {
    setEditingMessageId(msgId);
    setEditingText(currentText);
  };



  const saveEdit = (msgId: any) => {
    if (!editingText.trim()) return;

    setMessages((prev: any[]) =>
      prev.map((msg) => (msg.id === msgId ? { ...msg, text: editingText } : msg))
    );

    // Reset Edit State
    setEditingMessageId(null);
    setEditingText('');
  };

  return (
    <div className="offcanvas offcanvas-end agent-off-canvas-wrp" tabIndex={-1} id="agent-msg-offcanvasRight"
      aria-labelledby="offcanvasRightLabel">
      <div className="messages-inbox-in">
        <div className="offcanvas-header agent-header-tab">
          <button type="button" className="btn-close my-cross" data-bs-dismiss="offcanvas" aria-label="Close">
            <img src="/images/off-canvas/cross-icon-off-canvas.svg" alt="" />
          </button>
          <div className="agent-header">
            <img src="/images/off-canvas/agent-profile-img.svg" alt="" />
            <div className="seve-agt-avl">
              <p className="user-seva-text">SevaServe Agent</p>
              <p className="available"><span></span>Available</p>
            </div>
          </div>
          <h5 className="agent-call-icon" id="offcanvasRightLabel">
            <img src="/images/off-canvas/agent-call-icon.svg" alt="" />
          </h5>
        </div>
        <div className="offcanvas-body agent-body">
          <h2 className="">How can I help you today?</h2>
          {/* <div className="agent-service">
            <button type="submit">
              <img src="/images/home/top-right-plumbing.svg" alt="" />
              Plumbing
            </button>
            <button type="submit">
              <img src="/images/home/top-right-plumbing.svg" alt="" />
              Cleaning
            </button>
            <button type="submit">
              <img src="/images/home/top-right-plumbing.svg" alt="" />
              Furniture Work
            </button>
            <button type="submit">
              <img src="/images/home/top-right-plumbing.svg" alt="" />
              Laundry
            </button>
            <button>
              <img src="/images/home/top-right-plumbing.svg" alt="" />
              Painting
            </button>
          </div>
          <div className="water-leakage">
            <div className="ineer-srv">
              <span><img src="/images/home/service-icon.svg" alt="" /></span>
              <p>What service do I need for a water leakage?</p>
            </div>
            <div className="ineer-srv">
              <span><img src="/images/home/service-icon.svg" alt="" /></span>
              <p>What service do I need for a water leakage?</p>
            </div>
            <div className="ineer-srv">
              <span><img src="/images/home/service-icon.svg" alt="" /></span>
              <p>What service do I need for a water leakage?</p>
            </div>
            <div className="ineer-srv">
              <span><img src="/images/home/service-icon.svg" alt="" /></span>
              <p>What service do I need for a water leakage?</p>
            </div>
            <div className="ineer-srv">
              <span><img src="/images/home/service-icon.svg" alt="" /></span>
              <p>What service do I need for a water leakage?</p>
            </div>
          </div> */}


<>
              {/* Dynamic Initial Services */}
              <div className="agent-service">
                {initialServices.map((service, index) => (
                  <button key={index} type="button" onClick={() => sendMessage(service.label)}>
                    <img src={service.icon} alt={service.label} />
                    {service.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Suggested Questions */}
              <div className="water-leakage">
                {suggestedQuestions.map((question, index) => (
                  <div key={index} className="ineer-srv" onClick={() => sendMessage(question)} style={{ cursor: 'pointer' }}>
                    <span><img src="/images/home/service-icon.svg" alt="" /></span>
                    <p>{question}</p>
                  </div>
                ))}
              </div>
            </>



          <div className="messages-inbox-grp">
            {/* <div className="right-side-wrp">
              <div className="right-side">
                <div className="chat">
                  What service do I need for a water leakage?
                </div>
              </div>
              <span><img src="/images/home/msg-edit-icon.svg" alt="" /></span>
            </div>
            <div className="msg-img-wrper">
              <div className="text-btn-inner">
                <div className="left-side left">
                  <div className="pro-stat">

                  </div>
                  <div className="chat">
                    It looks like you're facing a water leakage issue. To
                    help you better, I need a bit more info.
                  </div>
                </div>
                <div className="agent-service-left">
                  <button type="submit">
                    <img src="/images/home/top-right-plumbing.svg" alt="" />
                    Bathroom Leakage
                  </button>
                  <button type="submit">
                    <img src="/images/home/top-right-plumbing.svg" alt="" />
                    Tap Leakage
                  </button>
                  <button type="submit">
                    <img src="/images/home/top-right-plumbing.svg" alt="" />
                    Toilet Leakage
                  </button>
                  <button type="submit">
                    <img src="/images/home/top-right-plumbing.svg" alt="" />
                    Wall Seepage
                  </button>
                  <button>
                    <img src="/images/home/top-right-plumbing.svg" alt="" />
                    Pipe Joint Leakage
                  </button>
                </div>
              </div>
              <div className="ai-agent-picture">
                <img src="/images/home/chat-ai-agent-picture.svg" alt="" />
              </div>
            </div>
            <div className="right-side-wrp">
              <div className="right-side">
                <div className="chat">Bathroom Leakage</div>
              </div>
              <span><img src="/images/home/msg-edit-icon.svg" alt="" /></span>
            </div>
            <div className="msg-img-wrper">
              <div className="text-btn-inner">
                <div className="left-side left">
                  <div className="pro-stat">

                  </div>
                  <div className="chat">
                    Great! Describe the issue briefly so we can understand
                    better.
                  </div>
                </div>
              </div>

              <div className="ai-agent-picture">
                <img src="/images/home/chat-ai-agent-picture.svg" alt="" />
              </div>
            </div>
            <div className="right-side-wrp">
              <div className="right-side">
                <div className="chat">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua.
                </div>
              </div>
              <span><img src="/images/home/msg-edit-icon.svg" alt="" /></span>
            </div>
            <div className="msg-img-wrper">
              <div className="text-btn-inner">
                <div className="left-side left">
                  <div className="pro-stat">

                  </div>
                  <div className="chat">
                    Thanks! Your description is noted.<br /><br />

                    Do you want to upload an image or video?
                  </div>
                </div>
              </div>

              <div className="ai-agent-picture">
                <img src="/images/home/chat-ai-agent-picture.svg" alt="" />
              </div>
            </div>
            <div className="right-side-wrp">
              <div className="right-side img-inner">
                <div className="chat">
                  <img src="/images/home/img-agent-pic.svg" alt="" />
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                </div>
              </div>
              <span><img src="/images/home/msg-edit-icon.svg" alt="" /></span>
            </div>
            <div className="msg-img-wrper">
              <div className="text-btn-inner">
                <div className="left-side left">
                  <div className="pro-stat">

                  </div>
                  <div className="chat">
                    I’ve analyzed the image. It seems related to Pipe Joint
                    Leakage. <br /><br />

                    Do you want to review all entered details?<br />
                    <a href="issue-details.html">View Details</a>
                  </div>
                </div>
              </div>

              <div className="ai-agent-picture">
                <img src="/images/home/chat-ai-agent-picture.svg" alt="" />
              </div>
            </div> */}


           {messages.length > 0 && (
            <div className="messages-inbox-grp">
              {messages.map((msg) => (
                <React.Fragment key={msg.id}>
                  
                  {/* USER MESSAGE LAYOUT */}
                  {/* {msg.sender === 'user' && (
                    <div className="right-side-wrp">
                      <div className="right-side">
                        <div className="chat">{msg.text}</div>
                      </div>
                      <span><img src="/images/home/msg-edit-icon.svg" alt="" /></span>
                    </div>
                  )} */}

{msg.sender === 'user' && (
                    <div className="right-side-wrp">
                      <div className="right-side">
                        <div className="chat">
                          {editingMessageId === msg.id ? (
                            // Edit Form UI (Bina CSS change kiye control inline kiya h)
                            <div className="d-flex align-items-center gap-2">
                              <input 
                                type="text" 
                                className="form-control form-control-sm"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                style={{ background: '#fff', color: '#000', borderRadius: '4px', border: '1px solid #ccc' }}
                              />
                              <button 
                                type="button" 
                                className="btn btn-sm btn-success py-0 px-2"
                                onClick={() => saveEdit(msg.id)}
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            // Normal Text display
                            msg.text
                          )}
                        </div>
                      </div>
                      
                      {/* Edit Icon Button Trigger */}
                      {editingMessageId !== msg.id && (
                        <span onClick={() => startEdit(msg.id, msg.text)} style={{ cursor: 'pointer' }}>
                          <img src="/images/home/msg-edit-icon.svg" alt="edit" />
                        </span>
                      )}
                    </div>
                  )}

                  {/* AGENT/BOT MESSAGE LAYOUT */}
                  {msg.sender === 'agent' && (
                    <div className="msg-img-wrper">
                      <div className="text-btn-inner">
                        <div className="left-side left">
                          <div className="pro-stat"></div>
                          <div className="chat">{msg.text}</div>
                        </div>

                        {/* Sub-options (In-chat left aligned options) */}
                        {msg.options && (
                          <div className="agent-service-left">
                            {msg.options.map((subOpt, idx) => (
                              <button key={idx} type="button" onClick={() => sendMessage(subOpt)}>
                                <img src="/images/home/top-right-plumbing.svg" alt="" />
                                {subOpt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="ai-agent-picture">
                        <img src="/images/home/chat-ai-agent-picture.svg" alt="" />
                      </div>
                    </div>
                  )}

                </React.Fragment>
              ))}
            </div>
          )}




          </div>
        </div>
        <div className="send-msg-wrp">
          {/* <form action="">
            <div className="messages-type-send-in">
              <input type="text" placeholder="Tell SevaServe your problem" className="" />
              <label>
                <img src="/images/home/attach-file.svg" alt="" />
                <input type="file" hidden="" />
              </label>
              <button type="submit" className="">
                <img src="/images/home/msg-send.svg" alt="" />
              </button>
            </div>
          </form> */}

          <form onSubmit={handleFormSubmit}>
            <div className="messages-type-send-in">
              <input 
                type="text" 
                placeholder="Tell SevaServe your problem" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <label>
                <img src="/images/home/attach-file.svg" alt="" />
                <input type="file" hidden />
              </label>
              <button type="submit">
                <img src="/images/home/msg-send.svg" alt="" />
              </button>
            </div>
          </form>



        </div>
      </div>
    </div>

  )
}

export default SevaServeAgentPanel