const Discord = require('discord.js');

module.exports = {
    name: 'gen',
    description: '',
    aliases: [],
    usage: '[command name]',
    category: 'debug',
    async execute(message, args) {
        message.channel.send(rand())

    },
};


function rand() {
    return Math.random().toString(16).substr(2, 8);
}