<?php
    if (isset($_POST['submit'])) {
        $firstName = $_POST['first-name'];
        $lastName = $_POST['last-name'];
        $emailFrom = $_POST['email'];
        $message = $_POST['message'];

        $mailTo = "leonid_domagalsky@outlook.de";
        $subject = "Neue Nachricht von " . $firstName . " " . $lastName;
        $headers = "From: " . $emailFrom;
        $txt = "Eine Email von: " . $firstName . " " . $lastName . ".\n\n" . $message;

        mail($mailTo, $subject, $txt, $headers);
        header("Location: index.html?mailsend");
    }
?>  