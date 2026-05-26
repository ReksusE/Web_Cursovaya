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
import Toast from "./Toast.js"; // <-- Импорт

(async () => {
    const toastManager = new Toast(); // <-- Инициализация
    const favoritesManager = new Favorites();
    const modalManager = new Modal();
    
    // Передаем toastManager туда, где он нужен
    const userPanel = new UserPanel(modalManager);
    const profileEdit = new ProfileEdit(modalManager, userPanel, toastManager); // <-- Передача
    const auth = new Auth(toastManager); // <-- Передача (нужно обновить Auth.js)
    
    new Concepts(favoritesManager);
    new Header();
    new Hero();
    new TrustSlider();
    new Product();
    new FounderSlider();
    new Timeline();
    new Portfolio();

    if (document.querySelector('[data-js-favorites-grid]')) {
        favoritesManager.renderPage();
    }
})();