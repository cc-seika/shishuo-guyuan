const screens = {
  login: {
    src: "./assets/login.jpg?v=flow-7",
    alt: "师说古渊登录页",
    title: "登录｜师说古渊",
  },
  home: {
    src: "./assets/home.jpg?v=flow-7",
    alt: "师说古渊首页",
    title: "师说古渊",
  },
  culture: {
    src: "./assets/guide-culture.jpg?v=flow-7",
    alt: "师说古渊文化研学线导览页",
    title: "文化研学线｜师说古渊",
  },
  leisure: {
    src: "./assets/guide-leisure.jpg?v=flow-7",
    alt: "师说古渊休闲体验线导览页",
    title: "休闲体验线｜师说古渊",
  },
  mine: {
    src: "./assets/mine.jpg?v=flow-7",
    alt: "师说古渊我的页面",
    title: "我的｜师说古渊",
  },
  family: {
    src: "./assets/guide-family.jpg?v=flow-7",
    alt: "师说古渊亲子探索线导览页",
    title: "亲子探索线｜师说古渊",
  },
  "ai-guide-1": {
    src: "./assets/ai-guide-1.jpg?v=flow-7",
    alt: "古渊头村AI讲解员第一页",
    title: "AI讲解员｜师说古渊",
  },
  "ai-guide-2": {
    src: "./assets/ai-guide-2.jpg?v=flow-7",
    alt: "古渊头村AI讲解员第二页",
    title: "AI讲解员下一站｜师说古渊",
  },
};

const routeDetails = {
  culture: { name: "文化研学线", summary: "古村文脉与耕读故事", page: "culture" },
  leisure: { name: "休闲体验线", summary: "清廉茶社与水乡漫游", page: "leisure" },
  family: { name: "亲子探索线", summary: "自然课堂与非遗手作", page: "family" },
};

const image = document.querySelector("#screen-image");
const screenLayers = [...document.querySelectorAll("[data-screen-layer]")];
const consentButton = document.querySelector(".login-consent");
const toast = document.querySelector("#toast");
const previewLayout = document.querySelector(".preview-layout");
const phone = document.querySelector(".phone");
const favoritesPanel = document.querySelector("#favorites-panel");
const favoritesList = document.querySelector("#favorites-list");
let consentAccepted = false;
let toastTimer;
let resizeFrame;
let favoriteRoutes = loadFavorites();

const DESIGN_WIDTH = 591;
const DESIGN_HEIGHT = 1280;
const DESIGN_RATIO = DESIGN_WIDTH / DESIGN_HEIGHT;

function numericStyle(style, property) {
  return Number.parseFloat(style.getPropertyValue(property)) || 0;
}

function fitPhoneToVisibleViewport() {
  if (!window.matchMedia("(max-width: 760px)").matches) {
    phone.style.removeProperty("--app-frame-width");
    phone.style.removeProperty("--app-frame-height");
    previewLayout.style.removeProperty("--app-viewport-height");
    return;
  }

  const viewport = window.visualViewport;
  const viewportWidth = viewport?.width || window.innerWidth;
  const viewportHeight = viewport?.height || window.innerHeight;
  const layoutStyle = window.getComputedStyle(previewLayout);
  const horizontalInsets =
    numericStyle(layoutStyle, "padding-left") + numericStyle(layoutStyle, "padding-right");
  const verticalInsets =
    numericStyle(layoutStyle, "padding-top") + numericStyle(layoutStyle, "padding-bottom");
  const availableWidth = Math.max(1, viewportWidth - horizontalInsets);
  const availableHeight = Math.max(1, viewportHeight - verticalInsets);

  let frameWidth = availableWidth;
  let frameHeight = frameWidth / DESIGN_RATIO;
  if (frameHeight > availableHeight) {
    frameHeight = availableHeight;
    frameWidth = frameHeight * DESIGN_RATIO;
  }

  previewLayout.style.setProperty("--app-viewport-height", `${viewportHeight}px`);
  phone.style.setProperty("--app-frame-width", `${frameWidth}px`);
  phone.style.setProperty("--app-frame-height", `${frameHeight}px`);
}

function scheduleViewportFit() {
  window.cancelAnimationFrame(resizeFrame);
  resizeFrame = window.requestAnimationFrame(fitPhoneToVisibleViewport);
}

