<?php

$con = mysqli_connect("localhost","root","root","myBar");

if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$sql = "SELECT type FROM Type";

$result = mysqli_query($con,$sql);

$response = array();

if ($result) 
{
	$response["success"] = 1;
	$response["message"] = "type Found!";
        $response["num"] = 0;
	$response["type"]   = array();

	
	foreach ($result as $row) {
		array_push($response["type"], $row["type"]);
                $response["num"] = $response["num"] +1;
	}
	
	echo json_encode($response);
} 
else 
{
	$response["success"] = 0;
	$response["message"] = "No Bars Found!";
	echo json_encode($response);
}

$response["message"] = "ERROR Undefined finding Type";

?>