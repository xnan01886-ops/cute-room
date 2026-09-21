import React, { useEffect, useRef, useState } from "react";
import { APP_CONFIG } from "./config";
import Room, { initialRoomState } from "./Room";

const starterMessages = [
  { id: 1, role: "assistant", text: "下午好。这里很安静，我在。" },
  { id: 2, role: "user", text: "那我们今天也在这里说说话吧。" },
  { id: 3, role: "assistant", text: "好。慢慢说，不着急。" },
];
const nav = [
  ["home", "主页", "home"],
  ["chat", "聊天", "chat"],
  ["room", "小屋", "spark"],
  ["settings", "设置", "settings"],
];
function Icon({ name, size = 22 }) {
  const paths = {
    home: "M3 10 12 3l9 7v10H3Z M9 20v-7h6v7",
    chat: "M20 11a8 8 0 0 1-8 8H8l-5 3 1-7a8 8 0 1 1 16-4Z M8 11h.01M12 11h.01M16 11h.01",
    spark: "m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z",
    settings:
      "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1Z",
    arrow: "M14 5 7 12l7 7",
    book: "M12 6C8 3 5 3 2 4v15c4-1 7 0 10 2 3-2 6-3 10-2V4c-3-1-6-1-10 2Z M12 6v15",
    play: "m8 4 12 8-12 8Z",
    note: "M5 3h14v18H5Z M8 8h8M8 12h8M8 16h5",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.spark} />
    </svg>
  );
}
function Sticker({ kind }) {
  return (
    <svg
      viewBox="0 0 180 135"
      className={`sticker sticker-${kind}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`paper-${kind}`} x2=".6" y2="1">
          <stop stopColor="#fffaf2" />
          <stop offset="1" stopColor="#eedcd0" />
        </linearGradient>
      </defs>
      {kind === "bunny" ? (
        <g stroke="#bea6a2" strokeWidth="1.4">
          <ellipse
            cx="89"
            cy="120"
            rx="61"
            ry="8"
            fill="#eddfdf"
            stroke="none"
          />
          <ellipse
            cx="68"
            cy="35"
            rx="13"
            ry="31"
            fill="#fff8ec"
            transform="rotate(-12 68 35)"
          />
          <ellipse
            cx="105"
            cy="35"
            rx="13"
            ry="31"
            fill="#fff8ec"
            transform="rotate(12 105 35)"
          />
          <ellipse cx="88" cy="95" rx="36" ry="32" fill="#fff8ec" />
          <ellipse cx="87" cy="63" rx="39" ry="33" fill="#fff8ec" />
          <ellipse cx="72" cy="112" rx="19" ry="12" fill="#fff8ec" />
          <ellipse cx="111" cy="112" rx="19" ry="12" fill="#fff8ec" />
          <circle cx="74" cy="60" r="3" fill="#776364" />
          <circle cx="101" cy="60" r="3" fill="#776364" />
          <ellipse cx="87" cy="69" rx="4" ry="3" fill="#d89cb0" />
          <ellipse cx="60" cy="69" rx="7" ry="4" fill="#f5d1dc" stroke="none" />
          <ellipse
            cx="113"
            cy="69"
            rx="7"
            ry="4"
            fill="#f5d1dc"
            stroke="none"
          />
          <path d="m88 94-22-9v18l22-9 21-9v18Z" fill="#e5b0c4" />
          <circle cx="88" cy="94" r="4" fill="#d993ae" />
        </g>
      ) : kind === "book" ? (
        <g transform="rotate(-8 90 70)" stroke="#cdaeb7" strokeWidth="2">
          <path
            d="M25 28Q62 23 90 40q32-17 66-12v84q-35-7-66 7-34-14-65-7Z"
            fill="#e5b8c7"
          />
          <path
            d="M29 24Q65 21 90 36q30-15 62-12v82q-33-5-62 9-28-14-61-9Z"
            fill="#fffaf0"
          />
          <path d="M90 36v79M40 50h35M40 61h35M40 72h35M40 83h28M103 72h35M103 83h35" />
          <path d="M118 24v32l8-6 8 6V24" fill="#bfd5d6" stroke="none" />
        </g>
      ) : kind === "tv" ? (
        <g stroke="#c9b7a5" strokeWidth="2">
          <path
            d="m72 29-15-20m36 20 16-21M48 113l-4 11m88-11 4 11"
            fill="none"
          />
          <rect x="28" y="29" width="125" height="87" rx="23" fill="#f5e6cd" />
          <rect x="40" y="39" width="85" height="63" rx="17" fill="#cbdde0" />
          <path d="m75 56 20 15-20 14Z" fill="#fffbef" stroke="none" />
          <circle cx="139" cy="54" r="5" fill="#e2b1c4" />
          <path d="M135 77h8m-8 6h8m-8 6h8" />
        </g>
      ) : (
        <g transform="rotate(7 90 70)" stroke="#c6adb7" strokeWidth="2">
          <rect x="44" y="20" width="91" height="102" rx="8" fill="#c7dce1" />
          <path d="M56 20v102" />
          <rect x="72" y="44" width="44" height="49" rx="3" fill="#fff8ef" />
          <path
            d="M94 62c-16-13-20 10 0 19 20-9 16-32 0-19"
            fill="#e8b8ca"
            stroke="none"
          />
          <path d="M109 20v22l8-5 8 5V20" fill="#edd9a9" stroke="none" />
        </g>
      )}
    </svg>
  );
}
function Home({ go, open }) {
  const today = new Date();
  return (
    <div className="home-page">
      <div className="home-kicker">
        <span>YOUR LITTLE HAPPY PLACE</span>
        <span>
          ✧ &nbsp;{" "}
          {today.toLocaleDateString("zh-CN", { month: "long", day: "numeric" })}
        </span>
      </div>
      <div className="home-title">
        <div>
          <p className="eyebrow">HELLO, SAYORI</p>
          <h1>
            把日子过成<span>草莓味。</span>
          </h1>
        </div>
        <span className="title-bow">୨୧</span>
      </div>
      <div className="scrapbook-top">
        <section className="date-card">
          <span className="paperclip">♧</span>
          <span className="script">A lovely day</span>
          <strong>{String(today.getDate()).padStart(2, "0")}</strong>
          <span className="month">
            {today
              .toLocaleDateString("en-US", { month: "long", year: "numeric" })
              .toUpperCase()}
          </span>
          <div className="date-footer">
            SLOW DOWN &nbsp; ✧ &nbsp; ENJOY TODAY
          </div>
        </section>
        <div className="polaroids">
          <div className="polaroid sayori">
            <div>
              <Sticker kind="bunny" />
            </div>
            <span>sayori</span>
          </div>
          <div className="polaroid null">
            <div>
              <span className="moon">☾</span>
              <span className="little-stars">✧ · ✦</span>
            </div>
            <span>{APP_CONFIG.aiName}</span>
          </div>
          <span className="photo-caption">little things, lovely days</span>
        </div>
      </div>
      <section className="daily-note">
        <span className="note-bow">୨୧</span>
        <p className="eyebrow">A NOTE FOR TODAY</p>
        <h2>今日小纸条</h2>
        <p>不必把每一天都安排得满满当当。留一点时间，做让自己开心的小事。</p>
        <span className="note-sign">Have a soft little day. ✧</span>
      </section>
      <div className="activity-grid">
        <button className="home-room" onClick={() => go("room")}>
          <span className="tape" />
          <span className="room-thumb">
            <img src="/room-preview.png" alt="粉色公主房的三维实景预览" />
          </span>
          <span className="activity-label">
            公主小屋 <span>↗</span>
          </span>
          <small>给生活留一个柔软的角落</small>
        </button>
        <div className="small-activities">
          <button onClick={() => open("read")}>
            <Sticker kind="book" />
            <span>阅读清单</span>
          </button>
          <button onClick={() => open("watch")}>
            <Sticker kind="tv" />
            <span>观影清单</span>
          </button>
          <button className="diary-entry" onClick={() => open("diary")}>
            <Sticker kind="diary" />
            <div>
              <span>小小日记</span>
              <small>收藏今天的心情</small>
            </div>
          </button>
        </div>
      </div>
      <button className="music-card" onClick={() => open("music")}>
        <div className="record-player">
          <span className="vinyl">
            <i>♡</i>
          </span>
          <span className="needle" />
        </div>
        <div>
          <p className="eyebrow">SOUNDS OF A SLOW AFTERNOON</p>
          <h2>给今天配一首歌</h2>
          <p>选择你喜欢的音乐，慢慢听。</p>
        </div>
        <span className="play-circle">
          <Icon name="play" size={18} />
        </span>
      </button>
      <div className="bottom-note">
        <span>✿</span>
        <p>今天，也记得给自己一点小小的奖励。</p>
        <span>♡</span>
      </div>
    </div>
  );
}
function Chat({ messages, draft, setDraft, send, bubble }) {
  const end = useRef(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [messages]);
  return (
    <section className={`chat-page bubble-${bubble}`}>
      <div className="chat-title">
        <span className="avatar">N</span>
        <div>
          <p className="eyebrow">STRAWBERRY CHAT</p>
          <h1>{APP_CONFIG.aiName}</h1>
        </div>
        <span className="demo-label">界面预览</span>
      </div>
      <div className="messages" aria-live="polite">
        <div className="day-divider">今天</div>
        {messages.map((m) => (
          <div className={`message-row ${m.role}`} key={m.id}>
            {m.role === "assistant" && <span className="mini-avatar">N</span>}
            <div className="message-wrap">
              <span className="speaker">
                {m.role === "assistant" ? APP_CONFIG.aiName : "sayori"}
              </span>
              <p className="bubble">{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={end} />
      </div>
      <form className="composer" onSubmit={send}>
        <textarea
          aria-label="聊天消息"
          placeholder={`写点什么给 ${APP_CONFIG.aiName}…`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              send(e);
            }
          }}
        />
        <button type="submit" disabled={!draft.trim()} aria-label="发送消息">
          ↑
        </button>
      </form>
      <p className="hint">消息仅在本次页面中保留 · 尚未连接 AI 回复</p>
    </section>
  );
}
export default function App() {
  const [roomSettings, setRoomSettings] = useState(initialRoomState);
  const [page, setPage] = useState("home"),
    [modal, setModal] = useState(null),
    [bubble, setBubble] = useState("ribbon");
  const [messages, setMessages] = useState(starterMessages),
    [draft, setDraft] = useState(""),
    [diary, setDiary] = useState(""),
    [savedDiary, setSavedDiary] = useState("");
  const [lists, setLists] = useState({ read: [], watch: [] }),
    [item, setItem] = useState(""),
    [audio, setAudio] = useState(null),
    [audioName, setAudioName] = useState(""),
    [audioError, setAudioError] = useState("");
  const closeButton = useRef(null),
    opener = useRef(null),
    modalRef = useRef(null);
  function open(type) {
    opener.current = document.activeElement;
    setModal(type);
    setItem("");
  }
  function close() {
    setModal(null);
    opener.current?.focus();
  }
  useEffect(() => {
    if (!modal) return;
    closeButton.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modal]);
  useEffect(
    () => () => {
      if (audio) URL.revokeObjectURL(audio);
    },
    [audio],
  );
  function send(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), role: "user", text: draft.trim() },
    ]);
    setDraft("");
  }
  const titles = {
    read: "阅读清单",
    watch: "观影清单",
    diary: "小小日记",
    music: "午后唱片机",
  };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setPage("home");
          }}
        >
          <span className="brand-fruit">♧</span>
          <span>
            {APP_CONFIG.appName}
            <small>A SOFT LITTLE WORLD</small>
          </span>
        </a>
        <nav aria-label="主导航">
          {nav.map(([id, label, icon]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              aria-current={page === id ? "page" : undefined}
              onClick={() => setPage(id)}
            >
              <Icon name={icon} />
              <span>{label}</span>
              <span className="nav-dot">•</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span>୨୧</span>
          <p>
            收集平凡日子里的
            <br />
            一点甜。
          </p>
          <small>made for little joys</small>
        </div>
        <div className="profile">
          <span>S</span>
          <div>
            sayori<small>今天也自在一点</small>
          </div>
          <span>✧</span>
        </div>
      </aside>
      <main className="main-paper">
        <header className="mobile-brand">
          {APP_CONFIG.appName}
          <span>୨୧</span>
        </header>
        {page !== "home" && (
          <button className="back" onClick={() => setPage("home")}>
            <Icon name="arrow" size={16} /> 返回主页
          </button>
        )}
        {page === "home" && <Home go={setPage} open={open} />}
        {page === "room" && (
          <Room settings={roomSettings} onChange={setRoomSettings} />
        )}
        {page === "chat" && (
          <Chat {...{ messages, draft, setDraft, send, bubble }} />
        )}
        {page === "settings" && (
          <section className="settings-page">
            <div className="section-heading">
              <p className="eyebrow">MAKE IT YOURS</p>
              <h1>装扮 Strawberry</h1>
              <p>从一颗小小的聊天气泡开始。</p>
            </div>
            <h2>聊天气泡</h2>
            <div className="bubble-options">
              {[
                ["ribbon", "蝴蝶结"],
                ["cream", "奶油白"],
                ["berry", "草莓粉"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  aria-pressed={bubble === id}
                  className={`bubble-${id} ${bubble === id ? "chosen" : ""}`}
                  onClick={() => setBubble(id)}
                >
                  <p className="bubble">今天有什么开心的小事？</p>
                  <span>
                    {label} {bubble === id ? "✓" : ""}
                  </span>
                </button>
              ))}
            </div>
            <button className="primary" onClick={() => setPage("chat")}>
              去聊天页看看 ↗
            </button>
            <div className="settings-note">
              样式、日记和清单在本次页面中保留；刷新后恢复初始状态。
            </div>
          </section>
        )}
      </main>
      <nav className="mobile-nav" aria-label="底部导航">
        {nav.map(([id, label, icon]) => (
          <button
            key={id}
            aria-current={page === id ? "page" : undefined}
            className={page === id ? "active" : ""}
            onClick={() => setPage(id)}
          >
            <Icon name={icon} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      {modal && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <section
            ref={modalRef}
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
              if (e.key === "Tab") {
                const nodes = [
                  ...modalRef.current.querySelectorAll(
                    'button,input,textarea,audio,[tabindex="0"]',
                  ),
                ].filter((n) => !n.disabled);
                const first = nodes[0],
                  last = nodes[nodes.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first.focus();
                }
              }
            }}
          >
            <button
              className="close"
              ref={closeButton}
              onClick={close}
              aria-label="关闭"
            >
              ×
            </button>
            <p className="eyebrow">LITTLE COLLECTIONS</p>
            <h2 id="modal-title">{titles[modal]}</h2>
            {(modal === "read" || modal === "watch") && (
              <>
                <form
                  className="list-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!item.trim()) return;
                    setLists((l) => ({
                      ...l,
                      [modal]: [
                        ...l[modal],
                        {
                          id: crypto.randomUUID(),
                          text: item.trim(),
                          done: false,
                        },
                      ],
                    }));
                    setItem("");
                  }}
                >
                  <input
                    aria-label="作品名称"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    placeholder={
                      modal === "read" ? "想读哪本书？" : "想看哪部电影？"
                    }
                    maxLength={100}
                  />
                  <button className="primary" disabled={!item.trim()}>
                    添加
                  </button>
                </form>
                {lists[modal].length === 0 ? (
                  <p className="empty">
                    还没有收藏，写下第一部想{modal === "read" ? "读" : "看"}
                    的作品吧。
                  </p>
                ) : (
                  <ul className="collection-list">
                    {lists[modal].map((entry) => (
                      <li key={entry.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={entry.done}
                            onChange={() =>
                              setLists((l) => ({
                                ...l,
                                [modal]: l[modal].map((x) =>
                                  x.id === entry.id
                                    ? { ...x, done: !x.done }
                                    : x,
                                ),
                              }))
                            }
                          />
                          <span className={entry.done ? "done" : ""}>
                            {entry.text}
                          </span>
                        </label>
                        <button
                          aria-label={`删除${entry.text}`}
                          onClick={() =>
                            setLists((l) => ({
                              ...l,
                              [modal]: l[modal].filter(
                                (x) => x.id !== entry.id,
                              ),
                            }))
                          }
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {modal === "diary" && (
              <>
                <p className="hint">只记录在本次页面中，刷新前记得复制留存。</p>
                <textarea
                  className="diary-text"
                  aria-label="日记内容"
                  placeholder="今天有什么值得记住的小事？"
                  value={diary}
                  onChange={(e) => setDiary(e.target.value)}
                />
                <button
                  className="primary"
                  onClick={() => setSavedDiary(diary)}
                  disabled={!diary.trim()}
                >
                  记下今天
                </button>
                <p role="status" className="hint">
                  {savedDiary && savedDiary === diary
                    ? "已记下，本次页面中可以随时回来看看。"
                    : ""}
                </p>
              </>
            )}
            {modal === "music" && (
              <>
                <div className="music-illustration">
                  <span className="vinyl">
                    <i>♡</i>
                  </span>
                </div>
                <p>选一首电脑里的音乐，给今天配个背景音。</p>
                <label className="file-label">
                  选择音频文件
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAudioError("");
                        setAudio(URL.createObjectURL(file));
                        setAudioName(file.name);
                      }
                    }}
                  />
                </label>
                {audio && (
                  <>
                    <p className="audio-name">{audioName}</p>
                    <audio
                      key={audio}
                      controls
                      src={audio}
                      onError={() =>
                        setAudioError(
                          "浏览器无法播放这个格式，请换一个音频文件。",
                        )
                      }
                    />
                    <p role="status">{audioError}</p>
                  </>
                )}
                <p className="hint">文件只在浏览器内播放，不会上传。</p>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
