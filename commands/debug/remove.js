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
        var list = await conlist.get(id)
        if (typeof (list) == 'undefined') {
            channel.send(`no values in connection list`)
        } else {
            if (!args.length) {
                return message.channel.send(`i need an index or name to remove`);
            } else {
                //checkj if its fuklly  number
                //console.log(isFinite(args[0]))

                if (isFinite(args[0])) {
                    //console.log(`is num`)
                    var torem = args[0].split('.')[0]
                    var todel = list[torem]['id']
                    delete list[torem]
                    await conlist.set(id, list)
                    message.channel.send(`removed index ${args[0]}: ${todel}`)
                    //message.channel.send(`New connection list: ${await conlist.get(id)}`)
                    updatelist()
                } else {
                    //console.log(`not num`)
                    Object.getOwnPropertyNames(list).forEach(
                        async function (val) {
                            //message.channel.send(`index ${val}: ${list[val]['id']}`)
                            if (list[val]['id'] == args[0]) {
                                delete list[val]
                                await conlist.set(id, list)
                                message.channel.send(`removed ${args[0]} from connections list`)
                            }
                        }
                    )
                }
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