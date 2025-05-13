import React, { useState } from 'react';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'bce-v3/ALTAK-2S7bHTGoEugjvtZ8H4Cyx/34ce579d657a572a37b00cf2615cd44e946cdbe9', // Replace with your actual API key
  baseURL: 'https://qianfan.baidubce.com/v2/', // Thousand Fan ModelBuilder platform address
});

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: input }]);
    setInput('');

    try {
      const stream = await client.chat.completions.create({
        messages: [...messages, { role: 'user', content: input }],
        model: 'ernie-tiny-8k',
        stream: true,
      });

      let assistantMessageContent = '';
      for await (const chunk of stream) {
        assistantMessageContent += chunk.choices[0]?.delta?.content || '';
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: assistantMessageContent },
      ]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'Failed to fetch response.' },
      ]);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Chat Bot</h2>
      <div style={{ marginBottom: '20px', maxHeight: '400px', overflowY: 'scroll', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <strong>{msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message..."
        style={{ width: 'calc(100% - 22px)', padding: '10px', boxSizing: 'border-box' }}
      />
      <button onClick={sendMessage} style={{ marginLeft: '10px', padding: '10px 15px' }}>Send</button>
    </div>
  );
}

export default ChatBot;



