let Footer = {
    render: async () => {
        return /*html*/`
        <p class="p-footer">Contact us: StanVer,<br>stan.ver.i.esk.slav@gmail.com</p>
        <p class="p-footer">About:<br>developed in 2020</p>
        <img class="footer-image" src="images/logo.png"/>
        `;
    },
    
    afterRender: async () => {
        ;
    }
};

export default Footer;