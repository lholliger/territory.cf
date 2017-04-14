<?php
$act = $_GET['ACT'];

if (!isset($_COOKIE['UUID'])) {
	$uuid = microtime(true);
	$dir = "../data/$uuid/";
	mkdir($dir);
	file_put_contents($dir . "username", "block");
	file_put_contents($dir . "color", dechex(rand(0x000000, 0xFFFFFF)));
	file_put_contents($dir . "x", rand(-1000, 1000));
	file_put_contents($dir . "y", rand(-1000, 1000));
	file_put_contents($dir . "claimed", 0);
	setcookie("UUID", $uuid, time() + 3600 * 24 * 365 * 2);
}

	$uuid = $_COOKIE['UUID'];
	$dir = "../data/$uuid";


if ($act == "getX") {
	echo file_get_contents("$dir/x");
}

if ($act == "getY") {
	echo file_get_contents("$dir/y");
}

if ($act == "getC") {
	echo file_get_contents("$dir/color");
}

if ($act == "move") {
	$x = $_GET['x'];
	$y = $_GET['y'];
	if ($x >= 1000 || $y >= 1000 || $x <= -1000 || $y <= -1000) {
	if ($x == (file_get_contents("$dir/x") + 1) || $x == (file_get_contents("$dir/x") - 1)) {
		file_put_contents("$dir/x", $x);

		if (file_exists("../map/$x;$y")) {
			$usn = file_get_contents("../map/$x;$y");
			file_put_contents("../data/$usn/claimed", file_get_contents("../data/$usn/claimed") - 1);
		}

		file_put_contents("../map/$x;$y", $uuid);
		file_put_contents("../data/$uuid/claimed", file_get_contents("../data/$uuid/claimed") + 1);

	}

	else if ($y == (file_get_contents("$dir/y") + 1) || $y == (file_get_contents("$dir/y") - 1)) {
		file_put_contents("$dir/y", $y);

		if (file_exists("../map/$x;$y")) {
		$usn = file_get_contents("../map/$x;$y");
			file_put_contents("../data/$usn/claimed", file_get_contents("../data/$usn/claimed") - 1);
		}

		file_put_contents("../map/$x;$y", $uuid);
		file_put_contents("../data/$uuid/claimed", file_get_contents("../data/$uuid/claimed") + 1);

	}
	else {
		echo "ERR_TOO_FAST";
	}
	} else {
		echo "ERR_OUT_BOUND";
	}
}

if ($act == "getM") {
	$width = $_GET['w'];
	$height = $_GET['h'];

	$current_x = $_GET['x'];
	$current_y = -$_GET['y'];

	$uresy = $_GET['y'];

	$corner_x = round($current_x - ($width / 2));
	$corner_y = round($current_y + ($height / 2));

	$y_loop = $height + 1;
	$x_loop = 0;

	$rx = 0;
	$ry = 0;
	while($y_loop-- > 1) {
		while ($x_loop++ < $width) {
			$xc = ($x_loop + $corner_x);
			$yc = ($y_loop - $corner_y);
			if (file_get_contents("../map/" . $xc . ";" . $yc) == "") {
			echo "1e1e1e|";
			} else {
			if ($xc == $current_x && $yc == $uresy) {
			echo "767676|";
			} else {
			echo file_get_contents("../data/" . file_get_contents("../map/" . $xc . ";" . $yc) . "/color") . "|";
			}
			}
			$rx++;
		}
	$x_loop = 0;
	$rx = 0;
	$ry++;
	}
}

if ($act == "getO") {
	echo file_get_contents("$dir/claimed");
}
?>
