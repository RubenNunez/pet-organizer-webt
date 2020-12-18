<?php
/*
    Dieses Script dient nur für das Feedbackformular, wenn im XAMP die "SMTP" und der zugehörige PORT gesetzt wird.
    Kann mir ein Mail gesendet werden. :)

     - "Anforderungen" HTTP Response vom Typ HTML: Das Feedbackformular Liefert ein HTML mit Dankeschön :)
     - "Anforderungen" Cookie setzten mit Info das bereits einmal ein Feedback gegeben wurde
*/

$mail = $_POST['mail'];
$message = $_POST['message'];

if(isset($mail) && !empty($mail) &&
   isset($message) && !empty($message)){

   $to = "ruben.nunez@live.de";
   $headers = "From: $mail \r\n";
   $headers .= "Reply-To: $mail \r\n";
   $subject = "MEP Feedback";

    @mail($to,$subject,$message,$headers); // das @ unterdrückt die warnung bzg. SMTP nicht eingerichtet

    // unterschiedliches Feedback wenn bereits ein cookie gesetzt wurde
   if(isset($_COOKIE['feedback'])){
        echo "<p>Herzlichen Dank für das <strong>erneute</strong> Feedback</p><br><a href='../index.html'>Zurück zur Seite</a>";
   }else{
        echo "<p>Herzlichen Dank für das Feedback & deine Kreditkarte ^^</p><br><a href='../index.html'>Zurück zur Seite</a>";
   }

   setcookie('feedback', "danke");
}



