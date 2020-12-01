/*
    In dieser Javascript Datei werden diverse Punkte der Applikation behandelt. Die Sichtbarkeit der Sektionen
    wir im Zusammenhang mit dem Login verwaltet. Hierzu werden 3 AJAX Calls benötigt um im Hintergrund die Login
    Operationen durchführen zu können.
    Das Zeichnen des Canvas wird ebenfalls hier durchgeführt.
*/

// script am schluss intigrieren
(function(){
    console.log("Document Ready!")

    // zustand der Seite aktuallisieren
    update_page();

    // hier werden die Formulare geholt, diese werden per ajax bzw. mit fetch gehandhabt
    let login_form = document.getElementById("login-form");
    let logout_form = document.getElementById("logout-form");
    let register_form = document.getElementById("register-form");

    // hier wird der default event 'submit' sozusagen überschrieben
    // an dieser stelle möchte ich nicht das standart verhalten des POST Request,
    // sondern es soll async ausgeführt werden. Das Resultat modifiziert
    // direkt den DOM
    login_form.addEventListener('submit', e => async_post_handling(e, update_page));
    logout_form.addEventListener('submit', e => async_post_handling(e, update_page));
    register_form.addEventListener('submit', e => async_post_handling(e, update_page));

})();


// mit dieser Methode wird der Zustand der Seite aktualisiert
// wenn Requests gemacht wurden welche den State verändern
function update_page(){
    // hier werden die Sektionen geholt (je nach loginstate sichtbar bzw unsichtbar)
    let pets_section = document.getElementById("pets_section");
    let login_section = document.getElementById("login_section");

    // überprüfen ob login cookie gesetzt wurde, wenn so muss die login sektion nicht
    // gezeigt werden
    if(getCookie('login') == 'true'){
        login_section.hidden = true;
        pets_section.hidden = false;
    }else{
        login_section.hidden = false;
        pets_section.hidden = true;
    }
}


// Methode um den async post call an das login php script zu senden
function async_post_handling (e, action){
    const form = e.target;

    // asynchrones laden des Login POST Requests
    fetch(form.action, {
        method: form.method,
        body: new FormData(form)
    }).then(result => result.text())
        .then(text => {
            console.log(text);
            action(); // invoke der mitgegebenen action
        });

    // verhindern des standard verhaltens
    e.preventDefault();
}

// Hilfsmethode um ein Cookie zu lesen
function getCookie(cookie) {
    let name = cookie + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Toggle Methode für das Hamburger Menu
function toggleMenu(){
    let top_nav = document.getElementsByClassName("top-nav")[0];
    top_nav.classList.toggle("responsive");
}