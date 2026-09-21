import React, { useRef, useState } from "react";

const project = (x, y, z = 0) => [
  400 + (x - y) * 0.82,
  230 + (x + y) * 0.4 - z,
];
const points = (list) => list.map((p) => project(...p).join(",")).join(" ");
function Plane({ corners, ...props }) {
  return <polygon points={points(corners)} {...props} />;
}
function Box({
  x,
  y,
  w,
  d,
  h,
  z = 0,
  color = "#edbed0",
  top = "#ffe6ed",
  side = "#d29daf",
}) {
  return (
    <g stroke="#b98e98" strokeWidth="1.1" strokeLinejoin="round">
      <Plane
        corners={[
          [x, y, z + h],
          [x + w, y, z + h],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ]}
        fill={top}
      />
      <Plane
        corners={[
          [x, y + d, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ]}
        fill={color}
      />
      <Plane
        corners={[
          [x + w, y, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x + w, y, z + h],
        ]}
        fill={side}
      />
    </g>
  );
}
function Toy({ x, y, scale = 1 }) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke="#c2a7a4"
      strokeWidth="1.4"
    >
      <ellipse cx="-9" cy="-31" rx="7" ry="21" fill="#fff8ed" />
      <ellipse cx="9" cy="-31" rx="7" ry="21" fill="#fff8ed" />
      <ellipse cy="13" rx="20" ry="24" fill="#fff8ed" />
      <circle r="24" fill="#fff8ed" />
      <circle cx="-8" cy="-2" r="2" fill="#70575c" />
      <circle cx="8" cy="-2" r="2" fill="#70575c" />
      <ellipse cy="6" rx="3" ry="2" fill="#d999aa" />
      <ellipse cx="-15" cy="5" rx="4" ry="2" fill="#f1becb" />
      <ellipse cx="15" cy="5" rx="4" ry="2" fill="#f1becb" />
      <path d="M0 23L-12 18V29L0 23 12 18V29Z" fill="#e7a5bd" />
      <ellipse cx="-12" cy="34" rx="10" ry="6" fill="#fff8ed" />
      <ellipse cx="12" cy="34" rx="10" ry="6" fill="#fff8ed" />
    </g>
  );
}
export function RoomArt({
  lamp = false,
  blanket = false,
  interactive = true,
  onSelect = () => {},
}) {
  const hot = (name) =>
    interactive
      ? {
          role: "button",
          tabIndex: 0,
          "aria-label": name,
          onClick: () => onSelect(name),
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(name);
            }
          },
          className: "furniture",
        }
      : {};
  return (
    <svg
      className="room-art"
      viewBox="0 0 800 640"
      aria-label="奶油粉色公主房插画"
    >
      <defs>
        <filter id="room-shadow">
          <feDropShadow
            dx="0"
            dy="16"
            stdDeviation="14"
            floodColor="#ac7b85"
            floodOpacity=".16"
          />
        </filter>
        <radialGradient id="warm-light">
          <stop stopColor="#ffdc8e" stopOpacity=".8" />
          <stop offset="1" stopColor="#ffdc8e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="410" cy="538" rx="310" ry="45" fill="#ead7d3" opacity=".3" />
      <g filter="url(#room-shadow)">
        <Box
          x={0}
          y={0}
          w={400}
          d={350}
          h={14}
          z={-14}
          color="#ddc4bd"
          top="#fff4df"
          side="#c9b1ac"
        />
        {Array.from({ length: 13 }, (_, i) => (
          <Plane
            key={i}
            corners={[
              [0, i * 27],
              [400, i * 27],
              [400, i * 27 + 1],
              [0, i * 27 + 1],
            ]}
            fill="#e1ccbc"
          />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <Plane
            key={i}
            corners={[
              [i % 2 ? 80 : 220, i * 27],
              [i % 2 ? 81 : 221, i * 27],
              [i % 2 ? 81 : 221, i * 27 + 27],
              [i % 2 ? 80 : 220, i * 27 + 27],
            ]}
            fill="#e1ccbc"
          />
        ))}
        <Plane
          corners={[
            [0, 0, 0],
            [400, 0, 0],
            [400, 0, 190],
            [0, 0, 190],
          ]}
          fill="#f8e6e6"
          stroke="#cba5ad"
        />
        <Plane
          corners={[
            [0, 0, 0],
            [0, 350, 0],
            [0, 350, 190],
            [0, 0, 190],
          ]}
          fill="#f5edef"
          stroke="#cba5ad"
        />
        {Array.from({ length: 14 }, (_, i) => (
          <Plane
            key={i}
            corners={[
              [i * 29, 0, 0],
              [i * 29 + 12, 0, 0],
              [i * 29 + 12, 0, 188],
              [i * 29, 0, 188],
            ]}
            fill="#f1d8df"
            opacity=".6"
          />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <Plane
            key={i}
            corners={[
              [0, i * 29, 0],
              [0, i * 29 + 12, 0],
              [0, i * 29 + 12, 188],
              [0, i * 29, 188],
            ]}
            fill="#e9dee1"
            opacity=".65"
          />
        ))}
        <Box
          x={-4}
          y={-4}
          w={408}
          d={7}
          h={6}
          z={190}
          color="#e8c8d1"
          top="#fff9f2"
        />
        <Box
          x={-4}
          y={0}
          w={7}
          d={354}
          h={6}
          z={190}
          color="#e8c8d1"
          top="#fff9f2"
        />
        <Plane
          corners={[
            [0, 0, 18],
            [400, 0, 18],
            [400, 0, 22],
            [0, 0, 22],
          ]}
          fill="#fffaf4"
        />
        <Plane
          corners={[
            [0, 0, 18],
            [0, 350, 18],
            [0, 350, 22],
            [0, 0, 22],
          ]}
          fill="#fffaf4"
        />
        <Plane
          corners={[
            [1, 62, 62],
            [1, 164, 62],
            [1, 164, 165],
            [1, 62, 165],
          ]}
          fill="#dcebee"
          stroke="#fffefa"
          strokeWidth="7"
        />
        <Plane
          corners={[
            [2, 111, 62],
            [2, 114, 62],
            [2, 114, 165],
            [2, 111, 165],
          ]}
          fill="#fffefa"
        />
        <Plane
          corners={[
            [2, 62, 111],
            [2, 164, 111],
            [2, 164, 114],
            [2, 62, 114],
          ]}
          fill="#fffefa"
        />
        <Plane
          corners={[
            [4, 52, 55],
            [4, 76, 68],
            [4, 83, 170],
            [4, 52, 170],
          ]}
          fill="#e5b2c4"
          stroke="#ce94aa"
        />
        <Plane
          corners={[
            [4, 150, 68],
            [4, 174, 55],
            [4, 174, 170],
            [4, 143, 170],
          ]}
          fill="#e5b2c4"
          stroke="#ce94aa"
        />
        <path
          d="M440 89 Q530 177 693 188"
          fill="none"
          stroke="#c3a48d"
          strokeWidth="1.5"
        />
        {[460, 505, 553, 602, 651, 685].map((x, i) => (
          <text
            key={x}
            x={x}
            y={[119, 146, 164, 182, 192, 198][i]}
            fill={i % 2 ? "#d6b96e" : "#cf91ac"}
            fontSize="19"
          >
            {i % 2 ? "✧" : "♡"}
          </text>
        ))}
        <Plane
          corners={[
            [35, 193, 1],
            [250, 193, 1],
            [250, 320, 1],
            [35, 320, 1],
          ]}
          fill="#fffaf6"
          stroke="#e7b7c7"
          strokeWidth="3"
        />
        {Array.from({ length: 12 }, (_, i) => {
          const [x, y] = project(
            52 + (i % 4) * 54,
            210 + Math.floor(i / 4) * 42,
            2,
          );
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(1 .52)`}>
              <path d="M0 0Q-12-13-15 0T0 12Q12 22 15 7T0 0" fill="#f0c4d2" />
              <circle r="3" fill="#e4c374" />
            </g>
          );
        })}
        <g {...hot("床铺")}>
          <Box
            x={22}
            y={20}
            w={126}
            d={9}
            h={76}
            color="#eac4cf"
            top="#fff5e9"
          />
          <Box
            x={24}
            y={29}
            w={122}
            d={143}
            h={24}
            color="#fff6e9"
            side="#dcc0b8"
          />
          <Box
            x={28}
            y={34}
            w={114}
            d={130}
            h={12}
            z={24}
            color={blanket ? "#d5dfe8" : "#e9bbd0"}
            top={blanket ? "#e6f0f2" : "#f9dce7"}
            side="#ddb7c8"
          />
          <Box
            x={38}
            y={38}
            w={88}
            d={31}
            h={8}
            z={36}
            color="#fff9f1"
            top="#fffdf8"
            side="#e8d6d6"
          />
          {[80, 101, 122, 143].map((y) => (
            <Plane
              key={y}
              corners={[
                [30, y, 37],
                [140, y, 37],
                [140, y + 2, 37],
                [30, y + 2, 37],
              ]}
              fill="#fff9fa"
              opacity=".7"
            />
          ))}
          <Toy
            x={project(96, 96, 68)[0]}
            y={project(96, 96, 68)[1]}
            scale={0.63}
          />
        </g>
        <g {...hot("衣柜")}>
          <Box
            x={171}
            y={12}
            w={85}
            d={43}
            h={125}
            color="#e1abc2"
            top="#f5d4df"
            side="#bd8fa6"
          />
          {[177, 216].map((x) => (
            <Plane
              key={x}
              corners={[
                [x, 56, 10],
                [x + 33, 56, 10],
                [x + 33, 56, 116],
                [x, 56, 116],
              ]}
              fill="#eac0d0"
              stroke="#c894ac"
              strokeWidth="2"
            />
          ))}
          {[205, 221].map((x) => (
            <circle
              key={x}
              cx={project(x, 57, 62)[0]}
              cy={project(x, 57, 62)[1]}
              r="3"
              fill="#b8995b"
            />
          ))}
          <Box
            x={187}
            y={22}
            w={38}
            d={21}
            h={20}
            z={125}
            color="#edd9bc"
            top="#fff2dc"
            side="#d2bba3"
          />
        </g>
        <g {...hot("书桌")}>
          <Box x={284} y={12} w={7} d={55} h={50} color="#e9c9bf" />
          <Box x={368} y={12} w={7} d={55} h={50} color="#e9c9bf" />
          <Box
            x={277}
            y={10}
            w={108}
            d={62}
            h={7}
            z={50}
            color="#edd2d5"
            top="#fff7f3"
          />
          <Box
            x={299}
            y={21}
            w={36}
            d={6}
            h={29}
            z={57}
            color="#aebbcb"
            top="#e1d3e2"
          />
          <Box
            x={299}
            y={27}
            w={36}
            d={23}
            h={2}
            z={57}
            color="#d4becb"
            top="#e9dce6"
          />
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              x={350}
              y={27}
              w={23}
              d={24}
              h={4}
              z={57 + i * 4}
              color={i % 2 ? "#e4cfa8" : "#dbaebd"}
              top="#fff6e6"
            />
          ))}
          <Box
            x={313}
            y={80}
            w={44}
            d={34}
            h={24}
            color="#efcfdb"
            top="#fff0f0"
          />
          <Box
            x={313}
            y={109}
            w={44}
            d={6}
            h={50}
            color="#e9c5d1"
            top="#fff3ea"
          />
        </g>
        <g {...hot("沙发")}>
          <Box
            x={155}
            y={211}
            w={135}
            d={49}
            h={25}
            z={6}
            color="#e2c9c2"
            top="#fff3e7"
            side="#cbb7b3"
          />
          <Box
            x={155}
            y={251}
            w={135}
            d={12}
            h={54}
            z={6}
            color="#edd9d2"
            top="#fff5e9"
            side="#d5bfb9"
          />
          <Box x={157} y={211} w={13} d={49} h={38} z={6} color="#f8e8de" />
          <Box x={277} y={211} w={13} d={49} h={38} z={6} color="#f8e8de" />
          <Box
            x={179}
            y={230}
            w={28}
            d={13}
            h={24}
            z={31}
            color="#deb0c4"
            top="#f6d3de"
          />
          <Box
            x={238}
            y={230}
            w={28}
            d={13}
            h={24}
            z={31}
            color="#bfcfd7"
            top="#e4edef"
          />
          <Toy
            x={project(224, 230, 60)[0]}
            y={project(224, 230, 60)[1]}
            scale={0.46}
          />
        </g>
        <g {...hot("茶桌")}>
          <Box x={85} y={272} w={8} d={42} h={19} color="#ccb298" />
          <Box x={140} y={272} w={8} d={42} h={19} color="#ccb298" />
          <Box
            x={76}
            y={265}
            w={84}
            d={58}
            h={6}
            z={19}
            color="#d9b9ac"
            top="#fff4e8"
          />
          <Box
            x={111}
            y={281}
            w={28}
            d={26}
            h={4}
            z={25}
            color="#d9a9b9"
            top="#f4d6df"
          />
          <ellipse
            cx={project(93, 281, 26)[0]}
            cy={project(93, 281, 26)[1]}
            rx="9"
            ry="5"
            fill="#fffaf1"
            stroke="#caa5a5"
          />
          <text
            x={project(86, 282, 28)[0]}
            y={project(86, 282, 28)[1]}
            fontSize="16"
          >
            ☕
          </text>
        </g>
        <g {...hot("小夜灯")}>
          <Box
            x={155}
            y={83}
            w={27}
            d={30}
            h={28}
            color="#e6bdcc"
            top="#fff4e9"
          />
          {lamp && (
            <circle
              cx={project(168, 98, 70)[0]}
              cy={project(168, 98, 70)[1]}
              r="85"
              fill="url(#warm-light)"
              pointerEvents="none"
            />
          )}
          <path
            d={`M${project(168, 98, 30)}L${project(168, 98, 61)}`}
            stroke="#bd9a75"
            strokeWidth="3"
          />
          <path
            d={`M${project(168, 98, 61)[0] - 13} ${project(168, 98, 61)[1]}l6 -18h14l6 18Z`}
            fill={lamp ? "#ffe6a0" : "#fff6ea"}
            stroke="#caaa9e"
          />
        </g>
        <g {...hot("绿植")}>
          <Box
            x={339}
            y={252}
            w={25}
            d={25}
            h={31}
            color="#e4b8c7"
            top="#dac3b1"
          />
          <path
            d={`M${project(351, 264, 30)}v-53`}
            stroke="#809775"
            strokeWidth="3"
          />
          {[0, 1, 2, 3].map((i) => (
            <ellipse
              key={i}
              cx={project(351, 264, 42)[0] + (i % 2 ? 9 : -9)}
              cy={project(351, 264, 44 + i * 9)[1]}
              rx="12"
              ry="6"
              transform={`rotate(${i % 2 ? -35 : 35} ${project(351, 264, 42)[0] + (i % 2 ? 9 : -9)} ${project(351, 264, 44 + i * 9)[1]})`}
              fill={i % 2 ? "#a8ba91" : "#bdcba7"}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
export default function Room() {
  const [zoom, setZoom] = useState(1),
    [pan, setPan] = useState({ x: 0, y: 0 }),
    [lamp, setLamp] = useState(false),
    [blanket, setBlanket] = useState(false);
  const [note, setNote] = useState("点点房间里的家具，看看会发生什么。");
  const drag = useRef(null);
  function select(name) {
    if (name === "小夜灯") {
      setLamp(!lamp);
      setNote(lamp ? "小夜灯关好了。" : "小夜灯亮了，房间暖了一点。");
    } else if (name === "床铺") {
      setBlanket(!blanket);
      setNote("换一床柔软的被子，今天也好好休息。");
    } else
      setNote(
        {
          衣柜: "裙子、毛衣，还有一整格蝴蝶结。",
          书桌: "留一块安静的小角落，写下今天的新灵感。",
          沙发: "兔子玩偶已经在沙发上坐好了。",
          茶桌: "一杯热茶，一本书，慢慢度过下午。",
          绿植: "叶子舒展开了，今天也长高了一点。",
        }[name],
      );
  }
  return (
    <section className={`room-page ${lamp ? "lamp-on" : ""}`}>
      <div className="section-heading">
        <p className="eyebrow">A LITTLE PLACE TO DREAM</p>
        <h1>
          草莓小屋 <span>୨୧</span>
        </h1>
        <p>把喜欢的小东西，都安放在这里。</p>
      </div>
      <div
        className="room-stage"
        onPointerDown={(e) => {
          if (e.target.closest('[role="button"], button')) return;
          drag.current = { x: e.clientX, y: e.clientY, pan };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (drag.current)
            setPan({
              x: Math.max(
                -180,
                Math.min(180, drag.current.pan.x + e.clientX - drag.current.x),
              ),
              y: Math.max(
                -120,
                Math.min(120, drag.current.pan.y + e.clientY - drag.current.y),
              ),
            });
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <div
          className="room-position"
          style={{
            transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`,
          }}
        >
          <RoomArt lamp={lamp} blanket={blanket} onSelect={select} />
        </div>
        <div className="room-tools">
          <button
            aria-label="放大小屋"
            onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
          >
            ＋
          </button>
          <button
            aria-label="缩小小屋"
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
          >
            −
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
          >
            归位
          </button>
          <button aria-pressed={lamp} onClick={() => select("小夜灯")}>
            灯光
          </button>
        </div>
        <span className="room-stamp">SAYORI’S LITTLE ROOM</span>
      </div>
      <p className="room-note" role="status">
        ✧ {note}
      </p>
      <p className="hint">拖动画面 · ＋ / − 缩放 · 点击家具互动</p>
    </section>
  );
}
