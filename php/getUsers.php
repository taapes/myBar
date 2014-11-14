<?php

$response["success"] = 0;
$response["message"] = "Unknown Error!";
$con = mysqli_connect("localhost", "root", "root", "myBar");

if (mysqli_connect_errno()) {
    $response["success"] = 0;
    $response["message"] = "Failed to connect to MySQL: " . mysqli_connect_error();
}



$sql = "SELECT * FROM users_auth";

$result = mysqli_query($con,$sql);

if ($result) 
{
	$response["success"] = 1;
	$response["message"] = "Users found!";
	$response["users"]   = array();

	
	foreach ($result as $row) {
                $temp = new stdClass();
		$temp->name = $row["name"];
                $temp->username = $row["username"];
                $temp->admin = $row["admin"];
                $temp->email = $row["email"];
                $temp->created = $row["created"];
		array_push($response["users"], ($temp));
	}

	
	// echoing JSON response
	$response = json_encode($response);
	echo $response;
} 
else 
{
	$response["success"] = 0;
	$response["message"] = "No Bars Found!";
	die(json_encode($response));
	}

?>