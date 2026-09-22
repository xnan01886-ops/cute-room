import React, { useEffect, useRef, useState } from "react";
import {
  drinkBases,
  flavors,
  toppings,
  cakeTypes,
  animals,
  visitorsAt,
  timeText,
  visitKey,
  recipeTitle,
  stepsFor,
  recipeSummary,
} from "./game";
import "./cafe.css";
function Scene({ state }) {
  const host = useRef(null),
    engine = useRef(null),
    latest = useRef(state);
  latest.current = state;
  const [status, setStatus] = useState("loading"),
    [retry, setRetry] = useState(0),
    [wide, setWide] = useState(false);
  useEffect(() => {
    let active = true;
    setStatus("loading");
    import("./scene")
      .then(({ createCafeScene }) => {
        if (!active) return;
        try {
          engine.current = createCafeScene(host.current);
          engine.current.update(latest.current);
          setWide(false);
          setStatus("ready");
        } catch {
          setStatus("error");
        }
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
      engine.current?.dispose();
      engine.current = null;
    };
  }, [retry]);
  useEffect(
    () => engine.current?.update(state),
    [state.recipe, state.job, state.minutes],
  );
  return (
    <div className="cafe-scene-wrap">
      <div ref={host} className="cafe-scene" />
      <div className="cafe-scene-label">
        ● {state.job ? "正在制作" : "配方预览"}
        <small>REAL-TIME 3D</small>
      </div>
      {status !== "ready" && (
        <div className="cafe-scene-message">
          {status === "loading" ? (
            "正在布置餐台…"
          ) : (
            <>
              三维场景暂时无法显示，仍可使用制作功能。
              <button onClick={() => setRetry((x) => x + 1)}>重试场景</button>
            </>
          )}
        </div>
      )}
      <div className="cafe-view-controls">
        <button
          disabled={status !== "ready"}
          onClick={() => {
            engine.current?.setView(!wide);
            setWide(!wide);
          }}
        >
          {wide ? "靠近工作台" : "看看咖啡馆"}
        </button>
        <button
          disabled={status !== "ready"}
          onClick={() => engine.current?.setView(wide)}
        >
          归位
        </button>
      </div>
      <p className="cafe-scene-hint">拖动旋转 · 滚轮或双指缩放</p>
    </div>
  );
}
function Choices({ label, options, value, onChange, disabled }) {
  return (
    <fieldset disabled={disabled} className="cafe-choices">
      <legend>{label}</legend>
      <div>
        {options.map((o) => {
          const p = typeof o === "string" ? { id: o, name: o } : o;
          return (
            <button
              key={p.id}
              aria-pressed={
                Array.isArray(value) ? value.includes(p.id) : value === p.id
              }
              onClick={() => onChange(p.id)}
            >
              {p.color && <i style={{ background: p.color }} />}
              {p.name}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
function Product({ item, state, dispatch }) {
  const [target, setTarget] = useState("");
  const available = visitorsAt(state.minutes).filter(
    (v) => !state.served[visitKey(state.minutes, v.id)],
  );
  const selected = available.some((v) => v.id === target)
    ? target
    : available[0]?.id || "";
  return (
    <article className="cafe-product">
      <span className="cafe-product-icon">
        {item.recipe.kind === "drink" ? "☕" : "🍰"}
      </span>
      <div>
        <h3>{item.title}</h3>
        <div className="cafe-tags">
          {item.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <dl>
          {[
            ["taste", "美味"],
            ["appearance", "装饰"],
            ["aroma", "香气"],
            ["portion", "饱腹"],
          ].map(([key, name]) => (
            <div key={key}>
              <dt>{name}</dt>
              <dd>{item.attributes[key]}</dd>
            </div>
          ))}
        </dl>
        <div className="cafe-serve">
          <select
            aria-label={`为${item.title}选择客人`}
            value={selected}
            onChange={(e) => setTarget(e.target.value)}
          >
            {available.length ? (
              available.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} · {a.species}
                </option>
              ))
            ) : (
              <option value="">等待下一位客人</option>
            )}
          </select>
          <button
            className="cafe-primary"
            disabled={!selected}
            onClick={() =>
              dispatch({ type: "SERVE", item: item.id, visitor: selected })
            }
          >
            端给客人
          </button>
        </div>
      </div>
    </article>
  );
}
export default function Cafe({ state, dispatch, onShare }) {
  const [tab, setTab] = useState("work"),
    [now, setNow] = useState(Date.now());
  const job = state.job,
    r = job?.recipe || state.recipe,
    visitors = visitorsAt(state.minutes),
    steps = stepsFor(r);
  useEffect(() => {
    if (!job?.busy) return;
    const tick = () => {
      const n = Date.now();
      setNow(n);
      dispatch({ type: "TICK", now: n });
    };
    tick();
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [job?.busy, job?.endsAt, dispatch]);
  useEffect(() => {
    if (!state.running) return;
    const id = setInterval(
      () => dispatch({ type: "ADVANCE", minutes: 1 }),
      5000,
    );
    return () => clearInterval(id);
  }, [state.running, dispatch]);
  const set = (key, value) => dispatch({ type: "SET", key, value });
  const next = () => {
    const day = state.minutes % 1440,
      n = [480, 600, 720, 840, 960, 1080, 1320].find((m) => m > day);
    dispatch({ type: "ADVANCE", minutes: n ? n - day : 1440 - day + 480 });
  };
  return (
    <section className="cafe-page">
      <header className="cafe-heading">
        <div>
          <p className="cafe-eyebrow">STRAWBERRY CAFÉ · 一间慢慢来的小店</p>
          <h1>
            草莓云朵咖啡馆 <span aria-hidden="true">✧</span>
          </h1>
          <p>调一杯喜欢的味道，等一位路过的小客人。</p>
        </div>
        <div className="cafe-open-sign">
          OPEN<small>08:00 — 22:00</small>
        </div>
      </header>
      <div className="cafe-clock">
        <div>
          <span>
            店内模拟时间 · 第 {Math.floor(state.minutes / 1440) + 1} 天
          </span>
          <strong>{timeText(state.minutes)}</strong>
          <small>✧ {state.stars} 颗感谢星</small>
        </div>
        <div className="cafe-clock-buttons">
          <button
            onClick={() => dispatch({ type: "RUNNING", value: !state.running })}
            aria-pressed={state.running}
          >
            {state.running ? "暂停时间" : "让时间流动"}
          </button>
          <button onClick={next}>下个时段 →</button>
        </div>
        <p>
          {state.running
            ? "本页每 5 秒前进 1 分钟"
            : "时间已暂停，可以慢慢制作。"}{" "}
          · 客人按模拟时间到访
        </p>
      </div>
      <nav className="cafe-tabs" aria-label="咖啡馆功能">
        {[
          ["work", "制作台"],
          ["shelf", `展示柜 ${state.shelf.length}/8`],
          ["guests", "小动物来客"],
          ["book", `配方本 ${state.collection.length}`],
        ].map(([key, label]) => (
          <button
            key={key}
            aria-current={tab === key ? "page" : undefined}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>
      <div role="status" className="cafe-notice">
        {state.notice}
      </div>
      <div className="cafe-workspace" hidden={tab !== "work"}>
        <div className="cafe-stage">
          <Scene state={state} />
          <div className="cafe-recipe-caption">
            <div>
              <small>YOUR LITTLE CREATION</small>
              <h2>{recipeTitle(r)}</h2>
            </div>
            <button onClick={() => dispatch({ type: "SAVE" })}>
              ＋ 收藏配方
            </button>
          </div>
          <div className="cafe-process">
            <ol>
              {steps.map((s, i) => (
                <li
                  key={s.name}
                  className={
                    job && job.step > i
                      ? "done"
                      : job?.step === i
                        ? "current"
                        : ""
                  }
                >
                  <span>{job && job.step > i ? "✓" : i + 1}</span>
                  {s.name}
                </li>
              ))}
            </ol>
            {job?.busy && (
              <progress
                aria-label="当前制作步骤进度"
                max="100"
                value={Math.min(
                  100,
                  Math.max(
                    0,
                    ((now - job.startedAt) / (job.endsAt - job.startedAt)) *
                      100,
                  ),
                )}
              />
            )}
            <div className="cafe-process-actions">
              {!job ? (
                <button
                  className="cafe-primary"
                  onClick={() => dispatch({ type: "START" })}
                >
                  开始制作这份配方 →
                </button>
              ) : job.step < 3 ? (
                <button
                  className="cafe-primary"
                  disabled={job.busy}
                  onClick={() => {
                    setNow(Date.now());
                    dispatch({ type: "STEP", now: Date.now() });
                  }}
                >
                  {job.busy
                    ? `${steps[job.step].name}中…`
                    : steps[job.step].verb}
                </button>
              ) : (
                <button
                  className="cafe-primary"
                  onClick={() => {
                    dispatch({ type: "FINISH" });
                    setTab("shelf");
                  }}
                >
                  完成出品 · 放进展示柜
                </button>
              )}
              {job && (
                <button onClick={() => dispatch({ type: "CANCEL" })}>
                  取消这份
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="cafe-builder">
          <div className="cafe-builder-title">
            <span>THE RECIPE</span>
            <h2>今天想做什么？</h2>
          </div>
          <Choices
            label="工作台"
            options={[
              { id: "drink", name: "自制饮品" },
              { id: "cake", name: "烘焙点心" },
            ]}
            value={r.kind}
            disabled={!!job}
            onChange={(v) => set("kind", v)}
          />
          {r.kind === "drink" ? (
            <Choices
              label="01 · 选择杯底"
              options={drinkBases}
              value={r.base}
              disabled={!!job}
              onChange={(v) => set("base", v)}
            />
          ) : (
            <Choices
              label="01 · 点心形状"
              options={cakeTypes}
              value={r.cake}
              disabled={!!job}
              onChange={(v) => set("cake", v)}
            />
          )}
          <Choices
            label="02 · 加一点风味"
            options={flavors}
            value={r.flavor}
            disabled={!!job}
            onChange={(v) => set("flavor", v)}
          />
          {r.kind === "drink" ? (
            <div className="cafe-option-row">
              <Choices
                label="温度"
                options={["冰饮", "温饮"]}
                value={r.temperature}
                disabled={!!job}
                onChange={(v) => set("temperature", v)}
              />
              <Choices
                label="甜度"
                options={["不加糖", "微甜", "标准甜"]}
                value={r.sweetness}
                disabled={!!job}
                onChange={(v) => set("sweetness", v)}
              />
            </div>
          ) : (
            <Choices
              label="夹心"
              options={["奶油", "果酱", "布丁"]}
              value={r.filling}
              disabled={!!job}
              onChange={(v) => set("filling", v)}
            />
          )}
          <Choices
            label={`03 · 最后的装饰 ${r.toppings.length}/3`}
            options={toppings}
            value={r.toppings}
            disabled={!!job}
            onChange={(id) => dispatch({ type: "TOPPING", id })}
          />
          <label className="cafe-name">
            给这份创意起个名字
            <input
              disabled={!!job}
              maxLength={20}
              value={r.name}
              placeholder="例如：云朵上的草莓"
              onChange={(e) => set("name", e.target.value)}
            />
          </label>
          <p className="cafe-fine">开始后配方会固定，按步骤完成制作。</p>
        </div>
      </div>
      {tab === "shelf" && (
        <section className="cafe-panel">
          <div className="cafe-panel-heading">
            <div>
              <small>FRESH FROM YOUR HANDS</small>
              <h2>今日小小展示柜</h2>
              <p>每位客人每天享用一份。属性为配方生成的游戏数值。</p>
            </div>
            <button onClick={() => setTab("work")}>继续制作 ＋</button>
          </div>
          {!state.shelf.length ? (
            <div className="cafe-empty">
              <span>♧</span>
              <h3>第一份甜蜜，还在等待出炉</h3>
              <p>去制作台完成三个步骤，成品就会出现在这里。</p>
            </div>
          ) : (
            <div className="cafe-products">
              {state.shelf.map((item) => (
                <Product key={item.id} {...{ item, state, dispatch }} />
              ))}
            </div>
          )}
        </section>
      )}
      {tab === "guests" && (
        <section className="cafe-panel">
          <div className="cafe-panel-heading">
            <div>
              <small>LITTLE VISITORS</small>
              <h2>窗边有谁在休息？</h2>
              <p>店内时钟决定来客；错过也没关系，明天还会再见。</p>
            </div>
            <button onClick={next}>等下一位 →</button>
          </div>
          <div className="cafe-animals">
            {animals.map((a) => {
              const active = visitors.some((v) => v.id === a.id),
                served = state.served[visitKey(state.minutes, a.id)];
              return (
                <article key={a.id} className={active ? "present" : ""}>
                  <span className="cafe-animal-face">
                    {
                      {
                        rabbit: "🐰",
                        squirrel: "🐿️",
                        bear: "🐻",
                        cat: "🐱",
                        fox: "🦊",
                        owl: "🦉",
                      }[a.ear]
                    }
                  </span>
                  <div>
                    <h3>
                      {a.name} <small>{a.species}</small>
                    </h3>
                    <p>{a.wish}</p>
                    <small>
                      {String(a.from).padStart(2, "0")}:00 — {a.to}:00
                    </small>
                  </div>
                  <span className="cafe-guest-state">
                    {active ? (served ? "用餐后休息" : "正在店里") : "尚未到访"}
                  </span>
                </article>
              );
            })}
          </div>
          {state.guests.length > 0 && (
            <div className="cafe-guest-book">
              <h3>客人留言</h3>
              {state.guests.map((g, i) => (
                <p key={i}>
                  <b>{g.visitor}</b> · {g.item}
                  <br />「{g.text}」<small> ＋{g.stars} 颗感谢星</small>
                </p>
              ))}
            </div>
          )}
        </section>
      )}
      {tab === "book" && (
        <section className="cafe-panel">
          <div className="cafe-panel-heading">
            <div>
              <small>COLLECT THE GOOD TASTES</small>
              <h2>我的手写配方本</h2>
              <p>最多收藏 12 张配方，本次打开期间保留。</p>
            </div>
          </div>
          {!state.collection.length ? (
            <div className="cafe-empty">
              <span>▤</span>
              <h3>把喜欢的搭配，留给下次</h3>
              <p>点击制作台上的「收藏配方」保存搭配。</p>
            </div>
          ) : (
            <div className="cafe-recipe-book">
              {state.collection.map((r, i) => (
                <article key={i}>
                  <small>RECIPE No. {String(i + 1).padStart(2, "0")}</small>
                  <h3>{recipeTitle(r)}</h3>
                  <p>
                    {r.kind === "drink"
                      ? `${r.temperature} · ${r.sweetness}`
                      : `${r.filling}夹心`}
                    <br />
                    {r.toppings
                      .map((id) => toppings.find((t) => t.id === id).name)
                      .join(" / ") || "无装饰"}
                  </p>
                  <button
                    disabled={!!job}
                    onClick={() => {
                      dispatch({ type: "LOAD", index: i });
                      setTab("work");
                    }}
                  >
                    调出配方 →
                  </button>
                  <button
                    aria-label={`删除配方${recipeTitle(r)}`}
                    onClick={() =>
                      dispatch({ type: "DELETE_RECIPE", index: i })
                    }
                  >
                    删除
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
      <aside className="cafe-feedback">
        <div className="cafe-assistant-avatar">N</div>
        <div className="cafe-feedback-content">
          <div className="cafe-feedback-heading">
            <h2>Null · 制作助手</h2>
            <span>本地规则反馈</span>
          </div>
          <p aria-live="polite">{state.feedback.at(-1)?.text}</p>
          <details>
            <summary>看看制作记录</summary>
            <ol>
              {state.feedback
                .slice()
                .reverse()
                .map((f) => (
                  <li key={f.id}>
                    <time>{timeText(f.time)}</time>
                    {f.text}
                  </li>
                ))}
            </ol>
            <p className="cafe-fine">
              反馈读取材料选择与制作步骤，尚未连接 AI 模型，也不读取摄像头。
            </p>
            <button onClick={() => onShare(recipeSummary(state))}>
              把记录带到聊天草稿 →
            </button>
          </details>
        </div>
      </aside>
      <footer className="cafe-footer">
        {visitors.length
          ? `${visitors.map((v) => v.name).join("、")}正在店里休息`
          : "小店暂时打烊，制作台仍可使用"}
        <span>配方、成品与记录在本次打开期间保留</span>
      </footer>
    </section>
  );
}
