<html>
<body>
 
 
<?php
$con = mysql_connect("localhost","website","website");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
 
mysql_select_db("bio_aarhus", $con);
 
$SQL = "SELECT * FROM bio_aarhus";
$result = mysqli_query($db_handle, $SQL);

while ( $db_field = mysqli_fetch_assoc($result) ) {

print $db_field['Ifname'] . "<BR>";

}

}
else {

print "Database NOT Found ";

}

mysqli_close($db_handle);

?>
</body>
</html>