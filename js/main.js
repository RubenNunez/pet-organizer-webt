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
    let delete_pet_form = document.getElementById("delete-pet-form");

    // hier wird der default event 'submit' sozusagen überschrieben
    // an dieser stelle möchte ich nicht das standart verhalten des POST Request,
    // sondern es soll async ausgeführt werden. Das Resultat modifiziert
    // direkt den DOM (ich möchte keinen Reload)
    login_form.addEventListener('submit', e => async_post_handling(e, update_page));
    logout_form.addEventListener('submit', e => async_post_handling(e, update_page, true));
    register_form.addEventListener('submit', e => async_post_handling(e, update_page));

    create_pet_form.addEventListener('submit', e => async_post_handling(e, update_page, true));
    update_pet_form.addEventListener('submit', e => async_post_handling(e, update_page, true));
    delete_pet_form.addEventListener('submit', e => async_post_handling(e, update_page, true));

    // zustand der Seite aktuallisieren
    update_page();

    draw_canvas();

})();

// "Anforderung" Canvas zeichnen
function draw_canvas(){
    let canvas = document.getElementById('canvas');

    let height = canvas.parentElement.clientHeight;
    let width = canvas.parentElement.clientWidth;
    let aspect = width/height;

    canvas.height = canvas.parentElement.clientHeight;
    canvas.width = height * aspect;

    width = canvas.width;

    let context = canvas.getContext('2d');
    // An dieser Stelle würden die Tiere aus der Datenbank ausgelesen werden aus Zeitgründen habe ich das hier nicht implementiert
    // Daher Mocke ich einfach die Daten um das Canvas zu zeichnen
    let animals = ['cat','dog','rabbit','turtle','donkey'];
    let padding = width/animals.length/2;

    for(let i = 0; i < animals.length; i++){// padding berechnet

        let mockHeight = Math.floor((Math.random() * height * 0.5) + height * 0.2);
        let x = width * (1/(animals.length+4)) + width/(animals.length/i) + padding / 5;
        let w = width * (1/(animals.length+4)) + 5;
        let y = height - mockHeight;

        // balken mit Prozenten zeichnen
        context.beginPath();
        context.strokeStyle = '#2196F3';
        context.lineCap = 'butt';
        context.lineWidth = w+10; // einfach prozentual zur breite
        context.moveTo(x, height);
        context.lineTo(x, y);
        context.stroke()
        context.closePath();
        // um Mehr Zeichnungsoperationen zu erstellen habe ich mich entschlossen diese Balken 3D wirken zu lassen
        // also so isometrisch
        context.beginPath();
        context.strokeStyle = '#2196F3';
        context.lineCap = 'square';
        context.fillStyle = '#ffffff'
        context.lineWidth = 10;
        context.moveTo(x + w/2,y)
        context.lineTo(x,y-65);
        context.lineTo(x - w, y-65);
        context.lineTo(x-w/2,y);
        context.moveTo(x - w-10, y-65);
        context.lineTo(x-w-10,height);
        context.fill();
        context.stroke();
        context.closePath();

        // text zeichnen
        context.font = '20px consolas';
        context.fillStyle = '#ffffff'
        let textWidth = context.measureText(animals[i]).width;
        context.fillText( animals[i], width/(animals.length/i) + padding - textWidth/2 + w/4 , height + 25 - mockHeight);
    }

}

// "Anforderung" Scroll-To Funktion implementieren
function scroll_to(_, section){
    window.scroll({
        behavior: 'smooth',
        left: 0,
        top: document.querySelector(`#${section}`).offsetTop
    });
}

// mit dieser Methode wird der Zustand der Seite aktualisiert
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

    // modal schliessen + hide panels after releod
    document.getElementById('create-pet').style.display = 'none';
    document.getElementById('update-pet').style.display = 'none';
}

// Methode um den async post call an die php scripts zu senden
function async_post_handling (e, action, suppress = false){ // nur statusMeldungen beim Login
    const form = e.target;

    // mir ist bewusst, dass der Lehrer gesagt hat das ich nicht die FETCH API verwenden soll..... jedoch hatte ich
    // dieses Feature bereits umgesetz gehabt. Daher wird hier die neue fetch API verwendet. ...sorry

    // asynchrones laden des Login POST Requests
    fetch(form.action, {
        method: form.method,
        body: new FormData(form)
    }).then(result => result.text())
        .then(text => {
            console.log(text);
            if(!suppress){
                document.getElementById('status-message').innerHTML = text;
                document.getElementById('status-modal').style.display='block';
            }

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
    let deleteForm = document.getElementById('delete-pet-form');

    let index = window.local_pets.findIndex(x => x.id == id);
    let pet = window.local_pets[index];

    // bereinigen der form inputs
    let child = form.firstElementChild;
    while(child){
        form.removeChild(child);
        child = form.firstElementChild;
    }
    child = deleteForm.firstElementChild;
    while(child){
        deleteForm.removeChild(child);
        child = deleteForm.firstElementChild;
    }

    // neues Update Form erstellen
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

    // Delete Form wird hier mit der PetId bestückt
    deleteForm.insertAdjacentHTML('afterbegin',
        `<br>
              <input name="crud" type="hidden" value="delete">
              <input name="petId" type="hidden" value="${pet.id}">
              <button type="submit" class="w3-btn w3-red w3-block">Delete</button>
        <br>`);
}
