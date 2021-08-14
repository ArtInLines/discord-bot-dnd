module.exports = {
	name: 'interactionCreate',
	once: false,
	exec: async (client, interaction) => {
		if (!interaction.isCommand()) return;

		const { commandName } = interaction;
		if (!client.CMDs.has(commandName)) return;

		try {
			await client.CMDs.get(commandName).exec(client, interaction);
		} catch (error) {
			console.error(error);
			return interaction.reply({ content: 'An error occurred while executing this command...', ephemeral: true });
		}
	},
};
