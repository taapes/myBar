<?php
$response["success"] = 0;
$response["message"] = "Unknown Error!";
if ( !empty( $_FILES ) ) {

    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
    $uploadPath = dirname( __DIR__ ) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $_POST['id'] . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];

    move_uploaded_file( $tempPath, $uploadPath );

    $response["success"] = 1;
	$response["message"] = "File uploaded successfully to ". $uploadPath;

    
} else {
	$response["success"] = 0;
	$response["message"] = "File does not exist";

}

$response = json_encode($response);
echo $response;
?>