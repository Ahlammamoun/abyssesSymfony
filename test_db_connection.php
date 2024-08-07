<?php
$dsn = 'mysql:host=127.0.0.1;dbname=abysses';
$user = 'abysses';
$password = 'abysses';

try {
    $dbh = new PDO($dsn, $user, $password);
    echo 'Connection successful!';
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}
?>
