import Header from "./Header.js"
import Hero from "./Hero.js"
import TrustSlider from "./TrustSlider.js"
import Concepts from "./Concepts.js"
import Product from "./Product.js"
import FounderSlider from "./FounderSlider.js"
import TimeLine from "./TimeLine.js"
import Portfolio from "./Portfolio.js"
import Auth from "./Auth.js"

(async () => {
    new Auth()
    new Concepts();
    new Header()
    new Hero()
    new TrustSlider()
    new Product()
    new FounderSlider()
    new TimeLine()
    new Portfolio()
})();