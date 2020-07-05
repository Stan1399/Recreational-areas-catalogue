import dbHelper from '../../services/db.js';

let Main = {

    locationList : new Array(),

    locationList4Search : new Array(),

    numberOfLocationsOnPage : 3,

    currentNumberOfLocationOnPage : 0,

    lastKnownKeyValue : null,

    render: async () => {
        if (window.matchMedia("(min-width: 1000px)").matches)
            return /*html*/`
            <main>
                <div class="flex-row">
                    <div class="search">
                        <div class="sticky"> 
                            <button type="button" class="collapsible">Show search bar</button>
                            <form class="search-form" id="search-form">
                                <input type="input" class="search-input" id="name" placeholder="Location's name">
                                <input type="input" class="search-input" id="country" placeholder="Country">
                                <input type="input" class="search-input" id="region" placeholder="Region">
                                <input type="input" class="search-input" id="settlement" placeholder="Settlement">
                                <input type="input" class="search-input" id="street" placeholder="Street">
                                <div class="buttons">
                                    <button id="search">Search</button>   
                                    <button id="clear">Clear</button> 
                                </div>
                            </form>
                            <div id="map" class="map-main"></div>
                        </div>
                    </div>
                    <div class="content">
                        <ul class="list" id="ul-for-rendering">
                            ${await Main.renderLi()}
                        </ul>
                        <button id="load-more">Load more</button>
                    </div>
                </div>
            </main>
            `;
        else
            return /*html*/`
                <form class="search-form-mobile" id="search-form">
                    <h2>Type here location data to find yours!</h2>
                    <input type="input" id="name" placeholder="Location's name">
                    <input type="input" id="country" placeholder="Country">
                    <input type="input" id="region" placeholder="Region">
                    <input type="input" id="settlement" placeholder="Settlement">
                    <input type="input" id="street" placeholder="Street">
                    <div class="buttons">
                        <button id="search">Search</button>   
                        <button id="clear">Clear</button> 
                    </div>
                </form>
                <div class="content-mobile">
                    <ul class="list" id="ul-for-rendering">
                        ${await Main.renderLi()}
                    </ul>
                    <button id="load-more">Load more</button>
                    <div id="map" class="map-main-mobile"></div>
                </div>
            `;
    },
    
    renderLi: async () => {
        let markup = ``;
        Main.locationList = new Array();
        const topUserPostsRef = firebase.database().ref('locations/').orderByKey().limitToFirst(Main.numberOfLocationsOnPage);
        await topUserPostsRef.once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                Main.locationList.push(childSnapshot.val());
                Main.locationList[Main.locationList.length-1].key = Main.lastKnownKeyValue = childSnapshot.key;
            });
          });
        for(let i = 0; i < Main.locationList.length; i++) {
            markup += `
                <li class="item">
                    <div class="major-info">
                        <img class="item-image" id="item-image${i}" alt="Sorry. The picture was not found:(" >
                        <div class="info">
                            <h3>${Main.locationList[i].name}</h3>
                            <ul>
                                <li><p>${Main.locationList[i].country}</p></li>
                                <li><p>${Main.locationList[i].region}</p></li>
                                <li><p>${Main.locationList[i].settlement}</p></li>
                            </ul>
                        </div>
                    </div>
                    <p class="paragraph">${Main.locationList[i].description}</p>
                    <div class="flex">
                        <a class="details-button styled" href="#/location/${Main.locationList[i].key}">Details</a>
                        <p id="rating${i}">Rating${i}</p>
                        <p id="votes${i}">Votes${i}</p>
                    </div>
                </li>
            `;
        }
        Main.currentNumberOfLocationOnPage = Main.locationList.length
        return markup;
    },
    
    afterRender: async () => {
        for (let i = 0; i < Main.locationList.length; i++) {
            const p = document.getElementById(`rating${i}`);
            p.textContent = "Rating: " + await dbHelper.getRatingById(Main.locationList[i].key);
            const p_votes = document.getElementById(`votes${i}`);
            p_votes.textContent = "Votes: " + await dbHelper.getVotesById(Main.locationList[i].key);
            
            var curFiles = await dbHelper.getImageByLocationId(Main.locationList[i].key);
            if(curFiles.length > 0) {
                var image = document.getElementById(`item-image${i}`);
                image.src = await dbHelper.getTheDownloadURL(curFiles[0].fullPath);
            }
        }

        var map  = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
        });
        var infoWindow = new google.maps.InfoWindow;

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('You are here!');
            var marker = new google.maps.Marker({position: pos, map: map, icon:"images/ellipse_marker.png"});
            infoWindow.open(map, marker);
            map.setCenter(pos);
          }, function() {
            alert("To use map serveces enable geolocation!");
          });
        } else {
            alert("Location detection functions are not supported!");
        }
        // document.getElementById('map-main').style.cssText = `position: sticky`;
        Main.locationList.forEach(element => {
            var locationInfoWindow = new google.maps.InfoWindow({
                content: element.name,

            });
            var locationMarker = new google.maps.Marker({
                position: {lat: Number(element.latitude), lng: Number(element.longtitude)}, 
                map: map,
                title: element.name
            });
            locationMarker.addListener('click', function() {
                locationInfoWindow.open(map, locationMarker);
              });
        });
        const btn = document.getElementById("load-more");
        const ul = document.getElementById("ul-for-rendering");
        btn.addEventListener("click", async e => {
            e.preventDefault();

            var diff = 0;
            Main.locationList.pop();
            const locationListRef = firebase.database().ref('locations/').orderByKey().startAt(Main.lastKnownKeyValue).limitToFirst(Main.numberOfLocationsOnPage + 1);
            await locationListRef.once('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    Main.locationList.push(childSnapshot.val());
                    Main.locationList[Main.locationList.length-1].key = Main.lastKnownKeyValue = childSnapshot.key;
                    diff += 1;
                });
              });
            diff -= 1;
            for (var i = 0 ; i < diff; i++)
                createLi(i);
            if (diff == 0)
            {
                btn.hidden = true;
                var h5 = document.createElement('h5');
                h5.innerHTML =
                `
                    There are no more locations here. We hope that you found above a good one!
                `;
                ul.appendChild(h5);
            }
            Main.currentNumberOfLocationOnPage += diff;
        })

        const searchForm = document.getElementById("search-form");
        const searchBtn = document.getElementById("search");
        searchBtn.addEventListener("click", async e => {
            e.preventDefault();
            const name = searchForm["name"].value.toLowerCase();
            const country = searchForm["country"].value.toLowerCase();
            const region = searchForm["region"].value.toLowerCase();
            const settlement = searchForm["settlement"].value.toLowerCase();
            const street = searchForm["street"].value.toLowerCase();
            Main.locationList.pop();
            const locationListRef = firebase.database().ref('locations/').orderByKey().startAt(Main.lastKnownKeyValue);
            await locationListRef.once('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    Main.locationList.push(childSnapshot.val());
                    Main.locationList[Main.locationList.length-1].key = Main.lastKnownKeyValue = childSnapshot.key;
                });
              });
            Main.currentNumberOfLocationOnPage = 0;
            var temp4CurrentNumberOfLocations = 0;
            var currentNumber = 0;
            ul.innerHTML = ``;
            Main.locationList.forEach(element => {
                if ((name == '' || (element.name.toLowerCase().indexOf(name) != -1)) && 
                (country == '' || (element.country.toLowerCase().indexOf(country) != -1)) && 
                (region == '' || (element.region.toLowerCase().indexOf(region) != -1)) && 
                (settlement == '' || (element.settlement.toLowerCase().indexOf(settlement) != -1)) &&
                (street == '' || (element.street.toLowerCase().indexOf(street) != -1)))
                {
                    createLi(currentNumber);
                    temp4CurrentNumberOfLocations += 1;
                }
                currentNumber += 1;
            });
            if(temp4CurrentNumberOfLocations == 0)
                ul.innerHTML = `<h5>Your query returned no results :(`
            Main.currentNumberOfLocationOnPage = temp4CurrentNumberOfLocations;
        })

        async function createLi(i) {
            var newLi = document.createElement('li');
            newLi.setAttribute('class', 'item');
            var ind = i + Main.currentNumberOfLocationOnPage;
            newLi.innerHTML =
            `
                <div class="major-info">
                    <img class="item-image" id="item-image${ind}" alt="Sorry. The picture was not found:(" >
                    <div class="info">
                        <h3>${Main.locationList[ind].name}</h3>
                        <ul>
                            <li><p>${Main.locationList[ind].country}</p></li>
                            <li><p>${Main.locationList[ind].region}</p></li>
                            <li><p>${Main.locationList[ind].settlement}</p></li>
                        </ul>
                    </div>
                </div>
                <p class="paragraph">${Main.locationList[ind].description}</p>
                <div class="flex">
                    <a class="details-button styled" href="#/location/${Main.locationList[ind].key}">Details</a>
                    <p id="rating${ind}">Rating${ind}</p>
                    <p id="votes${ind}">Votes${ind}</p>
                </div>
            `;
            ul.appendChild(newLi);
            
            const p = document.getElementById(`rating${ind}`);
            p.textContent = "Rating: " + await dbHelper.getRatingById(Main.locationList[ind].key);
            const p_votes = document.getElementById(`votes${ind}`);
            p_votes.textContent = "Votes: " + await dbHelper.getVotesById(Main.locationList[ind].key);
            var curFiles = await dbHelper.getImageByLocationId(Main.locationList[ind].key);
            if(curFiles.length > 0) {
                var image = document.getElementById(`item-image${ind}`);
                image.src = await dbHelper.getTheDownloadURL(curFiles[0].fullPath);
            }
            var locationInfoWindow = new google.maps.InfoWindow({
                content: Main.locationList[ind].name,
            });
            var locationMarker = new google.maps.Marker({
                position: {lat: Number(Main.locationList[ind].latitude), lng: Number(Main.locationList[ind].longtitude)}, 
                map: map,
                title: Main.locationList[ind].name
            });
            locationMarker.addListener('click', function() {
                locationInfoWindow.open(map, locationMarker);
              });
        }

        const clearBtn = document.getElementById("clear");
        clearBtn.addEventListener("click",async e => {
            e.preventDefault();
            Main.locationList = new Array();
            Main.locationList4Search = new Array();
            Main.currentNumberOfLocationOnPage = 0;
            Main.lastKnownKeyValue = 0;

            const ul = document.getElementById("ul-for-rendering");
            ul.innerHTML = await Main.renderLi()
            const btn = document.getElementById("load-more");
            btn.hidden = false;
            const searchForm = document.getElementById("search-form");
            searchForm["name"].value = "";
            searchForm["country"].value = "";
            searchForm["region"].value = "";
            searchForm["settlement"].value = "";
            searchForm["street"].value = "";
            for (let i = 0; i < Main.locationList.length; i++) {
                const p = document.getElementById(`rating${i}`);
                p.textContent = "Rating: " + await dbHelper.getRatingById(Main.locationList[i].key);
                const p_votes = document.getElementById(`votes${i}`);
                p_votes.textContent = "Votes: " + await dbHelper.getVotesById(Main.locationList[i].key);
                var curFiles = await dbHelper.getImageByLocationId(Main.locationList[i].key);
                if(curFiles.length > 0) {
                    var image = document.getElementById(`item-image${i}`);
                    image.src = await dbHelper.getTheDownloadURL(curFiles[0].fullPath);
                }
            }
        })

        var coll = document.getElementsByClassName("collapsible");
        for (let i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            });
        }
    }
};

export default Main;