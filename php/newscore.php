<?php
	$entryUsername = $_POST['username'];
	$entryScore = $_POST['score'];
	
	$servername = "localhost";
	$username = "aldizonc_lorenz";
	$password = "lorenzdiz1";
	$dbname = "aldizonc_games";

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	} 

	$sql = "INSERT INTO snake_scores (username, score, timestamp)
	VALUES ('".  $entryUsername . "'," . $entryScore . ", NOW())";

	if ($conn->query($sql) === TRUE) {
		echo "success";
	} else {
		echo "Error: " . $sql . "<br>" . $conn->error;
	}

	$conn->close();
?>