<?php
/*
    Dieses Script dient zum Verwalten der Pets durch die Funktionen (C)eate(R)ead(U)pdate(D)elete.
    Um zu unterscheiden welche Aktion gemacht werden muss, wird bei den vier Formularen ein
    hidden input mitgegeben "crud". mit diesem wird entschieden, welche Funktion aufgerufen werden soll.
*/

// daten aus POST beziehen
$crud = $_POST['crud']; // das ist das hidden input Field zum unterscheiden zwischen login/register

if(strcmp($crud, "create") == 0){
    create();
}

if(strcmp($crud, "read") == 0){
    read();
}

if(strcmp($crud, "update") == 0){
    update();
}

if(strcmp($crud, "delete") == 0){
    delete();
}


/*-----------HIER SIND DIE FUNKTIONS-DEFINITIONEN-------------*/

function create(){
    session_start(); // Session wiederaufnehmen

    // daten aus POST lesen
    $name = $_POST["petname"];
    $birthday = $_POST['birthday'];
    $chipId = $_POST['chipId'];

    $userId = $_SESSION['userId'];

    // prüfen ob alle Felder mitgegeben wurden und nicht leer sind
    if(isset($name) && !empty($name) &&
       isset($birthday) && !empty($birthday) &&
       isset($chipId) && !empty($chipId) &&
       isset($userId) && !empty($userId)){
        // verbindung zur Datenbank herstellen
        $conn= mysqli_connect("localhost", "root", "", "pet_organizer");
        if(!$conn) { echo"<p>Verbindung zur Datenbank fehlgeschlagen!</p>"; return; }

        // vorbereiten, binden und ausführen des Statements
        $stmt = mysqli_prepare($conn, "insert into pets(petname, birthday, chipId, userId) values (?, ?, ?, ?);");
        mysqli_stmt_bind_param($stmt,'ssss', $name, $birthday, $chipId, $userId);
        $res = mysqli_stmt_execute($stmt);

        echo $res;
        echo "<p>success</p>";

        // schliessen der Verbindung zur Datenbank
        mysqli_close($conn);
        return;
    }
    echo "<p>Pet create fehlgeschlagen</p>";
}

function read(){
    session_start(); // Session wiederaufnehmen

    $userId = $_SESSION['userId'];

    // prüfen ob alle Felder mitgegeben wurden und nicht leer sind
    if(isset($userId) && !empty($userId)){
        // verbindung zur Datenbank herstellen
        $conn= mysqli_connect("localhost", "root", "", "pet_organizer");
        if(!$conn) { echo"<p>Verbindung zur Datenbank fehlgeschlagen!</p>"; return; }

        // vorbereiten, binden und ausführen des Statements
        $stmt = mysqli_prepare($conn, "select petId, petname, birthday, chipId from pets where userId = ?");
        mysqli_stmt_bind_param($stmt,'i', $userId);
        mysqli_stmt_execute($stmt);

        // das resultat abholen
        $res = mysqli_stmt_get_result($stmt);

        // array für resultate herstellen
        $pets = array();
        while($row = mysqli_fetch_assoc($res)){
            $pet =  new \stdClass();
            $pet->id = $row["petId"];
            $pet->petname = $row["petname"];
            $pet->birthday = $row["birthday"];
            $pet->chipId = $row["chipId"];
            array_push($pets, $pet);
        }

        // retounriere das array als json
        echo json_encode($pets);

        // schliessen der Verbindung zur Datenbank
        mysqli_close($conn);
        return;
    }
    echo "<p>Pet read fehlgeschlagen</p>";
}

