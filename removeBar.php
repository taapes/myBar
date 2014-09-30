<?php

$con = mysqli_connect("localhost","root","root","myBar");

if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$request2 = json_decode(file_get_contents("php://input"));

$name = mysql_real_escape_string($request2->name);

//******* TODO: NEED ERROR CHECK******

$stmt = $con->prepare("DELETE FROM Bars WHERE barName = ?");
$stmt->bind_param("s", $name);
$stmt->execute();

$stmt->close();

mysqli_close($con);


?>