import Utils from './services/utils.js';

import Registration from './views/pages/registration.js';
import Authorization from './views/pages/authorization.js';
import Creation from './views/pages/creation.js';
import Main from './views/pages/main.js';
import Location from './views/pages/location.js';
import Error404 from './views/pages/error404.js';
import MapSearch from './views/pages/map_search.js';

import SignedInHeader from './views/components/signed_in_header.js';
import NotSignedInHeader from './views/components/not_signed_header.js';
import Footer from './views/components/footer.js';


// List of supported routes. Any url other than these routes will throw a 404 error
const routes = {
    '/'                     : Main
    , '/main'               : Main
    , '/location/:id'       : Location
    , '/authorization'      : Authorization
    , '/creation/:id'       : Creation
    , '/registration'       : Registration
    , '/map'                : MapSearch
};


// The router code. Takes a URL, checks against the list of supported routes and then renders the corresponding content page.
const router = async () => {
    const header = null || document.querySelector('header');
    const main = null || document.querySelector('main');
    const footer = null || document.querySelector('footer');

    // Get the parsed URl from the addressbar
    let request = Utils.parseRequestURL()

    // Parse the URL and if it has an id part, change it with the string ":id"
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')

    // Get the page from our hash of supported routes.
    // If the parsed URL is not in our list of supported routes, select the 404 page instead
    let page = routes[parsedURL] ? routes[parsedURL] : Error404;
    if (page == Main || page == Location || page == MapSearch) {
        await firebase.auth().onAuthStateChanged(async function(user) {
            if (user) {
                header.innerHTML = await SignedInHeader.render();
                await SignedInHeader.afterRender();
            } else {
                header.innerHTML = await NotSignedInHeader.render();
                await NotSignedInHeader.afterRender();
            }
        });
        if (page == Location)
        {
            main.innerHTML = await page.render(request.id);
            await page.afterRender(request.id);
        } 
        else
        {
            main.innerHTML = await page.render();
            await page.afterRender();
        }
        footer.innerHTML = await Footer.render();
        await Footer.afterRender();
    }
    else if (page == Creation) {
        header.innerHTML = ``;
        main.innerHTML = await page.render();
        await page.afterRender(request.id);
        footer.innerHTML = ``;
    }
    else {
        header.innerHTML = ``;
        main.innerHTML = await page.render();
        await page.afterRender();
        footer.innerHTML = ``;
    }

}

// Listen on hash change:
window.addEventListener('hashchange', router);

// Listen on page load:
window.addEventListener('load', router);
