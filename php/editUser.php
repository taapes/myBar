<?php
$response["success"] = 0;
$response["message"] = "Unknown Error!";
$con = mysqli_connect("localhost", "root", "root", "myBar");

if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    $response["message"] = "Connection Error";
}

$request = file_get_contents("php://input");
$request2 = json_decode($request);


$username = $request2->username;
$admin = $request2->admin;
$result;

$stmt = $con->prepare("SELECT count(*) from users_auth WHERE username=?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($result);
$stmt->fetch();
$stmt->close();

$response = array();

   
if ($result == 1){
    $response["success"] = 1;
    $response["message"] = "Bar Updated Successfully!";
    if (!($stmt = $con->prepare("UPDATE users_auth SET admin =? WHERE username = ?"))) {
        $response["message"] = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        $response["success"] = 0;
    }
    if (!$stmt->bind_param("ds", $admin, $username)) {
        $response["message"] = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
        $response["success"] = 0;
    }
    if (!$stmt->execute()) {
        $response["message"] = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        $response["success"] = 0;
    }
    $stmt->close();
    
} else {
	$response["success"] = 0;
	$response["message"] = "Bar not found!";
}

$response = json_encode($response);
echo $response;

mysqli_close($con);
?>