/*
== Total weeks in years of 1970 to 2050, from PHP: ==
	$arr = [];
	function getIsoWeeksInYear($year) {
		$date = new DateTime($year.'-12-31');
		return ($date->format("W") === "53" ? 53 : 52);
	}
	for ($i = 1970; $i < 2050; $i++){
		array_push($arr, getIsoWeeksInYear($i));
	}
	echo json_encode($arr);
*/

var totalWeeks = [53, 52, 52, 52, 52, 52, 53, 52, 52, 52, 52, 53, 52, 52, 52, 52, 52, 53, 52, 52, 52, 52, 53, 52, 52, 52, 52, 52, 53, 52, 52, 52, 52, 52, 53, 52, 52, 52, 52, 53, 52, 52, 52, 52, 52, 53, 52, 52, 52, 52, 53, 52, 52, 52, 52, 52, 53, 52, 52, 52, 52, 52, 53, 52, 52, 52, 52, 53, 52, 52, 52, 52, 52, 53, 52, 52, 52, 52, 53, 52];

/*
== Number of week in year for 1st of January ==
	$arr = [];
	function getWeek($year) {
		$date = new DateTime($year.'-01-01');
		return $date->format("W");
	}
	for ($i = 1971; $i < 2051; $i++){
		array_push($arr, getWeek($i));
	}
	echo json_encode($arr);
*/

var januaryWeekStart = [53, 52, 1, 1, 1, 1, 53, 52, 1, 1, 1, 53, 52, 52, 1, 1, 1, 53, 52, 1, 1, 1, 53, 52, 52, 1, 1, 1, 53, 52, 1, 1, 1, 1, 53, 52, 1, 1, 1, 53, 52, 52, 1, 1, 1, 53, 52, 1, 1, 1, 53, 52, 52, 1, 1, 1, 53, 52, 1, 1, 1, 1, 53, 52, 1, 1, 1, 53, 52, 52, 1, 1, 1, 53, 52, 1, 1, 1, 53, 52];

module.exports = {
	totalWeeks: totalWeeks,
	januaryWeekStart: januaryWeekStart
}