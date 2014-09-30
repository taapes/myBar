<?php

$con = mysqli_connect("localhost","root","root","myBar");

if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$request = json_decode(file_get_contents("php://input"));

$atmo = mysql_real_escape_string($request->atmo);

//******* TODO: NEEED ERROR CHECK******

$stmt = $con->prepare("INSERT INTO Atmosphere (atmosphere) VALUES (?)");
$stmt->bind_param("s",$atmo);
$stmt->execute();

$stmt->close();

mysqli_close($con);


?>