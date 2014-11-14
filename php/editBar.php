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


$id = $request2->id;
$result;

$stmt = $con->prepare("SELECT count(*) from Bars WHERE id=?");
$stmt->bind_param("d", $id);
$stmt->execute();
$stmt->bind_result($result);
$stmt->fetch();
$stmt->close();

$response = array();

   
if ($result == 1){
    $response["success"] = 1;
    $response["message"] = "Bar Updated Successfully!";
    if (!($stmt = $con->prepare("UPDATE Bars SET json =? WHERE id = ?"))) {
        $response["message"] = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        $response["success"] = 0;
    }
    if (!$stmt->bind_param("sd", $request, $id)) {
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