const Discord = require('discord.js'),
    Keyv = require('keyv'),
    { owners, id } = require('../../config.json'),
    pfx = new Keyv('sqlite://db.sqlite', { namespace: 'prefix' }),
    ID = new Keyv('sqlite://db.sqlite', { namespace: 'ID' }),
    Creation = new Keyv('sqlite://db.sqlite', { namespace: 'date' }),
    conlist = new Keyv('sqlite://db.sqlite', { namespace: 'connections' }),
    connections = new Keyv('sqlite://db.sqlite', { namespace: 'conn' }),
    { updatelist } = require('../../helpers/socket.js'),
    { io, socket } = require('../../helpers/socket.js');
conlist.on('error', err => console.error(err));
pfx.on('error', err => console.error(err));
ID.on('error', err => console.error(err));
Creation.on('error', err => console.error(err));
connections.on('error', err => console.error(err));
module.exports = {
    name: 'remove',
    description: '',
    aliases: [],
    category: 'debug',
    usage: '[command name]',
    async execute(message, args) {
        if (!args.length) {
            return message.channel.send(`i need an index or name to remove`);
        } else {
            var torem = args[0]
            var list = await conlist.get(id)
            var connectlist = await conlist.get(id)
            message.channel.send(`current connections registered:`)
            Object.getOwnPropertyNames(list).forEach(
                function (val) {
                    message.channel.send(`index ${val}: ${list[val]['id']}`)
                }
            )
            if (typeof (connectlist) == 'undefined') {
                // check size; index = size +1
                channel.send(`no values in connection list`)
            } else {
                console.log(parseInt(torem))
                if (!isNaN(torem)) {
                    console.log(list[torem])
                    delete list[torem]
                }


                console.log(list)

                //list[Object.size(list) + 1] = { 'id': `${args[0]}`, 'addr': `${args[1]}` }
                await conlist.set(id, list)
                message.channel.send(`New connection list: ${await conlist.get(id)}`)
                updatelist()
            }
        }

    }
}

Object.size = function (obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};