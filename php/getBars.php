<?php

$response["success"] = 0;
$response["message"] = "Unknown Error!";
$con = mysqli_connect("localhost", "root", "root", "myBar");

if (mysqli_connect_errno()) {
    $response["success"] = 0;
    $response["message"] = "Failed to connect to MySQL: " . mysqli_connect_error();
}

$stmt = $con->prepare("SELECT count(*) from Bars");
$stmt->bind_param("s", $name);
$stmt->execute();
$stmt->bind_result($result);
$stmt->fetch();
$stmt->close();

$rec_count = $result;
$rec_limit = 10;

if( isset($_GET{'page'} ) )
{
   $page = $_GET{'page'}-1;
   $offset = $rec_limit * $page ;
}
else
{
   $page = 0;
   $offset = 0;
}

$sql = "SELECT json, id FROM Bars LIMIT ".$offset.", ".$rec_limit;

$result = mysqli_query($con,$sql);

if ($result) 
{
	$response["success"] = 1;
	$response["message"] = "Bars Found!";
        $response["total"] = $rec_count;
	$response["bars"]   = array();

	
	foreach ($result as $row) {
		$temp = json_decode($row["json"]);
		$temp->id = $row["id"];
		array_push($response["bars"], $temp);
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