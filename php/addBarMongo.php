<?php

$connection = new MongoClient();
$db = $connection->myBar;


$collection = $db->Bars;

$request = json_decode(file_get_contents("php://input"));

//$collection->update({key: $request->name},{data: $request}.{upsert: true);


?>