require('dotenv').config();
const path = require('path');
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { getModulesFromDir } = require('./util/fsHelper');

// Set up Discord client
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });
client.CMDs = new Discord.Collection();
const guildCMDs = [],
	globalCMDs = [];

// Handle Commands
getModulesFromDir({
	dirPath: path.resolve(__dirname, 'commands'),
	spreadArr: true,
	returnFileList: false,
	cb: (cmd) => {
		client.CMDs.set(cmd.data.name, cmd);
		if (cmd.guild) guildCMDs.push(cmd.data.toJSON());
		if (cmd.global) globalCMDs.push(cmd.data.toJSON());
	},
});

// Handle Events
getModulesFromDir({
	dirPath: path.resolve(__dirname, 'events'),
	spreadArr: true,
	returnFileList: false,
	cb: (e) => {
		if (e.once) client.once(e.name, (...args) => e.exec(client, ...args));
		else client.on(e.name, (...args) => e.exec(client, ...args));
	},
});

// Set up slash commands
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
(async () => {
	try {
		await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: guildCMDs });
		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: globalCMDs });
		console.log('Successfully set application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

// Start up Bot
client.login(process.env.TOKEN);

/* 
const Client = new Discord.Client();

Client.on('ready', () => {
	console.log(`Logged in as ${Client.user.tag}`);
	Client.user.setActivity('Rolling');
});

Client.on('message', (msg) => {
	let cmd = msg.content.toLowerCase();
	if (cmd == 'roll' || cmd == 'r') return roll(msg);
	if (!cmd.startsWith('roll') && !cmd.startsWith('r')) return;

	cmd = cmd.replace('+', ' ');
	cmd = cmd.split(/ +/);
	cmd.splice(0, 1);
	for (let i = 0; i < cmd.length; i++) {
		if (cmd[i].includes('d') || cmd[i].includes('b')) {
			number = cmd[i].split(/[a-z]+/);
			cmd.splice(i, 1, number[0]);
			cmd.splice(i + 1, 0, number[1]);
		}
	}
	let diceAmount, rollingAmount, bonusDAmount, bonusDRollingAmount;
	if (cmd[0] != '') diceAmount = cmd[0];
	if (cmd[1] != '') rollingAmount = cmd[1];
	if (cmd[2] != '') bonusDAmount = cmd[2];
	if (cmd[3] != '') bonusDRollingAmount = cmd[3];
	return roll(msg, diceAmount, rollingAmount, bonusDAmount, bonusDRollingAmount);
});

function roll(msg, diceAmount = 1, rollingAmount = 6, bonusDAmount = 0, bonusDRollingAmount = rollingAmount) {
	let response = `You rolled:\n`;
	let resultsArray = [];
	for (let i = 0; i < diceAmount; i++) {
		const rollResult = Math.floor(Math.random() * rollingAmount) + 1;
		resultsArray.push(rollResult);
	}
	for (let i = 0; i < bonusDAmount; i++) {
		const rollResult = Math.floor(Math.random() * bonusDRollingAmount) + 1;
		resultsArray.push(rollResult);
	}
	for (let i = 0; i < diceAmount; i++) {
		if (bonusDAmount == 0 && i == diceAmount - 1) {
			response += `${resultsArray[i]} = `;
			continue;
		}
		response += `${resultsArray[i]} + `;
	}
	if (bonusDAmount > 0) {
		response += '(';
		for (let i = diceAmount; i < resultsArray.length; i++) {
			if (i == resultsArray.length - 1) {
				response += `${resultsArray[i]}) = `;
				continue;
			}
			response += `${resultsArray[i]} + `;
		}
	}
	resultsArray.sort((a, b) => a - b);
	for (let i = 0; i < bonusDAmount; i++) {
		resultsArray.shift();
	}
	let result = 0;
	for (let i = 0; i < resultsArray.length; i++) {
		result += resultsArray[i];
	}
	response += `${result}`;
	msg.channel.send(response);
	console.log(`Response sent: \n${response}`);
}

Client.login(TOKEN);
 */
