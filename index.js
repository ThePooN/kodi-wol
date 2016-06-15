var wol = require("wake_on_lan");
var spawn = require("child_process").spawn;
var config = require("./config.json");
var magic_packet = wol.createMagicPacket(config.mac);

var dgram = require("dgram");
var server = dgram.createSocket("udp4");

server.on("listening", function () {
	var address = server.address();
	console.log("UDP Server listening on " + address.address + ":" + address.port);
});

server.on("message", function (message, remote) {
	if(message == magic_packet.toString()) {
		console.log("Incoming WOL packet from "+remote.address+":"+remote.port);
		var proc = spawn("service", ["kodi", "start"]);
		proc.on("close", function(code) {
			console.log("Exit code "+code);
		});
	}
});

server.bind(config.port, config.host);
