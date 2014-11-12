<?php

$con = mysqli_connect("localhost","root","root","myBar");

if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$request = file_get_contents("php://input");
$request = json_decode($request);

$type = mysql_real_escape_string($request->type);

//******* TODO: NEEED ERROR CHECK******

$stmt = $con->prepare("INSERT INTO Type (type) VALUES (?)");
$stmt->bind_param("s",$type);
$stmt->execute();

$stmt->close();

mysqli_close($con);


?>