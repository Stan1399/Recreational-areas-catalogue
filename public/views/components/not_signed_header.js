let NotSignedInHeader = {
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
                            <a class="styled menuitem" href="#/authorization">Sign in</a>
                            <a class="styled menuitem" href="#/registration">Sign up</a>
                            <a class="styled menuitem" href="#/map">Map search</a>
                        </menu> 
                    </div>
                </label>
            </div>
            
        </div>
        `;
    },
    
    afterRender: async () => {
        ;
    }
};

export default NotSignedInHeader;