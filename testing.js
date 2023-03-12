const ModbusRTU = require('modbus-serial');

const client = new ModbusRTU();
client.connectRTUBuffered('/dev/tty.usbserial-110', { 
	baudRate: 9600,
	databits: 8,
	parity: 'none',
	autoOpen: false
});
client.setID(10);

var addr = 39000;

setInterval(async () => {
	try {
		const value = (await client.readHoldingRegisters(addr, 1)).data;

		console.log(`[${addr}] ${value}`)
	} catch (error) {
		
	}

	addr++;
}, 50);