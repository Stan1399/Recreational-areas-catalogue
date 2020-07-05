let SignedInHeader = {
    render: async () => {
        return /*html*/`
            <div class="header-container">
                <a class="styled text-link" href="#/"><h1>Recreational areas catalogue</h1></a>
                <div>
                    <label id="menu-checkbox">
                        <input type="checkbox" id="show-menu-checkbox"></input>
                        <span class="burger"></span>
                        <div class="menu-list">
                            <menu>
                                <p class="hello"> Hello, ${firebase.auth().currentUser.email}!</p>
                                <a class="styled menuitem" href="#/creation/null">Add a new location</a>
                                <a class="styled menuitem" href="#/map">Map search</a>
                                <button class="styled menuitem" id="sign-out">Sign out</button>
                            </menu> 
                        </div>
                    </label>
                </div>
                
            </div>
        `;
    },
    
    afterRender: async () => {
        const signOutBtn = document.getElementById("sign-out");
        signOutBtn.addEventListener("click", e => {
            e.preventDefault();
            firebase.auth().signOut().then(function() {
                alert("Sign-out successful.");
                window.location.hash = '/main';

            }).catch(function(error) {
                alert("An error happened.");
            });
        });
    }
};

export default SignedInHeader;