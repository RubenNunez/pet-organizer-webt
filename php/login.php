/*
    Dieses Script dient zum Login auf der Seite, mittels Session-Cookie wird der
*/

<?php


// connect to database
$conn= mysqli_connect("localhost", "root", "", "pet_organizer");
if(!$conn) { echo"<p>Database connection failed</p>"; return; }

// get credentials from post request
$username = $_POST["username"];
$password = $_POST['password'];

// das eintreffende password mit dem default HASH hashen
$hash=password_hash($password,PASSWORD_DEFAULT);

// vorbereitenm binden und ausführen des Statements
$stmt = mysqli_prepare($conn, "select password from users where username = ? and password = ?;");
mysqli_stmt_bind_param($stmt,'ss', $username, $hash);
mysqli_stmt_execute($stmt);

// das Resultat abholen
$res = mysqli_stmt_get_result($stmt);


if(!password_verify($password,$hash)){
    echo "SUCCESS";
}else{
    echo "FAILURE";
}


$result = mysqli_stmt_get_result($stmt);

mysqli_close($conn);