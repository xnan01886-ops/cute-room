// Pure local simulation. Events are structured so a future model integration can
// receive the same ingredient/step/result context without claiming screen access.
export const drinkBases = [
  { id: "milk", name: "鲜牛奶", color: "#f7ead6" },
  { id: "oat", name: "燕麦奶", color: "#dccaac" },
  { id: "tea", name: "红茶", color: "#a67444" },
  { id: "cocoa", name: "可可", color: "#795042" },
  { id: "matcha", name: "抹茶", color: "#a7b67a" },
  { id: "coffee", name: "咖啡", color: "#725140" },
];
export const flavors = [
  { id: "strawberry", name: "草莓", color: "#eab1c0" },
  { id: "vanilla", name: "香草", color: "#efe0b8" },
  { id: "matcha", name: "抹茶", color: "#a7b67a" },
  { id: "cocoa", name: "巧克力", color: "#80574a" },
  { id: "peach", name: "蜜桃", color: "#efc3a4" },
];
export const toppings = [
  { id: "cream", name: "云朵奶油", icon: "☁", color: "#fff8e8" },
  { id: "berry", name: "草莓果粒", icon: "✿", color: "#db6f8c" },
  { id: "blueberry", name: "蓝莓", icon: "●", color: "#7281af" },
  { id: "pearls", name: "珍珠", icon: "◌", color: "#755749" },
  { id: "chocolate", name: "巧克力淋酱", icon: "▧", color: "#7e5245" },
  { id: "flower", name: "糖霜小花", icon: "❀", color: "#e9bccf" },
];
export const cakeTypes = [
  { id: "souffle", name: "舒芙蕾" },
  { id: "slice", name: "切块蛋糕" },
  { id: "cupcake", name: "纸杯蛋糕" },
];
export const animals = [
  {
    id: "momo",
    name: "桃桃",
    species: "小兔",
    from: 8,
    to: 12,
    color: "#f8eadd",
    ear: "rabbit",
    favorite: "strawberry",
    kind: "cake",
    wish: "想吃一份草莓味的小点心。",
    line: "草莓的香气好温柔，我想在窗边再坐一会儿。",
  },
  {
    id: "hazel",
    name: "栗栗",
    species: "松鼠",
    from: 10,
    to: 14,
    color: "#bf906e",
    ear: "squirrel",
    favorite: "cocoa",
    kind: "drink",
    wish: "想喝巧克力口味的饮品。",
    line: "这杯饮品，让赶路的时间也慢下来了。",
  },
  {
    id: "pudding",
    name: "布丁",
    species: "小熊",
    from: 12,
    to: 16,
    color: "#d8b389",
    ear: "bear",
    favorite: "vanilla",
    kind: "cake",
    wish: "最喜欢香草味的蛋糕。",
    line: "我把最后一口留到窗外的云飘过去再吃。",
  },
  {
    id: "mint",
    name: "薄荷",
    species: "小猫",
    from: 14,
    to: 18,
    color: "#b9c8c8",
    ear: "cat",
    favorite: "matcha",
    kind: "drink",
    wish: "来一杯抹茶风味的饮品吧。",
    line: "抹茶的颜色，像我刚刚散步经过的小花园。",
  },
  {
    id: "amber",
    name: "琥珀",
    species: "小狐狸",
    from: 16,
    to: 20,
    color: "#dfac7f",
    ear: "fox",
    favorite: "peach",
    kind: "cake",
    wish: "很想尝尝蜜桃口味的点心。",
    line: "今天的落日，也是一块蜜桃色的小蛋糕。",
  },
  {
    id: "moon",
    name: "月月",
    species: "猫头鹰",
    from: 18,
    to: 22,
    color: "#b8a7bf",
    ear: "owl",
    favorite: "cocoa",
    kind: "drink",
    wish: "夜晚想喝一杯可可风味的饮品。",
    line: "我会带着这份香气，去听今晚的风。",
  },
];
export const defaultRecipe = {
  kind: "drink",
  base: "milk",
  flavor: "strawberry",
  cake: "souffle",
  filling: "奶油",
  sweetness: "微甜",
  temperature: "冰饮",
  toppings: ["cream", "berry"],
  name: "",
};
export const initialCafeState = {
  minutes: 600,
  running: false,
  recipe: { ...defaultRecipe, toppings: [...defaultRecipe.toppings] },
  job: null,
  shelf: [],
  collection: [],
  served: {},
  guests: [],
  stars: 0,
  feedback: [
    {
      id: 0,
      time: 600,
      action: "welcome",
      text: "先选杯底和风味，再放上喜欢的装饰。配方预览会跟着你的选择变化。",
    },
  ],
  events: [],
  notice: "",
  sequence: 0,
};
export const timeText = (m) =>
  `${String(Math.floor((((m % 1440) + 1440) % 1440) / 60)).padStart(2, "0")}:${String(Math.floor(m % 60)).padStart(2, "0")}`;
