<?php

// connect to database
$conn= mysqli_connect("localhost", "root", "", "pet_organizer");
if(!$conn) { echo"<p>Database connection failed</p>"; return; }

// get credentials from post request
$username = $_POST["username"];
$password = $_POST['password'];

// hash to password
$hash=password_hash($password,PASSWORD_DEFAULT);
echo $hash;

// prepare, bind and execute statement
$stmt = mysqli_prepare($conn, "select * from users where username = ? and password = ?;");
mysqli_stmt_bind_param($stmt,'ss', $username, $hash);
mysqli_stmt_execute($stmt);


if(!password_verify($password,$hash)){

}


$result = mysqli_stmt_get_result($stmt);

mysqli_close($conn);