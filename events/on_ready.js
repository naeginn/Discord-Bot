
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		// Informar que o bot estar online.
		console.log(`${client.user.username} está online.`);
	},
};