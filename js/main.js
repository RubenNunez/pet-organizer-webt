/*
    In dieser Javascript Datei werden diverse Punkte der Applikation behandelt. Die Sichtbarkeit der Sektionen
    wir im Zusammenhang mit dem Login verwaltet. Hierzu werden einige Async Calls benötigt um im Hintergrund die Login
    Operationen durchführen zu können. Die Pet "CRUD" Operationen werden auch hier verwaltet.
    Das Zeichnen des Canvas wird ebenfalls hier durchgeführt.

    - "Anforderungen" Scrollen zur Sektion über die Nav JS Teil
*/

// script am schluss des HTMLS intigrieren :)
(function(){
    console.log("Document Ready!")

    // Scroll Anforderung umsetzten
    document.getElementById("to-home")
        .addEventListener('click', e => scroll_to(e, "top-pos"))

    document.getElementById("to-info")
        .addEventListener('click', e => scroll_to(e, "information_section"))

    document.getElementById("to-canvas")
        .addEventListener('click', e => scroll_to(e, "canvas_section"))

    document.getElementById("to-feedback")
        .addEventListener('click', e => scroll_to(e, "feedback_section"))

    // hier werden die Formulare geholt, diese werden per ajax bzw. mit fetch gehandhabt
    let login_form = document.getElementById("login-form");
    let logout_form = document.getElementById("logout-form");
    let register_form = document.getElementById("register-form");

    let create_pet_form = document.getElementById("create-pet-form");
    let update_pet_form = document.getElementById("update-pet-form");

    // hier wird der default event 'submit' sozusagen überschrieben
    // an dieser stelle möchte ich nicht das standart verhalten des POST Request,
    // sondern es soll async ausgeführt werden. Das Resultat modifiziert
    // direkt den DOM (ich möchte keinen Reload)
    login_form.addEventListener('submit', e => async_post_handling(e, update_page));
    logout_form.addEventListener('submit', e => async_post_handling(e, update_page));
    register_form.addEventListener('submit', e => async_post_handling(e, update_page));

    create_pet_form.addEventListener('submit', e => async_post_handling(e, update_page));
    update_pet_form.addEventListener('submit', e => async_post_handling(e, update_page));

    // zustand der Seite aktuallisieren
    update_page();

})();

// Scroll-To Funktion implementieren
function scroll_to(_, section){
    window.scroll({
        behavior: 'smooth',
        left: 0,
        top: document.querySelector(`#${section}`).offsetTop
    });
}



// mit dieser Methode wird der Zustand der Seite aktualisiert
// wenn Requests gemacht wurden welche den State verändern
function update_page(){
    // hier werden die Sektionen geholt (je nach loginstate sichtbar bzw unsichtbar)
    let pets_section = document.getElementById("pets_section");
    let login_section = document.getElementById("login_section");

    // überprüfen ob login cookie gesetzt wurde, wenn so muss die login sektion nicht
    // gezeigt werden
    if(get_cookie('login') == 'true'){
        login_section.hidden = true;
        pets_section.hidden = false;
    }else{
        login_section.hidden = false;
        pets_section.hidden = true;
    }

    // globale variable mit dem array zu den Tieren
    window.local_pets = [];

    // pets abholen
    if(get_cookie('login') == 'true'){ read_pets(); }

    // modal schliessen
    document.getElementById('create-pet').style.display='none';

}

// Methode um den async post call an die php scripts zu senden
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
function get_cookie(cookie) {
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
function toggle_menu(){
    let top_nav = document.getElementsByClassName("top-nav")[0];
    top_nav.classList.toggle("responsive");
}

// auslesen der Pets für einen eingeloggten user (über Session gelöst)
function read_pets(){
    // formular erstellen
    let formData = new FormData();
    formData.append('crud','read');

    // pets_container abholen
    let pets_flexbox_container = document.getElementsByClassName("pets-flexbox-container")[0];

    // asynchrones laden der Pets und schreiben ins DOM
    fetch("/php/pets.php", {
        method: "post",
        body: formData
    }).then(result => result.json())
        .then(json => {
            // bereinigen der einträge im DOM
            let child = pets_flexbox_container.firstElementChild;
            while(child){
                if(child.classList.contains('pet-add')){
                    break;
                } // die Kachel zum adden da lassen
                pets_flexbox_container.removeChild(child);
                child = pets_flexbox_container.firstElementChild;
            }

            // erstellen der Einträge
            for (let i = 0; i < json.length; i++) {
                let pet = json[i];

                // pet in das lokale array speichern, wenn nicht schon vorhanden
                let index = window.local_pets.findIndex(x => x.id === pet.id);
                if(index === -1){
                    window.local_pets.push(pet);
                }

                pets_flexbox_container.insertAdjacentHTML('afterbegin',
                    `<div class="pet-box" 
                               id="${pet.id}"
                               onclick="open_pet_update_modal(this.id)">
                                    <p>${pet.petname}</p>
                                    <p>${pet.birthday}</p>
                                    <p>${pet.chipId}</p>
                                    <p>${pet.petnote}</p>
                          </div>`);
            }
        });
}

// öffnet ein pet modal und adaptiert gleich den Inhalt des Formulars
function open_pet_update_modal(id){
    document.getElementById('update-pet').style.display='block';
    let form = document.getElementById('update-pet-form');

    let index = window.local_pets.findIndex(x => x.id == id);
    let pet = window.local_pets[index];

    // bereinigen der form inputs
    let child = form.firstElementChild;
    while(child){
        form.removeChild(child);
        child = form.firstElementChild;
    }

    // neues Form erstellen
    form.insertAdjacentHTML('afterbegin',
        `<p><strong>Update ${pet.petname}</strong></p>
        <br>
        <label class="w3-text">Petname</label>
        <input name="petname" class="w3-input w3-border" type="text" value="${pet.petname}">
        <br>
        <label class="w3-text">Geburtstag</label>
        <input name="birthday" class="w3-input w3-border" type="date" value="${pet.birthday}">
        <br>
        <label class="w3-text">ChipId</label>
        <input name="chipId" class="w3-input w3-border" type="number" value="${pet.chipId}">
        <br>
        <label class="w3-text">Petnote</label>
        <input name="petnote" class="w3-input w3-border" type="text" value="${pet.petnote}">
        <br>
        <input name="crud" type="hidden" value="update">
        <input name="petId" type="hidden" value="${pet.id}">
        <button type="submit" class="w3-btn w3-blue w3-block">Update</button>`);
}
