<?php

$con = mysqli_connect("localhost","root","root","myBar");

if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$sql = "SELECT atmosphere FROM Atmosphere";

$result = mysqli_query($con,$sql);

$response = array();

if ($result) 
{
	$response["success"] = 1;
	$response["message"] = "atmosphere Found!";
        $response["num"] = 0;
	$response["atmosphere"]   = array();

	
	foreach ($result as $row) {
		array_push($response["atmosphere"], $row["atmosphere"]);
                $response["num"] = $response["num"] +1;
	}
	
	echo json_encode($response);
} 
else 
{
	$response["success"] = 0;
	$response["message"] = "No Bars Found!";
	die(json_encode($response));
	}

?>