export const visitorsAt = (m) =>
  animals.filter((a) => {
    const h = (m % 1440) / 60;
    return h >= a.from && h < a.to;
  });
export const visitKey = (minutes, id) => `${Math.floor(minutes / 1440)}:${id}`;
export function recipeTitle(r) {
  return (
    r.name.trim() ||
    `${flavors.find((f) => f.id === r.flavor)?.name || ""}${r.kind === "drink" ? drinkBases.find((b) => b.id === r.base)?.name : cakeTypes.find((c) => c.id === r.cake)?.name}`
  );
}
export function stepsFor(r) {
  return r.kind === "drink"
    ? [
        { name: "倒入杯底", verb: "倒入杯底", duration: 1800 },
        { name: "融合风味", verb: "搅拌调匀", duration: 2200 },
        { name: "加料装饰", verb: "加上装饰", duration: 1600 },
      ]
    : [
        { name: "混合面糊", verb: "混合面糊", duration: 2200 },
        {
          name: r.cake === "slice" ? "烘焙与切块" : "烘焙成形",
          verb: "开始烘焙",
          duration: 4200,
        },
        { name: "夹心装饰", verb: "完成装饰", duration: 1900 },
      ];
}
export function attributes(r) {
  return {
    taste: Math.min(
      98,
      72 + r.toppings.length * 4 + (r.flavor === "strawberry" ? 5 : 3),
    ),
    appearance: Math.min(99, 66 + r.toppings.length * 8),
    aroma: r.flavor === "cocoa" || r.flavor === "matcha" ? 94 : 85,
    portion: r.kind === "drink" ? 28 : r.cake === "slice" ? 72 : 58,
  };
}
export function tagsFor(r) {
  return [
    r.flavor === "cocoa"
      ? "超级巧克力控"
      : r.flavor === "strawberry"
        ? "草莓爱好者"
        : r.flavor === "matcha"
          ? "抹茶时光"
          : "温柔下午茶",
    r.kind === "drink" ? r.temperature : "现烤点心",
    r.toppings.length === 3 ? "装饰大师" : "手作小心意",
  ];
}
const cloneRecipe = (r) => ({ ...r, toppings: [...r.toppings] });
function emit(s, action, payload, text) {
  const seq = s.sequence + 1;
  const event = { id: seq, at: s.minutes, action, payload };
  return {
    ...s,
    sequence: seq,
    notice: "",
    events: [...s.events, event].slice(-80),
    feedback: [...s.feedback, { id: seq, time: s.minutes, action, text }].slice(
      -12,
    ),
  };
}
function advance(s, delta) {
  const minutes = s.minutes + Math.max(0, delta);
  const before = visitorsAt(s.minutes),
    after = visitorsAt(minutes);
  const names = after
    .filter(
      (a) =>
        !before.some((b) => b.id === a.id) ||
        Math.floor(s.minutes / 1440) !== Math.floor(minutes / 1440),
    )
    .map((a) => a.name);
  return emit(
    { ...s, minutes },
    "clock",
    { minutes },
    names.length
      ? `${names.join("、")}来到咖啡馆，已经找好位置休息。`
      : after.length
        ? "窗边还有客人正在休息。"
        : "现在是打烊时间。可以继续制作，或快进到明天早晨。",
  );
}
export function cafeReducer(s, a) {
  switch (a.type) {
    case "SET": {
      if (s.job) return { ...s, notice: "这份正在制作，请先完成或取消。" };
      const r = { ...s.recipe, [a.key]: a.value };
      if (a.key === "name") return { ...s, recipe: r };
      const names = {
        base: drinkBases.find((x) => x.id === a.value)?.name,
        flavor: flavors.find((x) => x.id === a.value)?.name,
        cake: cakeTypes.find((x) => x.id === a.value)?.name,
      };
      const text =
        a.key === "kind"
          ? a.value === "drink"
            ? "调饮台准备好了。先从喜欢的杯底开始。"
            : "烘焙台准备好了。选一种形状，再搭配风味和夹心。"
          : a.key === "base"
            ? `杯底换成${names.base}了。${a.value === "tea" ? "茶香会让果味更清爽。" : a.value === "cocoa" ? "可可的香气会更浓郁。" : "可以继续搭配果味或奶油。"}`
            : a.key === "flavor"
              ? `加一点${names.flavor}风味，${a.value === "matcha" ? "成品会染上一层柔和的绿色。" : a.value === "cocoa" ? "这次走浓郁的巧克力路线。" : "预览中的颜色已经改变了。"}`
              : `已选${names[a.key] || a.value}。这项选择会写进你的配方卡。`;
      return emit(
        { ...s, recipe: r },
        "ingredient",
        { key: a.key, value: a.value, recipe: cloneRecipe(r) },
        text,
      );
    }
    case "TOPPING": {
      if (s.job) return s;
      const has = s.recipe.toppings.includes(a.id);
      if (!has && s.recipe.toppings.length >= 3)
        return { ...s, notice: "最多搭配 3 种装饰，先取消一种再试试。" };
      const r = {
        ...s.recipe,
        toppings: has
          ? s.recipe.toppings.filter((t) => t !== a.id)
          : [...s.recipe.toppings, a.id],
      };
      return emit(
        { ...s, recipe: r },
        "topping",
        { id: a.id, added: !has, recipe: cloneRecipe(r) },
        `${has ? "拿掉" : "加上"}${toppings.find((t) => t.id === a.id).name}。${!has && a.id === "chocolate" ? "巧克力淋酱会沿着表面慢慢垂下来。" : "可以在三维预览里看看搭配。"}`,
      );
    }
    case "START": {
      if (s.job) return s;
      if (s.shelf.length >= 8)
        return { ...s, notice: "展示柜已经放满 8 份，先招待一位客人吧。" };
      const recipe = cloneRecipe(s.recipe);
      return emit(
        {
          ...s,
          job: { recipe, step: 0, busy: false, endsAt: 0, startedAt: 0 },
        },
        "start",
        { recipe },
        `开始制作「${recipeTitle(recipe)}」。配方已固定，我们按步骤来。`,
      );
    }
    case "STEP": {
      if (!s.job || s.job.busy || s.job.step >= 3) return s;
      const step = stepsFor(s.job.recipe)[s.job.step];
      return emit(
        {
          ...s,
          job: {
            ...s.job,
            busy: true,
            startedAt: a.now,
            endsAt: a.now + step.duration,
          },
        },
        "process",
        { step: s.job.step, name: step.name, recipe: s.job.recipe },
        s.job.step === 0
          ? `正在${step.name}。${s.job.recipe.kind === "drink" ? "杯底先就位，再加入风味。" : "面糊正在变得均匀细腻。"}`
          : s.job.step === 1
            ? `${step.name}进行中。${s.job.recipe.kind === "drink" ? "两层颜色正在慢慢融合。" : "小点心正在慢慢蓬松起来。"}`
            : `最后加上${s.job.recipe.toppings.length ? "喜欢的装饰" : "简洁的摆盘"}，马上就可以出品了。`,
      );
    }
    case "TICK": {
      if (!s.job?.busy || a.now < s.job.endsAt) return s;
      const step = s.job.step + 1;
      return emit(
        { ...s, job: { ...s.job, step, busy: false } },
        "step_complete",
        { step, recipe: s.job.recipe },
        step === 3
          ? "完成了！可以放进展示柜，准备招待客人。"
          : `${stepsFor(s.job.recipe)[step - 1].name}完成了。下一步：${stepsFor(s.job.recipe)[step].name}。`,
      );
    }
    case "FINISH": {
      if (!s.job || s.job.busy || s.job.step !== 3) return s;
      if (s.shelf.length >= 8)
        return { ...s, notice: "展示柜满了，请先招待客人。" };
      const item = {
        id: s.sequence + 1,
        recipe: cloneRecipe(s.job.recipe),
        madeAt: s.minutes,
        title: recipeTitle(s.job.recipe),
        attributes: attributes(s.job.recipe),
        tags: tagsFor(s.job.recipe),
      };
      return emit(
        { ...s, shelf: [...s.shelf, item], job: null },
        "finish",
        { item },
        `「${item.title}」已放进展示柜。${item.tags[0]}会喜欢这份创意。现在可以把它端给客人。`,
      );
    }
    case "CANCEL":
      return s.job
        ? emit(
            { ...s, job: null },
            "cancel",
            {},
            "这次制作已经取消，配方选项还在，可以重新调整。",
          )
        : s;
    case "ADVANCE":
      return advance(s, a.minutes);
    case "RUNNING":
      return { ...s, running: a.value };
    case "SAVE": {
      const recipe = cloneRecipe(s.job?.recipe || s.recipe);
      const key = JSON.stringify(recipe);
      if (s.collection.some((x) => JSON.stringify(x) === key))
        return { ...s, notice: "这张配方已经收进配方本了。" };
      if (s.collection.length >= 12)
        return { ...s, notice: "配方本已满 12 张，请先删除一张。" };
      return emit(
        { ...s, collection: [...s.collection, recipe] },
        "save_recipe",
        { recipe },
        `「${recipeTitle(recipe)}」已收进配方本，稍后可以一键调出。`,
      );
    }
    case "LOAD":
      return s.job
        ? { ...s, notice: "先完成或取消正在制作的这一份。" }
        : emit(
            { ...s, recipe: cloneRecipe(s.collection[a.index]) },
            "load_recipe",
            { index: a.index },
            "配方已经放到工作台，可以再改一点自己的创意。",
          );
    case "DELETE_RECIPE":
      return { ...s, collection: s.collection.filter((_, i) => i !== a.index) };
    case "SERVE": {
      const visitor = visitorsAt(s.minutes).find((v) => v.id === a.visitor);
      const item = s.shelf.find((x) => x.id === a.item);
      if (!visitor || !item)
        return { ...s, notice: "客人或点心状态已经改变，请重新选择。" };
      const key = visitKey(s.minutes, visitor.id);
      if (s.served[key])
        return { ...s, notice: "这位客人今天已经享用过点心了，正在休息。" };
      const matches =
        Number(item.recipe.flavor === visitor.favorite) +
        Number(item.recipe.kind === visitor.kind);
      const result = {
        visitor: visitor.name,
        species: visitor.species,
        item: item.title,
        stars: matches + 1,
        text:
          matches === 2
            ? visitor.line
            : matches === 1
              ? "有我喜欢的味道，谢谢这份新搭配！"
              : "这次尝到了不一样的搭配，谢谢你的招待。",
        at: s.minutes,
      };
      return emit(
        {
          ...s,
          shelf: s.shelf.filter((x) => x.id !== item.id),
          served: { ...s.served, [key]: result },
          guests: [result, ...s.guests].slice(0, 12),
          stars: s.stars + matches + 1,
        },
        "serve",
        result,
        `${visitor.name}收到了「${item.title}」。${result.text}`,
      );
    }
    default:
      return s;
  }
}
export function recipeSummary(state) {
  const r = state.job?.recipe || state.recipe;
  const recent = state.events
    .slice(-12)
    .map((e) => `${timeText(e.at)} ${e.action}`);
  return `【咖啡馆制作记录 · 本地模拟】\n${recipeTitle(r)}\n${r.kind === "drink" ? `杯底：${drinkBases.find((b) => b.id === r.base).name}；${r.temperature}；${r.sweetness}` : `点心：${cakeTypes.find((c) => c.id === r.cake).name}；夹心：${r.filling}`}\n风味：${flavors.find((f) => f.id === r.flavor).name}\n装饰：${r.toppings.map((id) => toppings.find((t) => t.id === id).name).join("、") || "无"}\n制作状态：${state.job ? `第 ${Math.min(state.job.step + 1, 3)} 步${state.job.busy ? "进行中" : ""}` : "工作台空闲"}\n最近步骤：\n${recent.join("\n")}`;
}
