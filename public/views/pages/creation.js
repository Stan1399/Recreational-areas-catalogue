import dbHelper from '../../services/db.js';

let Creation = {
    render: async () => {
        if (window.matchMedia("(min-width: 1000px)").matches)
                return /*html*/`
                <main class="form">
                    <div class="creation">
                        <h2>We are sure your location will be one of the greatest!</h2>
                        <form id="creation-form">
                            <div class="flex-container">
                                <div class="desktop-inputs">
                                    <label> Location's name<input class="creation" type="input" required id="name" placeholder="Type here your data!"></label>
                                    <label for="country">Country<input class="creation" type="input" id="country" placeholder="Type here your data!"></label>
                                    <label for="region">Region<input class="creation" type="input" id="region" placeholder="Type here your data!"></label>
                                    <label for="settlement">Settlement<input class="creation" type="input" id="settlement" placeholder="Type here your data!"></label>
                                    <label for="street">Street<input class="creation" type="input" id="street" placeholder="Type here your data!"></label>
                                    <label for="house">House<input class="creation" type="input" id="house" placeholder="Type here your data!"></label>
                                    <label for="image" class="images-label">Picture source<input type="file" id="image" accept=".png, .jpg, .jpeg, .svg, .webp" multiple><p id="area">Add files</p></label>
                                    <div class="preview">
                                        <p>No files currently selected for upload</p>
                                    </div>
                                    <label>
                                        Coordinates in decimal degrees
                                        <hr />
                                        <div class="coord">
                                            <label for="latitude">Latitude coordinate</label>
                                            <label for="longitude">Longitude coordinate</label>
                                            <input class="creation" type="input" id="latitude" placeholder="Type here your data!">
                                            <input class="creation" type="input" id="longtitude" placeholder="Type here your data!">
                                        </div>
                                    </label>
                                    <label for="site">Location's site<input class="creation" type="input" id="site" placeholder="Type here your data!"></label>
                                </div>
                            </div>
                            <textarea type="input" id="description" placeholder="Type a few word about your location here"> </textarea>
                            <button id="add">Add</button>
                        </form>
                    </div>
                </main>
                `;

        else
            
            return /*html*/`
            <main class="form"> 
                <div class="creation" class="form">
                    <h2>We are sure your location will be one of the greatest!</h2>
                    <form id="creation-form">
                        <div class="flex-container">
                            <div class="inputs">
                                <label for="name">Location's name</label>
                                <input type="input" required id="name" placeholder="Type here your data!">
                                <label for="country">Country</label>
                                <input type="input" id="country" placeholder="Type here your data!">
                                <label for="region">Region</label>
                                <input type="input" id="region" placeholder="Type here your data!">
                                <label for="settlement">Settlement</label>
                                <input type="input" id="settlement" placeholder="Type here your data!">
                                <label for="street">Street</label>
                                <input type="input" id="street" placeholder="Type here your data!">
                                <label for="house">House</label>
                                <input type="input" id="house" placeholder="Type here your data!">
                                <label for="image" class="images-label">
                                    Picture source
                                    <input type="file" id="image" accept=".png, .jpg, .jpeg, .svg, .webp" multiple>
                                    <p id="area">Add files</p>
                                </label>
                                    <div class="preview">
                                        <p>No files currently selected for upload</p>
                                    </div>
                                <label>Coordinates in decimal degrees</label>
                                <hr />
                                <div class="coord">
                                    <label for="latitude">Latitude coordinate</label>
                                    <label for="longitude">Longitude coordinate</label>
                                    <input type="input" id="latitude" placeholder="Type here your data!">
                                    <input type="input" id="longtitude" placeholder="Type here your data!">
                                </div>
                                <label for="site">Location's site</label>
                                <input type="input" id="site" placeholder="Type here your data!">
                            </div>
                        </div>
                        <textarea type="input" id="description" placeholder="Type a few word about your location here"></textarea>
                        <button id="add">Add</button>
                    </form>
                </div>
            </main>
            `;
            
    },
    
    afterRender: async (id) => {
        var file_input = document.getElementById('image');
        var preview = document.querySelector('.preview');
        file_input.style.opacity = 0;
        file_input.addEventListener('change', () => {
            while(preview.firstChild) {
              preview.removeChild(preview.firstChild);
            }
          
            var curFiles = file_input.files;
            if(curFiles.length === 0) {
              var para = document.createElement('p');
              para.textContent = 'No files currently selected for upload';
              preview.appendChild(para);
            } else {
                var list = document.createElement('ol');
                preview.appendChild(list);
                for(var i = 0; i < curFiles.length; i++) {
                var listItem = document.createElement('li');
                var para = document.createElement('p');
                if(validFileType(curFiles[i])) {
                    para.textContent = 'File name: ' + curFiles[i].name + '.';
                    var image = document.createElement('img');
                    image.src = window.URL.createObjectURL(curFiles[i]);
                    image.style.maxWidth = "100%";
            
                    listItem.appendChild(image);
                    listItem.appendChild(para);
            
                } else {
                    para.textContent = curFiles[i].name + ': Not a valid file type. Update your selection.';
                    listItem.appendChild(para);
                }
            
                list.appendChild(listItem);
                }
            }
        });
        const creatForm = document.getElementById("creation-form");
        const obj = await dbHelper.getObjectById(id);
        if (id != "null")
        {
            creatForm["name"].value = obj.name || "";
            creatForm["country"].value = obj.country || "";
            creatForm["region"].value = obj.region || "";
            creatForm["settlement"].value = obj.settlement || "";
            creatForm["street"].value = obj.street || "";
            creatForm["house"].value = obj.house || "";
            creatForm["latitude"].value = obj.latitude || "";
            creatForm["longtitude"].value = obj.longtitude || "";
            creatForm["site"].value = obj.site || "";
            creatForm["description"].value = obj.description || "";
        }
        creatForm.addEventListener("submit", e => {
            e.preventDefault();
            const name = creatForm["name"].value;
            const country = creatForm["country"].value;
            const region = creatForm["region"].value;
            const settlement = creatForm["settlement"].value;
            const street = creatForm["street"].value;
            const house = creatForm["house"].value;
            const latitude = creatForm["latitude"].value;
            const longtitude = creatForm["longtitude"].value;
            const site = creatForm["site"].value;
            const description = creatForm["description"].value;
            if (id != "null") {
                if (obj.user != firebase.auth().currentUser.uid)
                    alert("You do not have rights to edit this location!");
                else
                {
                    dbHelper.updateLocationData(name, country, region, settlement, street, house, file_input.files, latitude, longtitude, site, description, id);
                    window.location.hash = '/';
                }

            } else {
                var locationKey = dbHelper.writeLocationData(name, country, region, settlement, street, house, file_input.files, latitude, longtitude, site, description).key;
                alert(`Location ${locationKey} was successfully created!`);
                window.location.hash = '/';
            }
        })

        var fileTypes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/svg',
            'image/webp'

        ]
          
        function validFileType(file) {
            for(var i = 0; i < fileTypes.length; i++) {
                if(file.type === fileTypes[i]) {
                    return true;
                }
            }
            return false;
        }
    }
};

export default Creation;