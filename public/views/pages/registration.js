let Registration = {
    render: async () => {
        return /*html*/`
        <main class="form">
            <div class="registration">
                <h2>We are glad you decided to join us</h2>
                <form id="registration-form">
                    <div class="registration-form">
                        <input required type="text" id="login" placeholder="Username">
                        <input required type="password" id="password" placeholder="Password">
                        <input required type="password" id="confirm-password" placeholder="Confirm password">
                        <button class="register" id="register">Sign up</button>
                    </div>
                </form>
            </div>
        </main>
        `;
    },
    
    afterRender: async () => {
        
        const regForm = document.getElementById("registration-form");
        // const regBtn = document.getElementById("register");
        let isSucs = true;

        regForm.addEventListener("submit", async e => {
            e.preventDefault();
            const email = regForm["login"].value;
            const password = regForm["password"].value;
            const confPassword = regForm["confirm-password"].value;
            if (password != confPassword) {
                alert('Passwords do not match!');
                isSucs = false;
            } else {
                await auth.createUserWithEmailAndPassword(email, password).catch(e => {
                    alert(e.message);
                    isSucs = false;
                });
            }
            if (isSucs) {
                auth.onAuthStateChanged(firebaseUser => {
                    if(firebaseUser){
                      window.location.hash = '/';
                    }
                });
            }
            else
            {
                window.location.hash = '/registration';
            }
        })
    }
};

export default Registration;