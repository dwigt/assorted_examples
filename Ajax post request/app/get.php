<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>Biograftur Aarhus</title>

    <!-- Place favicon.ico in the root directory -->

    <!-- build:css styles/vendor.css -->
    <!-- bower:css -->
    <!-- endbower -->
    <!-- endbuild -->

    <!-- build:css styles/main.css -->
    <link rel="stylesheet" href="styles/main.css">
    <!-- endbuild -->

    <!-- build:js scripts/vendor/modernizr.js -->
    <script src="/bower_components/modernizr/modernizr.js"></script>
    <!-- endbuild -->
</head>

<body>
     <div class="tilmeldingscontainer">
     <h3 style="margin: 0">Tilmeldte:</h3><br>
<?php

$i=0;

$con = mysql_connect("localhost","website","website");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
 
mysql_select_db("bio_aarhus", $con);
$sql="SELECT fname from Tilmeldte";
$result = mysql_query($sql);
$values = mysql_fetch_array($result);

if (!mysql_query($sql,$con))
  {
  die('Error: ' . mysql_error());
  }
while ($row = mysql_fetch_assoc($result)) {
    foreach($row as $child) {
      echo "<tr><p><td>" . $i . ": </td><td>" . $child . "</td></p></tr>";
      $i++;
    }
    
}


mysql_close($con)
?>  
</div>
    <!-- build:js scripts/vendor.js -->
    <!-- bower:js -->
    <script src="/bower_components/jquery/dist/jquery.js"></script>
    <script src="/bower_components/tether/dist/js/tether.js"></script>
    <script src="/bower_components/modernizr/modernizr.js"></script>
    <!-- endbower -->
    <!-- endbuild -->

        <!-- build:js scripts/plugins.js -->
    <script src="/bower_components/bootstrap/js/dist/util.js"></script>
    <script src="/bower_components/bootstrap/js/dist/alert.js"></script>
    <script src="/bower_components/bootstrap/js/dist/button.js"></script>
    <script src="/bower_components/bootstrap/js/dist/carousel.js"></script>
    <script src="/bower_components/bootstrap/js/dist/collapse.js"></script>
    <script src="/bower_components/bootstrap/js/dist/dropdown.js"></script>
    <script src="/bower_components/bootstrap/js/dist/modal.js"></script>
    <script src="/bower_components/bootstrap/js/dist/scrollspy.js"></script>
    <script src="/bower_components/bootstrap/js/dist/tab.js"></script>
    <script src="/bower_components/bootstrap/js/dist/tooltip.js"></script>
    <script src="/bower_components/bootstrap/js/dist/popover.js"></script>
    <!-- endbuild -->
    
    <!-- build:js scripts/main.js -->
    <script src="scripts/main.js"></script>
    <!-- endbuild -->
</body>
</html>