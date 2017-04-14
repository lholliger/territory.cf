<?php

$players = scandir("../data");
foreach($players as $p) {
	echo "$p. <font color='#" . file_get_contents("../data/$p/color") ."'>" . file_get_contents("../data/$p/claimed") . "</font><br>";
}

?>
