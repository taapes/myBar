<?php
$response = array();
$response["success"] = 0;
$response["message"] = "Unknown error!";

$con = mysqli_connect("localhost", "root", "root", "myBar");

if (!$con) {
    $response["message"] = "Failed to connect to MySQL: " . mysqli_connect_error();
}
$data = mysql_real_escape_string(file_get_contents("php://input"));
$response["data"] = $data;
$result;
if (isset($data)) {
    $sql = "SELECT json FROM Bars";

    $result = mysqli_query($con,$sql);
    if ($result) {
        
        $response["message"] = "Bar not found!";
        foreach ($result as $row) {
            if(json_decode($row["json"])->name == $data){
                $response["bar"] = json_decode($row["json"]);
                $response["success"] = 1;
                $response["message"] = "Bar Found!";
            }
        }
    }
    else {
        $response["message"] = "Bar not found!";
    }
} else {
    $response["message"] = "Bar Not found!";
}
 // echoing JSON response
$response = json_encode($response);
//$response = stripslashes($response);
echo $response;
?>