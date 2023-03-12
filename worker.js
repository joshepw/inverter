const TelegramBot = require('node-telegram-bot-api');
const ModbusRTU = require('modbus-serial');
const WebSocket = require('websocket');
const Http = require('http');
const Fs = require('fs');
const Mime = require('mime-types');
const Path = require('path');
const Dayjs = require('dayjs');
const Duration = require('dayjs/plugin/duration');
const LocaleData = require('dayjs/plugin/localeData');
const Utc = require('dayjs/plugin/utc');
const Timezone = require('dayjs/plugin/timezone');
const Sqlite3 = require('sqlite3');
const Config = require('./config');
const Helpers = require('./helpers');
const Models = require('./models');

Dayjs.extend(Duration);
Dayjs.extend(LocaleData);
Dayjs.extend(Utc);
Dayjs.extend(Timezone);

exports.ConnectSerial = async function (onSendData) {
	try {
		const client = new ModbusRTU();
		client.connectRTUBuffered(Config.Serial.port, Config.Serial.config);
		client.setTimeout(30 * 1000);
		client.setID(10);

		setInterval(async () => {
			const config = (await client.readHoldingRegisters(30000, 27)).data;
			const values = (await client.readHoldingRegisters(30030, 30)).data;

			onSendData(new Models.Result(config, values));
		}, 1000);
	} catch (error) {
		console.warn('The port is not available, will be try again in 30s ...');

		await Helpers.Sleep(30 * 1000);
	}
};

exports.Server = function () {
	const server = Http.createServer(function (request, response) {
		console.log(`${new Date()} Received request for ${request.url}`);

		try {
			let filePath = Path.join(__dirname, 'power-dashboard/dist', (new URL(`http://localhost${request.url}`)).pathname);

			if (Fs.existsSync(filePath)) {
				let stat = Fs.statSync(filePath);

				if (stat.isDirectory()) {
					const index = Path.join(filePath, 'index.html');

					if (Fs.existsSync(index)) {
						filePath = index;
						stat = Fs.statSync(filePath);
					} else {
						throw 'Index not found';
					}
				}

				response.writeHead(200, {
					'Content-Length': stat.size,
					'Content-Type': Mime.lookup(filePath),
				});

				Fs.createReadStream(filePath).pipe(response);
				console.log(`${new Date()} loaded ${filePath}`);
			} else {
				console.warn(`${new Date()} File not found at ${filePath}`);

				response.writeHead(404);
				response.end();
			}
		} catch (err) {
			console.error(err);
			response.writeHead(500);
			response.end(err);
		}
	});

	server.listen(Config.Server.port, function () {
		console.log(`${new Date()} Server is listening on port ${Config.Server.port}`);
	});

	return new WebSocket.server({
		httpServer: server,
		autoAcceptConnections: false,
	});
};

exports.Database = function () {
	const db = new Sqlite3.Database('historical.db');

	db.run('CREATE TABLE IF NOT EXISTS "battery" ("id" integer,"percent" int,"temp" int,"state" varchar, "timestamp" DATE DEFAULT (datetime(\'now\',\'localtime\')), PRIMARY KEY (id));');
	db.run('CREATE TABLE IF NOT EXISTS "consumption" ("id" integer,"power" int,"state" varchar,"timestamp" DATE DEFAULT (datetime(\'now\',\'localtime\')), PRIMARY KEY (id));');
	db.run('CREATE TABLE IF NOT EXISTS "faults" ("id" integer,"message" varchar, "timestamp" DATE DEFAULT (datetime(\'now\',\'localtime\')), PRIMARY KEY (id));');
	db.run('CREATE TABLE IF NOT EXISTS "power" ("id" integer,"state" varchar,"l1power" int,"l2power" int,"watts" int,"timestamp" DATE DEFAULT (datetime(\'now\',\'localtime\')), PRIMARY KEY (id));');
	db.run('CREATE TABLE IF NOT EXISTS "users" ("id" integer,"username" varchar,"chat_id" int, PRIMARY KEY (id));');

	return db;
}

exports.ResponsePower = function (request, db, ws) {
	db.all("SELECT avg(l1power) AS l1, avg(l2power) AS l2, strftime ('%H', timestamp) AS hour FROM power WHERE DATETIME (timestamp) >= DATETIME ('now', '-6 Hour', 'localtime') GROUP BY strftime ('%H', timestamp);", (err, row) => {
		ws.send(JSON.stringify({
			type: 'response:power',
			payload: row
		}));
	});
};

