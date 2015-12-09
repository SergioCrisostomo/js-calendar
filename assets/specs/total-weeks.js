/*

== Total weeks in years of 1970 to 2050, from PHP: ==

	$arr = [];
	function getIsoWeeksInYear($year) {
		$date = new DateTime;
		$date->setISODate($year, 53);
		return ($date->format("W") === "53" ? 53 : 52);
	}
	for ($i = 1970; $i < 2050; $i++){
		array_push($arr, getIsoWeeksInYear($i));
	}
	echo json_encode($arr);

*/

module.exports = [53,52,52,52,52,52,53,52,52,52,52,53,52,52,52,52,52,53,52,52,52,52,53,52,52,52,52,52,53,52,52,52,52,52,53,52,52,52,52,53,52,52,52,52,52,53,52,52,52,52,53,52,52,52,52,52,53,52,52,52,52,52,53,52,52,52,52,53,52,52,52,52,52,53,52,52,52,52,53,52];
