import React, { useEffect, useRef, useState } from "react";
import "./room/room.css";

export const initialRoomState = {
  name: "草莓奶油宫",
  hour: 14,
  cycle: false,
  lamp: false,
  chandelier: false,
  ac: false,
  fan: false,
  tv: false,
  wardrobe: false,
  curtains: false,
  cutaway: true,
  rotate: false,
  view: null,
};
const devices = [
  ["chandelier", "✧", "水晶吊灯"],
  ["lamp", "☼", "床头灯"],
  ["ac", "❄", "空调"],
  ["fan", "◌", "风扇"],
  ["tv", "▣", "电视"],
  ["wardrobe", "♜", "衣柜"],
  ["curtains", "⋈", "床幔"],
];
const remarks = {
  bed: "公主床的床幔可以收起或展开。",
  vanity: "描金梳妆镜、香水瓶和一束小玫瑰。",
  sofa: "柔软沙发上，兔子玩偶正坐得端端正正。",
  tea: "草莓小蛋糕配一杯热茶，享受一个悠闲的下午。",
  shelf: "把喜欢的书和甜点，摆进奶油色小柜子。",
  plant: "一株开满粉色花朵的玫瑰小树。",
};
export default function Room({ settings, onChange }) {
  const host = useRef(null),
    engine = useRef(null),
    latest = useRef(settings),
    actionRef = useRef(null),
    changeRef = useRef(onChange);
  const [error, setError] = useState(""),
    [ready, setReady] = useState(false),
    [attempt, setAttempt] = useState(0),
    [remote, setRemote] = useState(true),
    [renaming, setRenaming] = useState(false),
    [nameDraft, setNameDraft] = useState(settings.name),
    [note, setNote] = useState("拖动旋转视角，也可以直接点击家具。");
  latest.current = settings;
  changeRef.current = onChange;
  function change(key, value) {
    onChange((s) => ({ ...s, [key]: value }));
  }
  function action(id) {
    if (id === "bed") id = "curtains";
    const found = devices.find(([key]) => key === id);
    if (found) {
      const value = !latest.current[id];
      onChange((s) => ({ ...s, [id]: !s[id] }));
      setNote(
        `${found[2]}${id === "wardrobe" ? (value ? "打开了。" : "关好了。") : id === "curtains" ? (value ? "展开了。" : "收好了。") : value ? "开启了。" : "关闭了。"}`,
      );
    } else setNote(remarks[id] || "房间里的一件小收藏。");
  }
  actionRef.current = action;
  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setError("");
    import("./room/scene")
      .then(({ createRoom }) => {
        if (cancelled) return;
        try {
          engine.current = createRoom(host.current, {
            settings: latest.current,
            onAction: (id) => actionRef.current(id),
            onTime: (hour) => changeRef.current((s) => ({ ...s, hour })),
            onView: (view) => changeRef.current((s) => ({ ...s, view })),
            onError: setError,
          });
          setReady(true);
        } catch (e) {
          host.current?.replaceChildren();
          setError(
            "浏览器暂时无法启动 3D 画面。请开启浏览器硬件加速，或换用支持 WebGL 2 的浏览器。",
          );
          console.error("Room initialization failed:", e);
        }
      })
      .catch(() => {
        if (!cancelled) setError("房间资源没有加载完成，请重新加载。");
      });
    return () => {
      cancelled = true;
      engine.current?.dispose();
      engine.current = null;
    };
  }, [attempt]);
  useEffect(() => {
    engine.current?.update(settings);
  }, [settings]);
  const hourText = `${String(Math.floor(settings.hour)).padStart(2, "0")}:${String(Math.floor((settings.hour % 1) * 60)).padStart(2, "0")}`;
  const period =
    settings.hour < 6 || settings.hour >= 20
      ? "月光夜晚"
      : settings.hour < 9
        ? "清晨日出"
        : settings.hour >= 17
          ? "黄昏日落"
          : "晴朗白天";
  return (
    <section
      className={`palace-page ${settings.hour < 6 || settings.hour >= 20 ? "palace-night" : ""}`}
    >
      <header className="palace-heading">
        <div>
          <p className="eyebrow">STRAWBERRY · A LITTLE ROYAL RETREAT</p>
          {renaming ? (
            <form
              className="room-rename"
              onSubmit={(e) => {
                e.preventDefault();
                if (nameDraft.trim()) {
                  change("name", nameDraft.trim());
                  setRenaming(false);
                }
              }}
            >
              <input
                aria-label="小屋名称"
                value={nameDraft}
                maxLength={16}
                onChange={(e) => setNameDraft(e.target.value)}
                autoFocus
              />
              <button type="submit">保存</button>
              <button type="button" onClick={() => setRenaming(false)}>
                取消
              </button>
            </form>
          ) : (
            <h1>
              {settings.name}
              <button
                onClick={() => {
                  setNameDraft(settings.name);
                  setRenaming(true);
                }}
                aria-label="修改小屋名称"
              >
                ✎
              </button>
            </h1>
          )}
          <p>粉色、奶油和一点金色。把喜欢的日子住进来。</p>
        </div>
        <span className="palace-seal">
          S<span>CREAM PALACE</span>
        </span>
      </header>
      <div className="palace-time">
        <div>
          <span className="time-symbol">
            {period === "月光夜晚" ? "☾" : "☼"}
          </span>
          <div>
            <strong>{hourText}</strong>
            <span>{period}</span>
          </div>
        </div>
        <div className="time-presets">
          {[
            [6.5, "日出"],
            [14, "白天"],
            [18, "日落"],
            [22, "夜晚"],
          ].map(([hour, label]) => (
            <button
              key={label}
              onClick={() => onChange((s) => ({ ...s, hour, cycle: false }))}
              aria-pressed={Math.abs(settings.hour - hour) < 0.6}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="cycle-toggle">
          <input
            type="checkbox"
            checked={settings.cycle}
            onChange={(e) => change("cycle", e.target.checked)}
          />
          时间流动
        </label>
      </div>
      <div className="time-slider">
        <label htmlFor="room-time">时间</label>
        <input
          id="room-time"
          aria-label="房间时间"
          type="range"
          min="0"
          max="23.99"
          step=".05"
          value={settings.hour}
          onChange={(e) =>
            onChange((s) => ({
              ...s,
              hour: Number(e.target.value),
              cycle: false,
            }))
          }
        />
        <span>24 H</span>
      </div>
      <div className="palace-stage">
        <div className="palace-canvas" ref={host} />
        {!ready && !error && (
          <div className="scene-message" role="status">
            <span className="loading-crown">♔</span>
            <p>正在布置公主房…</p>
          </div>
        )}
        {error && (
          <div className="scene-message" role="alert">
            <p>{error}</p>
            <button
              className="primary"
              onClick={() => setAttempt((x) => x + 1)}
            >
              重新加载房间
            </button>
          </div>
        )}
        <div className="scene-label">
          <span>✧</span> LITTLE ROYAL RETREAT
        </div>
        <div className="view-controls">
          <button
            aria-label="向左旋转房间"
            title="向左旋转"
            onClick={() => engine.current?.orbit(-0.4)}
          >
            ↶
          </button>
          <button
            aria-label="向右旋转房间"
            title="向右旋转"
            onClick={() => engine.current?.orbit(0.4)}
          >
            ↷
          </button>
          <span />
          <button
            aria-label="放大房间"
            onClick={() => engine.current?.zoom(0.85)}
          >
            ＋
          </button>
          <button
            aria-label="缩小房间"
            onClick={() => engine.current?.zoom(1.18)}
          >
            −
          </button>
          <button
            onClick={() => {
              change("rotate", false);
              engine.current?.reset();
            }}
          >
            归位
          </button>
        </div>
        <button
          className={`remote-toggle ${remote ? "selected" : ""}`}
          onClick={() => setRemote(!remote)}
          aria-expanded={remote}
          aria-controls="room-remote"
        >
          ⌁ 遥控器
        </button>
        <div className="scene-options">
          <label>
            <input
              type="checkbox"
              checked={settings.rotate}
              onChange={(e) => change("rotate", e.target.checked)}
            />
            自动旋转
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.cutaway}
              onChange={(e) => change("cutaway", e.target.checked)}
            />
            自动隐藏挡住视线的墙
          </label>
        </div>
      </div>
      <div className="room-feedback" role="status">
        ✧ {note}
      </div>
      {remote && (
        <section
          id="room-remote"
          className="palace-remote"
          aria-label="家具遥控器"
        >
          <div className="remote-heading">
            <p className="eyebrow">THE LITTLE REMOTE</p>
            <span>点家具，也能控制开关</span>
          </div>
          <div className="device-grid">
            {devices.map(([id, icon, label]) => (
              <button
                key={id}
                disabled={!ready || !!error}
                aria-pressed={settings[id]}
                onClick={() => action(id)}
              >
                <span className="device-icon">{icon}</span>
                <span>
                  {label}
                  <small>
                    {settings[id]
                      ? id === "curtains"
                        ? "已展开"
                        : id === "wardrobe"
                          ? "已打开"
                          : "已开启"
                      : id === "curtains"
                        ? "已收起"
                        : "已关闭"}
                  </small>
                </span>
                <i />
              </button>
            ))}
          </div>
        </section>
      )}
      <p className="palace-help">
        鼠标拖动 / 单指滑动旋转 · 滚轮 / 双指缩放 · 右键 / 双指平移
        <br />
        选中画面后也可用方向键旋转、＋ / − 缩放。设置保留到本次页面关闭或刷新。
      </p>
    </section>
  );
}
