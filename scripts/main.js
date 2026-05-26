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

(async () => {
    const favoritesManager = new Favorites();
    const modalManager = new Modal();             
    const userPanel = new UserPanel(modalManager); 
    const profileEdit = new ProfileEdit(modalManager, userPanel); 

    new Auth();
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