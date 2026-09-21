import { useState } from 'react'
import { APP_CONFIG } from './config'

const starterMessages = [
  { id: 1, role: 'assistant', text: '下午好。这里很安静，我在。' },
  { id: 2, role: 'user', text: '那我们今天也在这里说说话吧。' },
  { id: 3, role: 'assistant', text: '好。慢慢说，不着急。' },
]

export default function App() {
  const [messages, setMessages] = useState(starterMessages)
  const [draft, setDraft] = useState('')

  function sendMessage(event) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return

    setMessages((current) => [
      ...current,
      { id: Date.now(), role: 'user', text },
    ])
    setDraft('')
  }

  return (
    <main className="page-shell">
      <section className="chat-card" aria-label={APP_CONFIG.appName}>
        <header className="chat-header">
          <div className="avatar" aria-hidden="true">N</div>
          <div>
            <p className="eyebrow">{APP_CONFIG.appName}</p>
            <h1>{APP_CONFIG.aiName}</h1>
            <p className="subtitle">{APP_CONFIG.subtitle}</p>
          </div>
          <span className="status"><i /> quiet room</span>
        </header>

        <div className="messages" aria-live="polite">
          <div className="day-divider"><span>today</span></div>
          {messages.map((message) => (
            <div key={message.id} className={`message-row ${message.role}`}>
              {message.role === 'assistant' && <div className="mini-avatar">N</div>}
              <div className="message-wrap">
                <span className="speaker">{message.role === 'assistant' ? APP_CONFIG.aiName : 'You'}</span>
                <p className="bubble">{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        <form className="composer" onSubmit={sendMessage}>
          <label className="sr-only" htmlFor="message">Message</label>
          <textarea
            id="message"
            rows="1"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                sendMessage(event)
              }
            }}
            placeholder={`写点什么给 ${APP_CONFIG.aiName}…`}
          />
          <button type="submit" aria-label="发送消息">↑</button>
        </form>
        <p className="footnote">Strawberry · phase one · messages stay only on this page</p>
      </section>
    </main>
  )
}
