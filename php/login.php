<?php
/*
    Dieses Script dient zum Login und Registrieren auf der Seite index.html. Um zu unterscheiden welche Aktion
    gemacht werden muss, wird bei den drei Formularen ein hidden input mitgegeben "mode". mit diesem
    wird entschieden, welche Funktion aufgerufen werden soll.
*/

// daten aus POST beziehen
$mode = $_POST['mode']; // das ist das hidden input Field zum unterscheiden zwischen login/register

if(strcmp($mode, "login") == 0){
    login();
}

if(strcmp($mode, "logout") == 0){
    logout();
}

if(strcmp($mode, "register") == 0){
    register();
}


/*-----------HIER SIND DIE FUNKTIONS-DEFINITIONEN-------------*/

function login(){
    // daten aus POST lesen
    $username = $_POST["username"];
    $password = $_POST['password'];

    // prüfen ob alle Felder mitgegeben wurden und nicht leer sind
    if(isset($username) && !empty($username) &&
       isset($password) && !empty($password)){
        // verbindung zur Datenbank herstellen
        $conn= mysqli_connect("localhost", "root", "", "pet_organizer");
        if(!$conn) { echo"<p>Verbindung zur Datenbank fehlgeschlagen!</p>"; return; }

        // vorbereiten, binden und ausführen des Statements
        $stmt = mysqli_prepare($conn, "select username, password, userId from users where username = ? limit 1;");
        mysqli_stmt_bind_param($stmt,'s', $username);
        mysqli_stmt_execute($stmt);

        // das Resultat abholen
        $res = mysqli_stmt_get_result($stmt);

        // prüfen ob überhaupt ein record gefunden wurde für den angefragten user und hash vergleich
        if($res){
            $row = mysqli_fetch_assoc($res);
            // das eingegebene Password wird verglichen
            if(isset($row) && password_verify($password, $row['password'])){
                session_start(); // Session wird erstellt für 2h
                $_SESSION['expire'] = time() + 3600 * 2;
                $_SESSION['userId'] = $row['userId'];
                setcookie('user', $row['username'], time() + 3600 * 2, '/');
                setcookie('login', 'true', time() + 3600 * 2, '/');
                echo "<p>Login erfolgreich</p>";
            }else{
                echo "<p>Login fehlgeschlagen</p>";
            }
        }else{
            echo "<p>Login fehlgeschlagen</p>";
        }

        // schliessen der Verbindung zur Datenbank
        mysqli_close($conn);
        return;
    }
    echo "<p>Login fehlgeschlagen</p>";
}

function logout(){
    session_start(); // Session wiederaufnehmen
    $_SESSION = []; // Leeren der Sessionvariablen
    // Cookies in die Vergangenheit setzen so werden sie gelöscht
    setcookie(session_name(), null, -1);
    setcookie('user', null, -1, '/');
    setcookie('login', null, -1, '/');
    session_destroy(); // Session wird entfernt
}

function register(){
    // daten aus POST beziehen
    $username = $_POST["username"];
    $password = $_POST['password'];
    $email = $_POST['email'];
    $tel = $_POST['tel'];

    // prüfen ob alle Felder mitgegeben wurden und auch nicht leer sind
    if(isset($username) && !empty($username) &&
       isset($password) && !empty($password) &&
       isset($email) && !empty($email) &&
       isset($tel) && !empty($tel)){
        // das eintreffende password mit dem default HASH Algorithmus verrechnet
        $hash=password_hash($password,PASSWORD_DEFAULT);

        // verbindung zur Datenbank herstellen
        $conn= mysqli_connect("localhost", "root", "", "pet_organizer");
        if(!$conn) { echo"<p>Verbindung zur Datenbank fehlgeschlagen!</p>"; return; }

        // vorbereiten, binden und ausführen des Statements
        $stmt = mysqli_prepare($conn, "select password from users where username = ? limit 1;");
        mysqli_stmt_bind_param($stmt,'s', $username);
        mysqli_stmt_execute($stmt);

        // das Resultat abholen
        $res = mysqli_stmt_get_result($stmt);
        $user = mysqli_fetch_assoc($res);

        // wenn ein resultat gefunden wurde, ist der username bereits vergeben
        if($user){
            echo "<p>Username bereits vergeben</p>";
        }else{
            // vorbereiten, binden und ausführen des Statements
            $stmt = mysqli_prepare($conn, "insert into users(username, email, password, tel) values (?, ?, ?, ?);");
            mysqli_stmt_bind_param($stmt,'ssss', $username, $email, $hash, $tel);
            mysqli_stmt_execute($stmt);

            // nach erfolgreichem einfügen des Recors erstellen wir die Session
            session_start(); // Session wird erstellt 2h
            $_SESSION['expire'] = time() + 3600 * 2;
            setcookie('user', $username, time() + 3600 * 2, '/');
            echo "<p>success</p>";
        }

        // schliessen der Verbindung zur Datenbank
        mysqli_close($conn);
        return;
    }
    echo "<p>Registrierung fehlgeschlagen</p>";
}
