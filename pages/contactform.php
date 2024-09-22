<?php
if (isset($_POST['submit'])) {
    // Daten bereinigen
    $firstName = htmlspecialchars(trim($_POST['first-name']));
    $lastName = htmlspecialchars(trim($_POST['last-name']));
    $emailFrom = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(trim($_POST['message']));

    // Validierung der E-Mail
    if (!filter_var($emailFrom, FILTER_VALIDATE_EMAIL)) {
        // Falls die E-Mail ungültig ist, leitet es zur Fehlerseite um
        header("Location: index.html?error=invalidemail");
        exit();
    }

    // Ziel-E-Mail und Betreff
    $mailTo = "leonid_domagalsky@outlook.de";
    $subject = "Neue Nachricht von " . $firstName . " " . $lastName;

    // E-Mail-Inhalt
    $txt = "Eine E-Mail von: " . $firstName . " " . $lastName . ".\n\n" . $message;

    // Header mit der Absenderadresse
    $headers = "From: " . $emailFrom;

    // Mail senden
    if (mail($mailTo, $subject, $txt, $headers)) {
        // Weiterleitung nach erfolgreichem Versand
        header("Location: index.html?mailsend=success");
    } else {
        // Fehlermeldung bei Problemen mit dem Versand
        header("Location: index.html?mailsend=error");
    }
    exit();
}
?>
