const screens = {
  login: {
    src: "./assets/login.jpg?v=flow-6",
    alt: "师说古渊登录页",
    title: "登录｜师说古渊",
  },
  home: {
    src: "./assets/home.jpg?v=flow-6",
    alt: "师说古渊首页",
    title: "师说古渊",
  },
  culture: {
    src: "./assets/guide-culture.jpg?v=flow-6",
    alt: "师说古渊文化研学线导览页",
    title: "文化研学线｜师说古渊",
  },
  leisure: {
    src: "./assets/guide-leisure.jpg?v=flow-6",
    alt: "师说古渊休闲体验线导览页",
    title: "休闲体验线｜师说古渊",
  },
  mine: {
    src: "./assets/mine.jpg?v=flow-6",
    alt: "师说古渊我的页面",
    title: "我的｜师说古渊",
  },
};

const image = document.querySelector("#screen-image");
const screenLayers = [...document.querySelectorAll("[data-screen-layer]")];
const consentButton = document.querySelector(".login-consent");
const toast = document.querySelector("#toast");
const previewLayout = document.querySelector(".preview-layout");
const phone = document.querySelector(".phone");
let consentAccepted = false;
let toastTimer;
let resizeFrame;

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
  if (["login", "home", "culture", "leisure", "mine"].includes(action)) go(action);
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
