const Discord = require('discord.js');

module.exports = {
    name: 'cmds',
    description: '',
    aliases: [],
    usage: '[command name]',
    category: 'debug',
    async execute(message, args) {

        const { commands } = message.client;

        var cmds = commands.map(command => command.name).join(', ')

        return message.channel.send(`commands: ${cmds}`)
            .then(() => {
                //dm
            })
            .catch(error => {
                //dm
            });



    },
};


