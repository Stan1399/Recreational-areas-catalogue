import dbHelper from '../../services/db.js';

let MapSearch = {

    render: async () => {
        if (window.matchMedia("(min-width: 1000px)").matches)
            return /*html*/`
            <div class="object-page-content">
                <div class="flex-row">
                    <div class="search-restrictions">
                        <label class="map-label-desktop">
                            <p class="map-p">Show top rated</p>
                            <input class="map-input" type="input" id="number" placeholder="How many do you want to see?">
                        </label>
                        <label class="map-label-desktop">
                            <p class="map-p">Show nearby</p>
                            <input class="map-input" type="input" id="nearby" placeholder="How many do you want to see?">
                        </label>
                    </div>
                    <div class="map-div">
                        <div id="map" class="map-object"></div>
                    </div>
                </div>
            </div>
            `;
        else
        return /*html*/`
                <label class="map-label-mobile"> 
                    <p class="map-p">Show top rated</p> 
                    <input class="map-input" type="input" id="number" placeholder="How many do you want to see?">
                </label>
                <label class="map-label-mobile">
                    <p class="map-p">Show nearby</p>
                    <input class="map-input" type="input" id="nearby" placeholder="How many do you want to see?">
                </label>
                <div class="map-search-map">
                    <div id="map" class="map-object"></div>
                </div>
        `;
    },

    afterRender: async () => {
        // const locationObj = await dbHelper.getObjectById("-M8UCCHznloGCZZbUk3H");
        const map  = new google.maps.Map(document.getElementById('map'), {
            zoom: 6
        });
        var currentLatitude = 0, currentLongtitude = 0;
        var infoWindow = new google.maps.InfoWindow;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                currentLatitude = Number(position.coords.latitude);
                currentLongtitude = Number(position.coords.longitude);
                infoWindow.setContent('You are here!');
                var marker = new google.maps.Marker({position: pos, map: map, icon:"images/ellipse_marker.png"});
                marker.addListener('mouseover', toggleBounce);
                function toggleBounce() {
                    if (marker.getAnimation() !== null) {
                        marker.setAnimation(null);
                    } else {
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                }   
                infoWindow.open(map, marker);
                map.setCenter(pos);
            }, function() {
                alert("To use map serveces enable geolocation!");
            });
        } else {
            alert("Location detection functions are not supported!");
        }
        const input = document.getElementById("number");
        var markerList = Array();
        var infoList = Array();
        input.addEventListener("input", async e => {
            if (inputNearby.value != "")
            {
                inputNearby.value = "";
                clearLists();
            }
            if (Number(input.value) && Number(input.value) < 2 * 10e9)
            {
                const topList = await dbHelper.getTopRated(Number(input.value));
                if (topList.length <= markerList.length)
                {
                    for (let i = topList.length; i < markerList.length; i++)
                    {    
                        markerList[i].setMap(null);
                        markerList[i] = null;
                        infoList[i] = null;
                    }
                    markerList.length = topList.length;
                    infoList.length = topList.length;
                }
                    
                else
                    for (let i = markerList.length; i < topList.length; i++)
                    {
                        setTimeout(function() {
                            markerList.push(new google.maps.Marker({
                                position: {lat: Number(topList[i].latitude), lng: Number(topList[i].longtitude)}, 
                                map: map, 
                                icon:"images/star_marker.png",
                                animation: google.maps.Animation.DROP
                            }));
                            infoList.push(new google.maps.InfoWindow({
                                content: `<div>`+`<a class="info-window" href="#/location/${topList[i].key}"/>${topList[i].name}</a>`+`</div>`
                            }))
                            markerList[i].addListener('click', function() {
                                infoList[i].open(map, markerList[i]);
                              });
                          }, i * 300);
                          
                    }
                        
            }
            else if (input.value == "")
            {
                clearLists();
            }
            else
            {
                alert("Input should be a positive number!");
                input.value = "";
            }
        })
        const inputNearby = document.getElementById("nearby");
        inputNearby.addEventListener("input", async e => {
            if (input.value != "")
            {
                input.value = "";
                clearLists();
            }
            if (Number(inputNearby.value) && Number(inputNearby.value) < 2 * 10e9)
            {
                const topList = await dbHelper.getClosest(Number(inputNearby.value), currentLatitude, currentLongtitude);
                if (topList.length <= markerList.length) {
                    for (let i = topList.length; i < markerList.length; i++) {    
                        markerList[i].setMap(null);
                        markerList[i] = null;
                        infoList[i] = null;
                    }
                    markerList.length = topList.length;
                    infoList.length = topList.length;
                }
                    
                else
                    for (let i = markerList.length; i < topList.length; i++)
                    {
                        setTimeout(function() {
                            markerList.push(new google.maps.Marker({
                                position: {lat: Number(topList[i].latitude), lng: Number(topList[i].longtitude)}, 
                                map: map, 
                                icon:"images/rain_marker.png",
                                animation: google.maps.Animation.DROP
                            }));
                            infoList.push(new google.maps.InfoWindow({
                                content: `<div>`+`<a class="info-window" href="#/location/${topList[i].key}"/>${topList[i].name}</a>`+`</div>`
                            }))
                            markerList[i].addListener('click', function() {
                                infoList[i].open(map, markerList[i]);
                              });
                          }, i * 300);
                          
                    }
                        
            }
            else if (inputNearby.value == "")
            {
                clearLists();
            }
            else
            {
                alert("Input should be a positive number!");
                inputNearby.value = "";
            }
        })
        function clearLists() {
            for (let i = 0; i < markerList.length; i++)
                {    
                    markerList[i].setMap(null);
                    markerList[i] = null;
                    infoList[i] = null;
                }
                markerList.length = 0;
                infoList.length = 0;
        }
    }
};

export default MapSearch;
    