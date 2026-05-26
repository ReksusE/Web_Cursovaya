import Header from "./Header.js"
import UserPanel from "./UserPanel.js"
import Hero from "./Hero.js"
import TrustSlider from "./TrustSlider.js"
import Concepts from "./Concepts.js"
import Product from "./Product.js"
import FounderSlider from "./FounderSlider.js"
import TimeLine from "./TimeLine.js"
import Portfolio from "./Portfolio.js"
import Auth from "./Auth.js"
import Favorites from "./Favorite.js"

(async () => {
    const favoritesManager = new Favorites();

    new Auth()
    new Concepts(favoritesManager);
    new Header()
    new UserPanel()
    new Hero()
    new TrustSlider()
    new Product()
    new FounderSlider()
    new TimeLine()
    new Portfolio()

    if (document.querySelector('[data-js-favorites-grid]')) {
        favoritesManager.renderPage();
    }
})();