exports.ResponseConsumption = function (request, db, ws) {
	const data = {
		datasets: [
			{
				label: 'Power Line',
				backgroundColor: 'rgba(80, 150, 127, 0.5)',
				borderColor: 'rgba(80, 150, 127, 1)',
				borderWidth: 2,
				borderSkipped: false,
				data: [],
			},
			{
				label: 'Battery BackUp',
				backgroundColor: 'rgba(101, 115, 193, 0.5)',
				borderColor: 'rgba(101, 115, 193, 1)',
				borderWidth: 2,
				borderSkipped: false,
				data: [],
			}
		],
		grid: 0,
		battery: 0,
		total: 0,
		from: null,
	}

	switch (request.format) {
		case 'day':
			const hours = Array.from(Array(24).keys());
			data.labels = hours.map(i => Dayjs().subtract(i, 'hour').format('dd ha')).reverse(),
				data.from = Dayjs().subtract(24, 'hour').format('YYYY-MM-DD hh:mm:ss');
			break;
		case 'month':
			data.labels = Array.from(Array(Dayjs().daysInMonth()).keys()).map(i => String(i + 1));
			data.from = Dayjs().startOf('month').format('YYYY-MM-DD hh:mm:ss');
			break;

		case 'year':
			data.labels = Dayjs.monthsShort();
			data.from = Dayjs().startOf('year').format('YYYY-MM-DD hh:mm:ss');
		default:
			break;
	}

	const formats = {
		'day': ['%Y-%m-%d %H', 'dd ha'],
		'month': ['%Y-%m-%d', 'D'],
		'year': ['%Y-%m', 'MMM'],
	};

	db.all(`SELECT state,sum(power)as power,strftime('${formats[request.format][0]}', timestamp)AS x FROM consumption WHERE timestamp > '${data.from}' GROUP BY strftime('${formats[request.format][0]}', timestamp),state;`, (err, row) => {
		row.forEach(i => {
			if (i.state == 'Power Line') {
				data.datasets[0].data.push({ x: Dayjs(i.x).format(formats[request.format][1]), y: Math.round(i.power) });
				data.grid += i.power;
			}

			if (i.state == 'Battery BackUp') {
				data.datasets[1].data.push({ x: Dayjs(i.x).format(formats[request.format][1]), y: Math.round(i.power) });
				data.battery += i.power;
			}

			data.total += i.power;
		});

		ws.send(JSON.stringify({
			type: 'response:consumption',
			payload: data
		}));
	});
};

exports.Bot = (listener) => {
	const bot = new TelegramBot(Config.Server.telegram.key, { polling: true });

	bot.onText(/\/echo/, (msg, match) => {
		listener.once('result', (result) => {
			bot.sendMessage(msg.chat.id, `Hi! the working state is *${result.Device.WorkState}*, with a load of *${result.Output.LoadPercent}% (${result.Output.Power}W)*. The actual state of battery is *${result.Battery.State}* with a capacity of *${result.Battery.SocPercent}%*. What do you want to know?`, {
				parse_mode: 'Markdown',
			});
		});
	});

	bot.on('message', (msg) => {
		bot.sendMessage(msg.chat.id, `Hi! What do you want to know?`, {
			parse_mode: 'Markdown',
			reply_markup: JSON.stringify({
				inline_keyboard: [
					[
						{
							text: 'Status',
							callback_data: 'status',
						},
						{
							text: 'Battery',
							callback_data: 'battery',
						},
						{
							text: 'Lines',
							callback_data: 'lines',
						},
						{
							text: 'Consumption',
							callback_data: 'consumption',
						},
						{
							text: 'Register alerts',
							callback_data: 'register',
						},
					]
				]
			})
		});
	});

	bot.on('callback_query', function onCallbackQuery(callbackQuery) {
		const action = callbackQuery.data;
		const msg = callbackQuery.message;

		const opts = {
			chat_id: msg.chat.id,
			message_id: msg.message_id,
			parse_mode: 'Markdown',
		};

		let text = 'See ya!';

		listener.once('result', (result) => {
			if (action === 'status') {
				text = `The working state is *${result.Device.WorkState}*, with a load 🔌 of *${result.Output.LoadPercent}% (${result.Output.Power}W)*. The actual state of battery 🔋 is *${result.Battery.State}* with a capacity of *${result.Battery.SocPercent}%*`;
			}

			if (action === 'battery') {
				text = `🔋 *${result.Battery.State}* (*${result.Battery.SocPercent}%* - ${result.Battery.Temperature}˚C)`;
			}

			if (action === 'lines') {
				text = `🔌 Line1 *${result.L1.Power}W* (*Load: ${result.L1.LoadPercent}%* / ${result.L1.Voltage}W / ${result.L1.Current}A) | 🔌 Line2 *${result.L2.Power}W* (*Load: ${result.L2.LoadPercent}%* / ${result.L2.Voltage}W / ${result.L2.Current}A)`;
			}
	
			bot.editMessageText(text, opts);
		});
	});

	return bot;
};