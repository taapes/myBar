<?php

$con = mysqli_connect("localhost","root","root","myBar");

if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$sql = "SELECT json, id FROM Bars";

$result = mysqli_query($con,$sql);

$response = array();

if ($result) 
{
	$response["success"] = 1;
	$response["message"] = "Bars Found!";
	$response["bars"]   = array();
        $response["id"] = 0;

	
	foreach ($result as $row) {
		array_push($response["bars"], json_decode($row["json"]));
	}

	
	// echoing JSON response
	$response = json_encode($response);
	//$response = stripslashes($response);
	echo $response;
} 
else 
{
	$response["success"] = 0;
	$response["message"] = "No Bars Found!";
	die(json_encode($response));
	}

?>