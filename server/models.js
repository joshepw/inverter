const SunCalc = require('suncalc');
const Helpers = require('./helpers');
const States = require('./states');
const Config = require('./config');

class Device {
	constructor(config, sunlight) {
		this.Sunlight = sunlight;
		this.WorkState = States.WorkState[config[2]];
		this.MachineType = config[0];
		this.SoftwareVersion = config[1];
		this.RatedPower = Helpers.ParseValue(config[4]);
		this.RadiatorTemperature = Helpers.ParseValue(config[18]);
		this.TransformerTemperature = Helpers.ParseValue(config[19]);
		this.BuzzerState = States?.BuzzerState[config[20]];
		this.SystemFault = States?.FaultCodes[config[21]];
	}
}

class Battery {
	constructor(config, sunlight) {
		this.State = States.BatteryState[config[2] == 1 ? 1 : 0];

		if (config[2] == 2 && sunlight) {
			this.State = States.BatteryState[3];
		}

		this.Class = Helpers.ParseValue(config[3]);
		this.Voltage = Helpers.ParseValue(config[14], 0.1);
		this.Current = Helpers.ParseSignedValue(config[15], 0.1);
		this.Temperature = Helpers.ParseSignedValue(config[16]);
		this.SocPercent = Helpers.ParseSignedValue(config[17]);
	}
}

class Grid {
	constructor(config, values) {
		this.Charge = Boolean(config[24]);
		this.State = States.GridState[config[25]];
		this.Voltage = Helpers.ParseValue(values[2], 0.1);
		this.Frequency = Helpers.ParseValue(values[3], 0.1);
	}
}

class Line {
	constructor() {
		this.Voltage = null;
		this.Current = null;
		this.Power = null;
		this.VoltageCurrent = null;
		this.LoadPercent = null;
	}
}

class Output {
	constructor(values) {
		this.Voltage = Helpers.ParseValue(values[16], 0.1);
		this.Frecuency = Helpers.ParseValue(values[17], 0.1);
		this.Power = Helpers.ParseSignedValue(values[18]);
		this.VoltageCurrent = Helpers.ParseSignedValue(values[19]);
		this.LoadPercent = Helpers.ParseValue(values[20]);
	}
}

class Result {
	constructor(config, values) {
		const now = Date.now();
		const times = SunCalc.getTimes(new Date(), Config.Coords.latitude, Config.Coords.longitude);
		const sunlight = now > times.sunrise.getTime() && now < times.sunset.getTime();

		this.Device = new Device(config, sunlight);
		this.Battery = new Battery(config, sunlight);
		this.Grid = new Grid(config, values);

		this.L1 = new Line();
		this.L1.Voltage = Helpers.ParseValue(values[6], 0.1);
		this.L1.Current = Helpers.ParseValue(values[7], 0.1);
		this.L1.Power = Helpers.ParseSignedValue(values[8]);
		this.L1.VoltageCurrent = Helpers.ParseSignedValue(values[9]);
		this.L1.LoadPercent = Helpers.ParseSignedValue(values[10]);

		this.L2 = new Line();
		this.L2.Voltage = Helpers.ParseValue(values[11], 0.1);
		this.L2.Current = Helpers.ParseValue(values[12], 0.1);
		this.L2.Power = Helpers.ParseSignedValue(values[13]);
		this.L2.VoltageCurrent = Helpers.ParseSignedValue(values[14]);
		this.L2.LoadPercent = Helpers.ParseSignedValue(values[15]);

		this.Output = new Output(values);
	}
}

exports.Device = Device;
exports.Battery = Battery;
exports.Grid = Grid;
exports.Line = Line;
exports.Output = Output;

exports.Result = Result;