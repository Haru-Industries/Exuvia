const Discord = require('discord.js'),
    { updatelist, connectinfo, activeconn, tryconn, } = require('../../helpers/socket.js'),
    Keyv = require('keyv'),
    { id } = require('../../config.json'),
    conlist = new Keyv('sqlite://db.sqlite', { namespace: 'connections' });
conlist.on('error', err => console.error(err));
//const io = require('socket.io-client');
//const socket = io('ws://localhost:3000')

module.exports = {
    name: 'conn',
    description: '',
    aliases: [],
    usage: '[command name]',
    category: 'debug',
    async execute(message, args) {

        if (args[0] == 'all') {

            var connlist = await conlist.get(id)
            console.log(connlist)
            Object.getOwnPropertyNames(connlist).forEach(
                function (val) {
                    message.channel.send(`Attempting connection to ${connlist[val]['id']}`)
                    tryconn(connlist[val]['addr'], connlist[val]['id']).then((socket) => {
                        socket.on(connlist[val]['succ'], (data) => {
                            if (connlist[val]['succ'] == 'recv') { return message.channel.send(`connected to cmd test server`) } else {
                                message.channel.send(`${data}`)

                            }
                        })
                    })
                }
            )
            /*if (socket.connected == true) {
                return message.channel.send(`alr connectd`)
            } else {
                socket.reconnect()
            }*/
        } else if (args[0] == 'act') {
            cid = args[1];
            var currconn = await conlist.get(id)
            if (typeof (currconn) == 'undefined') { return message.channel.send(`no registered connections`) } else {
                message.channel.send(`Establishing connection to: ${currconn[cid]['id']}`)
                //console.log(currconn[cid]['addr'])
                tryconn(currconn[cid]['addr'], 'room').then((socket) => {
                    socket.on('room', (data) => {
                        message.channel.send(`Successfully connected to ${currconn[cid]['id']} ${data}`)
                    })
                })
            }

        } else {
            await connectinfo()
            var currconn = await conlist.get(id)
            if (typeof (currconn) == 'undefined') { return message.channel.send(`no registered connections`) } else {

                Object.getOwnPropertyNames(currconn).forEach(
                    function (val) {
                        message.channel.send(`${val}: ${currconn[val]['id']}`)
                    }
                )
            }
        }


    },
};


