
const Worker = require('./worker');
const Models = require('./models');
const events = require('events');

const activityEvent = new events.EventEmitter();
const wws = Worker.Server();
const db = Worker.Database();
const bot = Worker.Bot(activityEvent);

let lapsedSeconds = 0;
let consumption = 0;
let systemFault = null;

/**
 * @param {Models.Result} result 
 */
const onSerialResult = function (result) {
	activityEvent.emit('result', result);

	if (result.Device.SystemFault) {
		systemFault = result.Device.SystemFault;
	}

	consumption = (result.Output.Power / 3600) + consumption;

	if (lapsedSeconds > 59) {
		onLapsedMinute(result);
		lapsedSeconds = 0;
		consumption = 0;
		systemFault = null;
	} else {
		lapsedSeconds++;
	}
};

/**
 * @param {Models.Result} result 
 */
const onLapsedMinute = function (result) {
	if (systemFault) {
		db.run(`INSERT INTO faults (message) VALUES ("${systemFault}")`);
	}

	db.run(`INSERT INTO power (state, l1power, l2power, watts) VALUES ("${result.Device.WorkState}", ${result.L1.Power}, ${result.L2.Power}, ${result.Output.Power})`);
	db.run(`INSERT INTO consumption (power, state) VALUES (${consumption}, "${result.Device.WorkState}")`);
	db.run(`INSERT INTO battery (percent, temp, state) VALUES (${result.Battery.SocPercent}, ${result.Battery.Temperature}, "${result.Battery.State}")`);
};

/**
 * WebSocket on incomming connection event
 */
wws.on('request', (request) => {
	let connection = null;

	try {
		connection = request.accept('echo-protocol', request.origin);
	} catch (error) {
		return console.log(`${new Date()} Connection from origin ${request.origin} rejected. Reason: ${error}`);
	}
	
	console.log(`${new Date()} Connection accepted from ${connection.remoteAddress}.`);

	const send = (result) => {
		connection.send(JSON.stringify({
			type: 'response',
			payload: result
		}));
	};

	activityEvent.on('result', send);

	connection.on('message', (message) => {
		const request = JSON.parse(message.utf8Data);

		switch (request.type) {
			case 'get:power':
				Worker.ResponsePower(request, db, connection);
				break;

			case 'get:consumption':
				Worker.ResponseConsumption(request, db, connection);
				break;

			default:
				console.log(request);
				break;
		}
	});

	connection.on('close', function (reasonCode, description) {
		activityEvent.off('result', send);
		console.log(`${new Date()} Peer ${connection.remoteAddress} disconnected.`);
	});
});

Worker.ConnectSerial(onSerialResult);