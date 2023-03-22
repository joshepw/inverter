
const Worker = require('./worker');
const Models = require('./models');
const events = require('events');

const activityEvent = new events.EventEmitter();
const wws = Worker.Server();
const db = Worker.Database();
const bot = Worker.Bot(activityEvent, db);

let lapsedSeconds = 0;
let consumption = 0;
let systemFault = null;
let lastAlert = null;
let lastGridStatus = null;

/**
 * @param {Models.Result} result 
 */
const onSerialResult = function (result) {
	activityEvent.emit('result', result);

	if (result.Device.SystemFault) {
		systemFault = result.Device.SystemFault;
	}

	consumption = (result.Output.Power / 3600) + consumption;

	onUsersAlerts(result);

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
const onUsersAlerts = function (result) {
	if (lastAlert == null) {
		return;
	}

	if (result.Output.LoadPercent > 80 && lastAlert < (Date.now() - 1 * 60 * 1000)) {
		alertRegisteredUsers('🔌 The load of charge is over 80%! Please stop and reduce the risk.');
		lastAlert = Date.now();
	} else if (result.Output.LoadPercent > 65 && lastAlert < (Date.now() - 5 * 60 * 1000)) {
		alertRegisteredUsers('🔌 The load of charge is over 65%, please check the load.');
		lastAlert = Date.now();
	} else if (result.Output.LoadPercent > 50 && lastAlert < (Date.now() - 10 * 60 * 1000)) {
		alertRegisteredUsers('🔌 The load of charge is over 50%, remeber reduce your consumption.');
		lastAlert = Date.now();
	}

	if (lastGridStatus != result.Grid.State) {
		alertRegisteredUsers(`🔌 The power line state changed to *${result.Grid.State}*.`);
		lastGridStatus = result.Grid.State;
	}
};

const alertRegisteredUsers = (message) => {
	console.log(`${new Date()} Sending alert: ${message}`);

	db.each('SELECT username, chat_id FROM users', (err, row) => {
		bot.sendMessage(row.chat_id, message, { parse_mode: 'Markdown' });
		console.log(`${new Date()} Alert to @${row.username} [${row.chat_id}]`);
	});
}

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