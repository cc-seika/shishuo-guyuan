const STORAGE_KEY = "shishuo-ai-history";

const AI_LOCATIONS = {
  "ai-guide-one": { name: "古渊头村总览", summary: "村史溯源 · 古樟问道广场", url: "/pages/ai-guide-one/ai-guide-one" },
  "ai-guide-two": { name: "博士文化展厅", summary: "AI讲解员 · 下一站", url: "/pages/ai-guide-two/ai-guide-two" },
};

function getAIHistory() {
  const saved = wx.getStorageSync(STORAGE_KEY);
  if (!Array.isArray(saved)) return [];
  return saved.filter((item) => AI_LOCATIONS[item.page]).slice(0, 12);
}

function recordAIVisit(page) {
  if (!AI_LOCATIONS[page]) return;
  const now = new Date();
  const visitedAt = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const history = getAIHistory().filter((item) => item.page !== page);
  history.unshift({ page, visitedAt });
  wx.setStorageSync(STORAGE_KEY, history.slice(0, 12));
}

function getAIHistoryDetails() {
  return getAIHistory().map((item, index) => ({
    ...item,
    ...AI_LOCATIONS[item.page],
    index: index + 1,
  }));
}

module.exports = {
  AI_LOCATIONS,
  getAIHistoryDetails,
  recordAIVisit,
};
