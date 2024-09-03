import { initHamburgerMenu } from "./hamburger.js";
import { initNavigation, initScrollNavigation } from "./navigation.js";
import { initSectionHighlighting } from "./timeline.js";
import { initializeLanguageSwitcher, changeLanguage } from "./lang.js";

initHamburgerMenu();
initNavigation();
initScrollNavigation();
initSectionHighlighting();
initializeLanguageSwitcher();

window.changeLanguage = changeLanguage;
