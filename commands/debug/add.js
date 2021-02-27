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
    name: 'add',
    description: '',
    aliases: [],
    category: 'debug',
    usage: '[command name]',
    async execute(message, args) {
        if (!args.length) {
            return message.channel.send(`i need token + addr`);
        } else {
            var connectlist = await conlist.get(id)
            if (typeof (connectlist) == 'undefined') {
                // check size; index = size +1
                message.channel.send(`adding ${args[0]}`)
                var list = new Object();
                var address = isNaN(args[1]) == true ? args[1] : `ws://localhost:${args[1]}`;
                list['0'] = { 'id': `${args[0]}`, 'addr': address };//, 'succ': `${args[2]}` };
                await conlist.set(id, list)
                //console.log(Object.entries(await conlist.get(id)))
                updatelist()
            } else {
                var list = await conlist.get(id)


                message.channel.send(`adding ${args[0]}`)

                var address = isNaN(args[1]) == true ? args[1] : `ws://localhost:${args[1]}`;
                list[Object.size(list)] = { 'id': `${args[0]}`, 'addr': address };//, 'succ': `${args[2]}` }
            }
            await conlist.set(id, list)
            updatelist()
            //console.log(await conlist.get(id))
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