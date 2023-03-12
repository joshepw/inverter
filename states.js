exports.WorkState = [
	"Self Check",
	"Battery BackUp",
	"Power Line",
	"Stop",
	"Debug",
	"Generator",
	"PowerOff",
	"StandBy",
];

exports.BuzzerState = [
	"Active",
	"Silence",
];

exports.BatteryState = [
	"StandBy",
	"In Use",
	"Discharging",
	"Charging",
];

exports.GridState = [
	"Offline",
	"Connected",
	"Warning",
];

exports.FaultCodes = {
	1: "Fan error. Please check the fan",
	2: "Temperature of machine is too high. Power off and waiting for 5 minutes",
	3: "Battery voltage is too high. Check the battery specifications",
	4: "Battery voltage is too Low. Check the battery specifications",
	5: "Output short circuited. Remove your load and restart",
	6: "Inverter output voltage is high. Return to repair center",
	7: "Over load. Drecrease your loaded devices",
	11: "Main relay failed",
	28: "Rated load recognition failed",
	51: "Output over current. Check if wiring is connected well and remove abnormal load",
	58: "Inverter output voltage is low. Decreace your loaded devices",
};