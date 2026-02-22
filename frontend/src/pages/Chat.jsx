import { useState, useEffect, useCallback, useRef } from 'react';
import { MessageSquare, Send, Shield } from 'lucide-react';
import { getMessages, sendMessage } from '../api/messages';
import { UserPageLayout } from '../components/UserPageLayout';

const GREEN    = '#003D2B';
const GREEN_MID = '#005C40';
const LEMON    = '#C8E15A';
const LEMON_DK = '#8FAB32';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState('');
  const [loading, setLoading]   = useState(true);
  const [sending, setSending]   = useState(false);
  const [error, setError]       = useState('');
  const [sendError, setSendError] = useState('');
  const bottomRef = useRef(null);

  const load = useCallback(async () => {
    setError('');
    try {
      const { data } = await getMessages();
      setMessages(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load messages. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSendError(''); setSending(true);
    try {
      const { data } = await sendMessage(text.trim());
      setMessages(ms => [...ms, data]);
      setText('');
    } catch (err) {
      setSendError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <UserPageLayout fixedHeight contentStyle={{ overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#F0F2F5' }}>

        {/* Header info banner */}
        <div style={{ margin: '16px 28px 0', padding: '12px 16px', background: `linear-gradient(135deg, ${GREEN}, ${GREEN_MID})`, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(200,225,90,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={16} style={{ color: LEMON }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: '0 0 2px' }}>M&amp;T Bank Support Team</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', margin: 0 }}>We typically respond within 24 hours · Settings &amp; Support</p>
          </div>
          <button onClick={load} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: 5, padding: '5px 10px', fontSize: 12, color: 'rgba(255,255,255,.8)', cursor: 'pointer', fontWeight: 600 }}>Refresh</button>
        </div>

        {/* Messages area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 28px' }}>
          {error && (
            <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 6, color: '#dc2626', fontSize: 13, marginBottom: 14 }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ width: 28, height: 28, border: `3px solid ${LEMON}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 10px' }} />
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 16px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(200,225,90,.12)', border: `1px solid rgba(200,225,90,.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <MessageSquare size={28} style={{ color: LEMON_DK }} />
              </div>
              <h3 style={{ fontWeight: 700, color: '#374151', margin: '0 0 6px' }}>No messages yet</h3>
              <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 300, margin: '0 auto' }}>
                Have a question or need help? Send a message to our support team below.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.map(msg => {
                const isUser = msg.senderRole === 'user';
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
                    {!isUser && (
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${LEMON}, ${LEMON_DK})`, color: GREEN, fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        MT
                      </div>
                    )}
                    <div style={{ maxWidth: '72%', padding: '12px 16px', borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px', fontSize: 13, lineHeight: 1.55, boxShadow: '0 1px 3px rgba(0,0,0,.08)', ...(isUser ? { background: `linear-gradient(135deg, ${GREEN}, ${GREEN_MID})`, color: '#fff' } : { background: '#fff', color: '#1e293b', border: '1px solid #f1f5f9' }) }}>
                      {!isUser && <p style={{ fontSize: 11, fontWeight: 700, color: LEMON_DK, margin: '0 0 4px' }}>M&amp;T Bank Support</p>}
                      <p style={{ margin: 0 }}>{msg.content}</p>
                      <p style={{ fontSize: 11, margin: '6px 0 0', color: isUser ? 'rgba(255,255,255,.5)' : '#94a3b8' }}>
                        {new Date(msg.createdAt || msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        {' · '}
                        {new Date(msg.createdAt || msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div style={{ padding: '12px 28px 16px', borderTop: '1px solid #E2E8F0', background: '#fff', flexShrink: 0 }}>
          {sendError && <p style={{ fontSize: 12, color: '#dc2626', margin: '0 0 8px' }}>{sendError}</p>}
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 10 }}>
            <input
              type="text" value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type your message…"
              style={{ flex: 1, padding: '11px 16px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, color: '#1e293b', background: '#F8FAFC', outline: 'none' }}
            />
            <button type="submit" disabled={sending || !text.trim()}
              style={{ padding: '11px 22px', borderRadius: 8, fontSize: 14, fontWeight: 700, color: GREEN, background: `linear-gradient(135deg, ${LEMON}, ${LEMON_DK})`, border: 'none', cursor: sending || !text.trim() ? 'not-allowed' : 'pointer', opacity: sending || !text.trim() ? .5 : 1, display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Send size={15} /> {sending ? 'Sending…' : 'Send'}
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </UserPageLayout>
  );
}
