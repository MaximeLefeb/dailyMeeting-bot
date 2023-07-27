const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config/discordConfig.json');

const commands = [
    new SlashCommandBuilder().setName('meetup').setDescription('Lancer le daily meeting'),
    new SlashCommandBuilder().setName('cheers').setDescription('Féléciter votre équipe !'),
    new SlashCommandBuilder().setName('cheersto').setDescription('Féléciter un collège !').addUserOption(option =>
        option.setName("target").setDescription("Id de l'utilisateur à féléciter").setRequired(true)
    )
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commands
}).then(() => {
    console.log('Commands build-up ✔️');
}).catch(() => {
    console.error;
});