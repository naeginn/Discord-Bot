module.exports = {
	// Nome do comando
	name: 'ping',
	// Sub-nomes do comando.
	aliases: ['pong'],
	execute(message) {
		message.channel.send('Pong...');
	},
};