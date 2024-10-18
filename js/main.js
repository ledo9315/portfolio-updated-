import { initHamburgerMenu } from "./hamburger.js";
import { initNavigation, initScrollNavigation } from "./navigation.js";
import { initSectionHighlighting } from "./timeline.js";
import { initializeLanguageSwitcher, changeLanguage } from "./lang.js";
import { Toast } from "./toast.js";

initHamburgerMenu();
initNavigation();
initScrollNavigation();
initSectionHighlighting();
initializeLanguageSwitcher();
new Toast();

window.changeLanguage = changeLanguage;
