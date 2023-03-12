const argv = require('minimist')(process.argv.slice(2));

exports.Serial = {
	port: argv?.serial || '/dev/tty.usbserial-110',
	config: { 
		baudRate: 9600,
		databits: 8,
		parity: 'none',
		autoOpen: false
	},
};

exports.Coords = {
	latitude: 15.528804,
	longitude: -87.975798,
};

exports.Server = {
	port: argv?.port || 8081,
	telegram: {
		key: process.env.TELEGRAM_TOKEN,
	},
};