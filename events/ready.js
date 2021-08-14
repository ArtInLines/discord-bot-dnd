module.exports = {
	name: 'ready',
	once: true,
	exec: (client) => console.log(`${client.user.username} is ready...`),
};
