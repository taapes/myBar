<?php

$con = mysqli_connect("localhost", "root", "root", "myBar");

if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
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
    $response["message"] = "Bar Not Found!";
    $response["name"] = $result;

    $stmt = $con->prepare("INSERT INTO Bars (json, barName) VALUES (?, ?)");
    if (!($stmt = $con->prepare("INSERT INTO Bars (json, barName) VALUES (?, ?)"))) {
        $response["message"] = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
    }
    if (!$stmt->bind_param("ss", $request, $name)) {
        $response["message"] = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
    }
    if (!$stmt->execute()) {
        $response["message"] = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
    }
    $stmt->close();
    $response = json_encode($response);
    echo $response;
} else {
    $response["success"] = 1;
    $response["message"] = "Bar Found and Updated!";
    $response["name"] = $result;
    if (!($stmt = $con->prepare("UPDATE Bars SET json =? WHERE barName = ?"))) {
        $response["message"] = "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
    }
    if (!$stmt->bind_param("ss", $request, $name)) {
        $response["message"] = "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
    }
    if (!$stmt->execute()) {
        $response["message"] = "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
    }
    $stmt->close();
    $response = json_encode($response);
    echo $response;
}
mysqli_close($con);
?>