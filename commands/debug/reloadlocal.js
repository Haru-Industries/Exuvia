const fs = require('fs');

module.exports = {
    name: 'reloadlocal',
    description: '',
    aliases: ['reloadl', 'load'],
    usage: '[command name]',
    category: 'debug',
    async execute(message, args) {
        const cmdFiles = fs.readdirSync('./commands');
        var lcmds = new Array;
        for (const folder of cmdFiles) {
            const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
            lcmds.push(commandFiles)
        }
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            if (lcmds.toString().includes(commandName)) {

            } else {
                return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
            }
        }

        var cmdname = command != null ? command.name : commandName;
        const commandFolders = fs.readdirSync('./commands');
        const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${commandName}.js`));

        delete require.cache[require.resolve(`../${folderName}/${cmdname}.js`)];

        try {
            const newCommand = require(`../${folderName}/${cmdname}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Command \`${cmdname}\` was reloaded!`);
        } catch (error) {
            console.error(error);
            message.channel.send(`There was an error while reloading a command \`${cmdname}\`:\n\`${error.message}\``);
        }
    },
};