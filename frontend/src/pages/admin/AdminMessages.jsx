import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, Send, Users } from 'lucide-react';
import { getAdminConversations, getAdminConversation, sendAdminMessage } from '../../api/messages';
import { Layout } from '../../components/Layout';
import { Topbar } from '../../components/Topbar';

const NAVY    = '#003D2B';
const NAVY_MID = '#005C40';
const GOLD    = '#C8E15A';
const GOLD_DK = '#8FAB32';
const GOLD_LT = '#EDF5C8';

export default function AdminMessages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected]           = useState(searchParams.get('user') || null);
  const [messages, setMessages]           = useState([]);
  const [reply, setReply]                 = useState('');
  const [loading, setLoading]             = useState(true);
  const [msgLoading, setMsgLoading]       = useState(false);
  const [sending, setSending]             = useState(false);
  const [sendError, setSendError]         = useState('');
  const bottomRef = useRef(null);

  const loadConversations = useCallback(async () => {
    try {
      const { data } = await getAdminConversations();
      setConversations(data);
      if (!selected && data.length > 0) setSelected(data[0].userId);
    } catch (err) {
      console.error('Failed to load conversations:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  const loadMessages = useCallback(async () => {
    if (!selected) return;
    setMsgLoading(true);
    try {
      const { data } = await getAdminConversation(selected);
      setMessages(data);
      setConversations(cs => cs.map(c => c.userId === selected ? { ...c, unreadCount: 0 } : c));
    } catch (err) {
      console.error('Failed to load messages:', err.response?.data || err.message);
    } finally {
      setMsgLoading(false);
    }
  }, [selected]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelect = (userId) => {
    setSelected(userId);
    setSearchParams({ user: userId });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !selected) return;
    setSendError('');
    setSending(true);
    try {
      const { data } = await sendAdminMessage(selected, reply.trim());
      setMessages(ms => [...ms, data]);
      setReply('');
      setConversations(cs => cs.map(c => c.userId === selected ? { ...c, lastMessage: reply.trim(), lastAt: new Date().toISOString() } : c));
    } catch (err) {
      setSendError(err.response?.data?.message || 'Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const selectedConvo = conversations.find(c => c.userId === selected);

  return (
    <Layout>
      <Topbar title="Messages" subtitle="Customer support conversations" onRefresh={loadConversations} />
      <div className="flex-1 flex overflow-hidden" style={{ minHeight: 0 }}>

        {/* Conversation list */}
        <div className="w-72 flex-shrink-0 border-r border-slate-200 flex flex-col bg-white">
          <div className="p-4 border-b border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${GOLD} transparent ${GOLD} ${GOLD}` }} />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-12">
                <Users size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No messages yet</p>
              </div>
            ) : conversations.map(c => (
              <button
                key={c.userId}
                onClick={() => handleSelect(c.userId)}
                className={`w-full text-left px-4 py-3.5 border-b border-slate-100 transition-colors ${
                  selected === c.userId ? 'bg-amber-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}
                  >
                    {c.userName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800 truncate">{c.userName}</p>
                      {c.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare size={40} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400">Select a conversation</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}
                >
                  {selectedConvo?.userName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{selectedConvo?.userName}</p>
                  <p className="text-xs text-slate-400">{selectedConvo?.userEmail} · {selectedConvo?.accountNumber}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ background: '#F7F8FA' }}>
                {msgLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${GOLD} transparent ${GOLD} ${GOLD}` }} />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare size={32} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">No messages in this conversation</p>
                  </div>
                ) : messages.map(msg => {
                  const isAdmin = msg.senderRole === 'admin';
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className="max-w-[70%] px-4 py-3 rounded-2xl text-sm shadow-sm"
                        style={isAdmin
                          ? { background: `linear-gradient(135deg, ${NAVY}, ${NAVY_MID})`, color: 'white', borderBottomRightRadius: 4 }
                          : { background: 'white', color: '#1e293b', borderBottomLeftRadius: 4 }
                        }
                      >
                        <p className="leading-relaxed">{msg.content}</p>
                        <p className={`text-xs mt-1.5 ${isAdmin ? 'text-white/50' : 'text-slate-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          {' · '}{new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Reply box */}
              <div className="px-6 py-4 border-t border-slate-200 bg-white">
                {sendError && (
                  <p className="text-xs text-red-600 mb-2 px-1">{sendError}</p>
                )}
                <form onSubmit={handleSend} className="flex gap-3">
                  <input
                    type="text"
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Type a reply..."
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 bg-slate-50 focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': GOLD }}
                  />
                  <button
                    type="submit"
                    disabled={sending || !reply.trim()}
                    className="px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50 hover:-translate-y-0.5"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DK})`, color: NAVY }}
                  >
                    <Send size={15} />
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
