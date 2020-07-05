import dbHelper from '../../services/db.js';

let Location = {
    render: async (id) => {
        var locationObj = null;
        var locationRef = firebase.database().ref('locations/' + id);
        await locationRef.once('value', function(snapshot) {
            locationObj = snapshot.val();
          });
        if (window.matchMedia("(min-width: 1000px)").matches)
            return /*html*/`
            <main>
                <div class="object-page-content">
                    <h2>${locationObj.name}</h2>
                    <div class="flex-row">
                        <div class="object-page-info">
                            <p class="info-item"><label>Country: </label>${locationObj.country}</p>
                            <p class="info-item"><label>Region: </label>${locationObj.region}</p>
                            <p class="info-item"><label>Settlement: <label>${locationObj.settlement}</p>
                            <p class="info-item"><label>Street: </label>${locationObj.street}</p>
                            <p class="info-item"><label>House: <label>${locationObj.house}</p>
                            <p class="info-item"><label class="innerSite">Site: <a class="innerSite" href="${locationObj.site}">${locationObj.site}</a></label></p>
                            <p class="paragraph">${locationObj.description}</p>
                            <div class="flex-row-for-user">
                                <a class="details-button styled" hidden id="update" href="#/creation/${id}">Update</a>
                                <a class="details-button styled" hidden id="remove" href="#/">Remove</a>
                            </div>
                            <div id="map" class="map-object"></div>
                        </div>
                        <div class="object-page-images">
                            <div class="preview"></div>
                        </div>
                    </div>
                        
                    <div class="flex">
                        <p id="rating">Rating: </p>
                        <div class="rate">
                            <button class="star" id="star1">Rate</button>
                            <button class="star" id="star2">Rate</button>
                            <button class="star" id="star3">Rate</button>
                            <button class="star" id="star4">Rate</button>
                            <button class="star" id="star5">Rate</button>
                        </div>
                        <p id="votes">Votes</p>
                    </div>
                    
                </div>
            </main>
            `;
        else
            return /*html*/`
                <main>
                    <div class="object-page-content">
                        <h2>${locationObj.name}</h2>
                        <img class="object-page-image-mobile" id="image" src="${locationObj.picture}" alt="Sorry. The picture was not found:(" >
                        <div class="info-line">
                            <p><label>Country: </label>${locationObj.country}</p>
                            <p><label>Region: </label>${locationObj.region}</p>
                        </div>
                        <div class="info-line">
                            <p class="p-item"><label>Settlement: </label>${locationObj.settlement}</p>
                            <p><label>Street: </label>${locationObj.street}</p>
                            <p><label>House: </label>${locationObj.house}</p>
                        </div>
                        <div class="info-item-a"><label class="innerSite">Site: <a class="innerSite" href="${locationObj.site}">${locationObj.site}</a></label></div>
                        <div>
                            <p class="paragraph">${locationObj.description}</p>
                        </div>
                        
                        <div class="flex">
                            <p id="rating">Rating</p>
                            <div class="rate">
                                <button class="star" id="star1">Rate</button>
                                <button class="star" id="star2">Rate</button>
                                <button class="star" id="star3">Rate</button>
                                <button class="star" id="star4">Rate</button>
                                <button class="star" id="star5">Rate</button>
                            </div>
                            <p id="votes">Votes</p>
                        </div>
                        <div class="flex-row-for-user">
                            <a class="details-button styled" hidden id="update" href="#/creation/${id}">Update</a>
                            <a class="details-button styled" hidden id="remove" href="#/">Remove</a>
                        </div>  
                        <div id="map" class="map-object-mobile"></div>
                    </div>
                </main>
                `; 
    },
    
    afterRender: async (id) => {
        const locationObj = await dbHelper.getObjectById(id);
        const updateBtn = document.getElementById("update");
        const removeBtn = document.getElementById("remove");
        if (firebase.auth().currentUser && locationObj.user == firebase.auth().currentUser.uid)
        {
            updateBtn.hidden = false;
            removeBtn.hidden = false;
        }
        const map  = new google.maps.Map(document.getElementById('map'), {
            
            center: {lat: Number(locationObj.latitude), lng: Number(locationObj.longtitude)},
            zoom: 10,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                mapTypeIds: ['roadmap', 'terrain']
            }
        });
        const marker = new google.maps.Marker({
            position: {lat: Number(locationObj.latitude), lng: Number(locationObj.longtitude)}, 
            map: map, 
            icon: "images/rain_marker.png",
            draggable: true,
            animation: google.maps.Animation.DROP,
        });
        marker.addListener('click', toggleBounce);
        function toggleBounce() {
            if (marker.getAnimation() !== null) {
              marker.setAnimation(null);
            } else {
              marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        }
        const btn1 = document.getElementById("star1");
        const btn2 = document.getElementById("star2");
        const btn3 = document.getElementById("star3");
        const btn4 = document.getElementById("star4");
        const btn5 = document.getElementById("star5");
        btn1.addEventListener('click', () => {
            if (firebase.auth().currentUser)
                rate(5);
            else
                alert("You have to sign in to vote!");
        });
        btn2.addEventListener('click', () => {
            if (firebase.auth().currentUser)
                rate(4);
            else
                alert("You have to sign in to vote!");
        });
        btn3.addEventListener('click', () => {
            if (firebase.auth().currentUser)
                rate(3);
            else
                alert("You have to sign in to vote!");
        });
        btn4.addEventListener('click', () => {
            if (firebase.auth().currentUser)
                rate(2);
            else
                alert("You have to sign in to vote!");
        });
        btn5.addEventListener('click', () => {
            if (firebase.auth().currentUser)
                rate(1);
            else
                alert("You have to sign in to vote!");
        });
        const p = document.getElementById("rating");
        p.textContent = "Rating: " + await dbHelper.getRatingById(id);
        const p_votes = document.getElementById("votes");
        p_votes.textContent = "Votes: " + await dbHelper.getVotesById(id);
        async function rate(rating)
        {
            if(await dbHelper.writeUserRated(id, rating) == undefined)
                alert('You have already rated this location!');
            else
                alert('Thanks for your feedback!');
            p.textContent = "Rating: " + await dbHelper.getRatingById(id);
            p_votes.textContent = "Votes: " + await dbHelper.getVotesById(id);
        }

        const remove = document.getElementById("remove");
        remove.addEventListener('click', () => {
            dbHelper.removeById(id);
        });

        const update = document.getElementById("update");
        update.addEventListener('click', () => {
            // dbHelper.removeById(id);
        });
        // image list
        if (window.matchMedia("(min-width: 1000px)").matches)
        {
            var preview = document.querySelector('.preview');
            var curFiles = await dbHelper.getImageByLocationId(id);
            if(curFiles.length === 0) {
                var para = document.createElement('p');
                para.textContent = 'There is no images for this location.';
                preview.appendChild(para);
            } else {
                var list = document.createElement('ol');
                list.style["list-style-type"] = "none";
                preview.appendChild(list);
                for(var i = 0; i < curFiles.length; i++) {
                    var listItem = document.createElement('li');
                    // var para = document.createElement('p');
                    // para.textContent = 'File name: ' + curFiles[i].name + '.';
                    var image = document.createElement('img');
                    image.src = await dbHelper.getTheDownloadURL(curFiles[i].fullPath);
                    image.style.maxWidth = "100%";
            
                    listItem.appendChild(image);
                    // listItem.appendChild(para);
            
                    list.appendChild(listItem);
                }
            }
        }
        else
        {
            var curFiles = await dbHelper.getImageByLocationId(id);
            if(curFiles.length === 0) {
                ;
            } else {
                var image = document.getElementById('image');
                image.src = await dbHelper.getTheDownloadURL(curFiles[0].fullPath);
                image.style.maxWidth = "100%";
            }
        }
            
    }
};

export default Location;