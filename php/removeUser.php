<?php
$response["success"] = 0;
$response["message"] = "Unknown Error!";
$con = mysqli_connect("localhost","root","root","myBar");

if (mysqli_connect_errno()) {
	$response["success"] = 0;
    $response["message"] = "Failed to connect to MySQL: " . mysqli_connect_error();
}

$id = file_get_contents("php://input");
$id = json_decode($id);
$username = $id->username;
$response["username"] = $username;


//******* TODO: NEED ERROR CHECK******
$response["success"] = 1;
$response["message"] = "Bar removed successfully";
if (!($stmt = $con->prepare("DELETE FROM users_auth WHERE username = ?"))){
	$response["message"] = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
    $response["success"] = 0;
}
if(!$stmt->bind_param("s", $username)){
	$response["message"] = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
    $response["success"] = 0;
}
if(!$stmt->execute()){
    $response["message"] = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
    $response["success"] = 0;
}

$stmt->close();


$response = json_encode($response);
echo $response;

mysqli_close($con);


?>