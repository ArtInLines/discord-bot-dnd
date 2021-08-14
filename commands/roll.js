const { SlashCommandBuilder } = require('@discordjs/builders');
const { randInt } = require('./../util/nums');

module.exports = {
	data: new SlashCommandBuilder().setName('roll').setDescription('Roll some dice'),
	global: true,
	guild: true,
	exec: async (_, interaction) => {
		await interaction.reply({ content: '' + randInt(10) });
	},
};
