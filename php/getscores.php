<?php
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

	$sql = "SELECT * FROM snake_scores ORDER BY score DESC";
	$result = $conn->query($sql);
	$rows = array();
	while($row = $result->fetch_assoc()) {
		$rows[] = $row;
    }

	$conn->close();
	echo json_encode($rows);
?>