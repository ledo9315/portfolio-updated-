<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Formulardaten auslesen
    $vorname = htmlspecialchars(trim($_POST['first-name']));
    $nachname = htmlspecialchars(trim($_POST['last-name']));
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $nachricht = htmlspecialchars(trim($_POST['message']));

    // E-Mail-Adresse des Empfängers
    $empfaenger = "leonid_domagalsky@outlook.de";
    
    // Betreff der E-Mail
    $betreff = "Neue Nachricht von: $vorname $nachname";

    // Inhalt der E-Mail
    $nachricht_mail = "Du hast eine neue Nachricht über das Kontaktformular erhalten.\n\n";
    $nachricht_mail .= "Vorname: $vorname\n";
    $nachricht_mail .= "Nachname: $nachname\n";
    $nachricht_mail .= "E-Mail: $email\n\n";
    $nachricht_mail .= "Nachricht:\n$nachricht\n";

    // E-Mail-Header
    $header = "From: $email\r\n";
    $header .= "Reply-To: $email\r\n";
    $header .= "X-Mailer: PHP/" . phpversion();

    // E-Mail senden
    if (mail($empfaenger, $betreff, $nachricht_mail, $header)) {
        // Erfolgreiche Nachricht
        echo "Danke, deine Nachricht wurde gesendet!";
    } else {
        // Fehler beim Senden
        echo "Fehler: Deine Nachricht konnte nicht gesendet werden.";
    }
}
?>
