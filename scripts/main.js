import Preloader from "./Preloader.js";
import Header from "./Header.js";
import UserPanel from "./UserPanel.js";
import Hero from "./Hero.js";
import TrustSlider from "./TrustSlider.js";
import Concepts from "./Concepts.js";
import Product from "./Product.js";
import FounderSlider from "./FounderSlider.js";
import Timeline from "./TimeLine.js";
import Portfolio from "./Portfolio.js";
import Auth from "./Auth.js";
import Favorites from "./Favorite.js";
import Modal from "./Modal.js";
import ProfileEdit from "./ProfileEdit.js";
import Toast from "./Toast.js";
import ThemeManager from "./ThemeManager.js";
import LangManager from "./LangManager.js";
import AdminPanel from "./Admin.js";
import AccessibilityPanel from "./AccessibilityPanel.js";


(async () => {
    const preloader = new Preloader();
    const toastManager = new Toast();
    const themeManager = new ThemeManager();
    const langManager = new LangManager(); 
    const favoritesManager = new Favorites();
    const modalManager = new Modal();
    
    window.toast = toastManager;
    const userPanel = new UserPanel(modalManager);
    const profileEdit = new ProfileEdit(modalManager, userPanel, toastManager); // <-- Передача
    const auth = new Auth(toastManager); 

    new AdminPanel(toastManager, modalManager);
    new Concepts(favoritesManager);
    new Header();
    new Hero();
    new TrustSlider();
    new Product(favoritesManager);
    new FounderSlider();
    new Timeline();
    new Portfolio();
    new AccessibilityPanel();

    if (document.querySelector('[data-js-favorites-grid]')) {
        favoritesManager.renderPage();
    }
})();