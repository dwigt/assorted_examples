<html>
<body>
 
 
<?php
$con = mysql_connect("localhost","AGzZXxxP","EgkHNNsN");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
 
mysql_select_db("test", $con);

$sql="INSERT INTO test (fname)
VALUES
('$_POST[fname]')";
 
if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }
header("Location: http://temp.isobar.dk/peter/bio/tak.php");

mysql_close($con)
?>
</body>
</html>