function currentPage() {
  const page = window.location.hash.slice(1);
  return screens[page] ? page : "login";
}

function loadFavorites() {
  try {
    const saved = JSON.parse(window.localStorage.getItem("shishuo-favorite-routes") || "[]");
    return new Set(saved.filter((route) => routeDetails[route]));
  } catch {
    return new Set();
  }
}

function saveFavorites() {
  window.localStorage.setItem("shishuo-favorite-routes", JSON.stringify([...favoriteRoutes]));
}

function syncFavoriteButtons() {
  document.querySelectorAll('[data-action="toggle-favorite"]').forEach((button) => {
    const isSaved = favoriteRoutes.has(button.dataset.route);
    button.classList.toggle("is-saved", isSaved);
    button.setAttribute("aria-pressed", String(isSaved));
    button.setAttribute("aria-label", `${isSaved ? "取消收藏" : "收藏"}${button.dataset.routeName}`);
  });
}

function render(page, animate = true) {
  const next = screens[page] || screens.login;
  window.clearTimeout(toastTimer);
  toast.hidden = true;
  image.src = next.src;
  image.alt = next.alt;
  document.title = next.title;
  screenLayers.forEach((layer) => {
    layer.hidden = layer.dataset.screenLayer !== page;
  });
  favoritesPanel.hidden = true;
  syncFavoriteButtons();

  if (animate) {
    image.classList.remove("is-changing");
    requestAnimationFrame(() => image.classList.add("is-changing"));
  }
}

function go(page) {
  if (!screens[page]) return;
  const nextHash = `#${page}`;
  if (window.location.hash === nextHash) {
    render(page);
    return;
  }
  window.location.hash = nextHash;
  render(page);
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2400);
}

function toggleConsent() {
  consentAccepted = !consentAccepted;
  consentButton.setAttribute("aria-pressed", String(consentAccepted));
}

function toggleFavorite(button) {
  const route = button.dataset.route;
  if (!routeDetails[route]) return;
  const willSave = !favoriteRoutes.has(route);
  if (willSave) favoriteRoutes.add(route);
  else favoriteRoutes.delete(route);
  saveFavorites();
  syncFavoriteButtons();
  showToast(willSave ? `已收藏${routeDetails[route].name}` : `已取消收藏${routeDetails[route].name}`);
}

function showFavorites() {
  const savedRoutes = [...favoriteRoutes];
  favoritesList.replaceChildren();
  if (!savedRoutes.length) {
    const empty = document.createElement("p");
    empty.className = "favorites-empty";
    empty.textContent = "暂未收藏路线，去导览页收藏一条路线吧。";
    favoritesList.append(empty);
  } else {
    savedRoutes.forEach((route) => {
      const detail = routeDetails[route];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "favorite-route-item";
      button.dataset.action = detail.page;
      button.innerHTML = `<span class="favorite-route-star">★</span><span><strong>${detail.name}</strong><small>${detail.summary}</small></span><span class="favorite-route-arrow">›</span>`;
      favoritesList.append(button);
    });
  }
  favoritesPanel.hidden = false;
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  if (action === "toggle-consent") toggleConsent();
  if (action === "wechat-login") {
    if (!consentAccepted) {
      showToast("请先勾选并同意用户协议与隐私政策");
      return;
    }
    go("home");
  }
  if (action === "toggle-favorite") toggleFavorite(button);
  if (action === "show-favorites") showFavorites();
  if (action === "close-favorites") favoritesPanel.hidden = true;
  if (["login", "home", "culture", "leisure", "family", "mine", "ai-guide-1", "ai-guide-2"].includes(action)) go(action);
  if (action === "coming-soon") showToast(button.dataset.message);
});

window.addEventListener("hashchange", () => render(currentPage(), false));
window.addEventListener("resize", scheduleViewportFit, { passive: true });
window.visualViewport?.addEventListener("resize", scheduleViewportFit, { passive: true });
window.visualViewport?.addEventListener("scroll", scheduleViewportFit, { passive: true });

if (!window.location.hash) {
  history.replaceState(null, "", "#login");
}
render(currentPage(), false);
fitPhoneToVisibleViewport();
