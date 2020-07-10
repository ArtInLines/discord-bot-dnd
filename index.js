const Discord = require('discord.js');
const Client = new Discord.Client();
require('dotenv').config({ path: `${__dirname}/config.env` });
const token = process.env.TOKEN;

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

Client.login(token);
