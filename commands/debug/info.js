
const Discord = require('discord.js'),
    Keyv = require('keyv'),
    { owners, id } = require('../../config.json'),
    pfx = new Keyv('sqlite://db.sqlite', { namespace: 'prefix' }),
    ID = new Keyv('sqlite://db.sqlite', { namespace: 'ID' }),
    Creation = new Keyv('sqlite://db.sqlite', { namespace: 'date' }),
    con2 = new Keyv('sqlite://db.sqlite', { namespace: 'conn2' }),
    connections = new Keyv('sqlite://db.sqlite', { namespace: 'conn' }),
    { io, socket, socket1 } = require('../../helpers/socket.js');
pfx.on('error', err => console.error(err));
ID.on('error', err => console.error(err));
Creation.on('error', err => console.error(err));
connections.on('error', err => console.error(err));
con2.on('error', err => console.log(err));
module.exports = {
    name: 'info',
    description: '',
    aliases: [],
    category: 'debug',
    usage: '[command name]',
    async execute(message, args) {


        //message.channel.send(`${message.client.user.username} ${await ID.get(id)} online\nID assigned at ${await Creation.get(id)}`);

        if (socket.connected == false) {
            const emb = new Discord.MessageEmbed()
                .setColor('#EA28D4')
                //.setDescription(`Exuvia`)
                .setTimestamp()
                .setFooter(`\u200B`, `${message.client.user.displayAvatarURL()}`)
            message.channel.send(emb.addField(`${message.client.user.username}`, ` ${await ID.get(id)} online\nID assigned at ${await Creation.get(id)}`).addField(`External connections:`, 'none'))
        } else if (socket.connected == true) {

            //socket.emit('AOJqoyGd')
            msg()
            async function waitForElement() {
                if (typeof (await connections.get(id)) !== "undefined") {
                    const emb = new Discord.MessageEmbed()
                        .setColor('#EA28D4')
                        //.setDescription(`Exuvia`)
                        .setTimestamp()
                        .setFooter(`\u200B`, `${message.client.user.displayAvatarURL()}`)
                    emb.addField(`${message.client.user.username}`, ` ${await ID.get(id)} online\nID assigned at ${await Creation.get(id)}`)
                    //variable exists, do what you want
                    emb.addField(`External connections:`, `${await connections.get(id)}`)
                    message.channel.send(emb.addField(`External connections:`, `${await con2.get(id)}`))
                    await connections.clear();
                    await con2.clear();
                }
                else {
                    setTimeout(waitForElement, 250);
                }
            }
            waitForElement()
            //console.log(await connections.get(socket.id))
        }


    },
}




async function msg() {
    socket.emit('AOJqoyGd')
    socket1.emit('ZF8chNAS')
    socket.on('curroom', async (infos) => {
        return await connections.set(id, infos)
        //await connections.clear()
    })
    socket1.on('curroom', async (infos) => {
        return await con2.set(id, infos)
    })
}