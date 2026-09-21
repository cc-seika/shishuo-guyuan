const STORAGE_KEY = "shishuo-favorite-routes";

const ROUTES = {
  culture: { name: "文化研学线", summary: "古村文脉与耕读故事", url: "/pages/guide/guide" },
  leisure: { name: "休闲体验线", summary: "清廉茶社与水乡漫游", url: "/pages/leisure/leisure" },
  family: { name: "亲子探索线", summary: "自然课堂与非遗手作", url: "/pages/family/family" },
};

function getFavoriteRoutes() {
  const saved = wx.getStorageSync(STORAGE_KEY);
  if (!Array.isArray(saved)) return [];
  return saved.filter((route) => ROUTES[route]);
}

function isFavorite(route) {
  return getFavoriteRoutes().includes(route);
}

function toggleFavorite(route) {
  const favorites = getFavoriteRoutes();
  const index = favorites.indexOf(route);
  const saved = index === -1;
  if (saved) favorites.push(route);
  else favorites.splice(index, 1);
  wx.setStorageSync(STORAGE_KEY, favorites);
  return saved;
}

function getFavoriteDetails() {
  return getFavoriteRoutes().map((id) => ({ id, ...ROUTES[id] }));
}

module.exports = {
  ROUTES,
  getFavoriteDetails,
  isFavorite,
  toggleFavorite,
};
