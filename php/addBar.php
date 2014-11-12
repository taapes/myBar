<?php
$response["success"] = 0;
$response["message"] = "Unknown Error!";
$con = mysqli_connect("localhost", "root", "root", "myBar");

if (mysqli_connect_errno()) {
    $response["success"] = 0;
    $response["message"] = "Failed to connect to MySQL: " . mysqli_connect_error();
}

$request = file_get_contents("php://input");
$request2 = json_decode($request);


$name = mysql_real_escape_string($request2->name);
$result;

$stmt = $con->prepare("SELECT count(*) from Bars WHERE barName=?");
$stmt->bind_param("s", $name);
$stmt->execute();
$stmt->bind_result($result);
$stmt->fetch();
$stmt->close();

$response = array();

if ($result == 0) {
    $response["success"] = 1;
    $response["message"] = "Bar Added Successfully";

    if (!($stmt = $con->prepare("INSERT INTO Bars (json, barName) VALUES (?, ?)"))) {
        $response["message"] = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        $response["success"] = 0;
    }
    if (!$stmt->bind_param("ss", $request, $name)) {
        $response["message"] = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
        $response["success"] = 0;
    }
    if (!$stmt->execute()) {
        $response["message"] = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        $response["success"] = 0;
    }
    $id = mysqli_insert_id($con);
    $response["id"] = $id;
    $path = dirname( __DIR__ ) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;
    mkdir($path.(string)$response["id"], 0777, true);
    $stmt->close();
    
    $request2 = json_decode($request, true);
    $request2["id"] = $response["id"];
    $request2 = json_encode($request2);
    
    if (!($stmt = $con->prepare("UPDATE Bars SET json =? WHERE id = ?"))) {
        $response["message"] = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
        $response["success"] = 0;
    }
    if (!$stmt->bind_param("sd", $request2, $response["id"])) {
        $response["message"] = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
        $response["success"] = 0;
    }
    if (!$stmt->execute()) {
        $response["message"] = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        $response["success"] = 0;
    }
    $stmt->close();
    
} else if($result > 0){
    $response["success"] = 0;
    $response["message"] = "A bar with this name already exists";
    
    
}

$response = json_encode($response);
echo $response;

mysqli_close($con);
?>