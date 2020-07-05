let Autorization = {
    render: async () => {
        return /*html*/`
        <main class="form">
            <div class="authorization">
                <h2>Welcome!<br/>Please, enter your authorization data</h2>
                <form id="authorization-form">
                    <div class="registration-form">
                        <input required type="text" id="login" placeholder="Username">
                        <input required type="password"id="password" placeholder="Password">
                    </div>
                    <div class="authorization-flex">
                        <button id="log-in">Sign in</button>
                        <a class="styled registration" href="#/registration">Sign up</a>
                    </div>
                </form>
            </div>
        </main>
        `;
    },
    
    afterRender: async () => {
        
        const authForm = document.getElementById("authorization-form");
        let isSucs = true;
        authForm.addEventListener("submit", async e => {
            e.preventDefault();
            const email = authForm["login"].value;
            const password = authForm["password"].value;
            await auth.signInWithEmailAndPassword(email, password).catch(e => {
                alert(e.message);
                isSucs = false;
            });
            if (isSucs)
                auth.onAuthStateChanged(firebaseUser => {   
                    if(firebaseUser){
                      alert(`User ${firebaseUser.email } successfully signed in!`);
                      window.location.hash = '/';
                    }
                });
            else
                window.location.hash = '/authorization';
        })

    }
};

export default Autorization;