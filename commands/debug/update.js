const Discord = require('discord.js'),
    Keyv = require('keyv'),
    { updatelist, connectinfo, activeconn, tryconn, execemit, } = require('../../helpers/socket.js'),
    { id, token, prefix, prefix: Gprefix, owner } = require('../../config.json'),
    requireFromString = require('require-module-from-string'),
    fs = require('fs'),
    conlist = new Keyv('sqlite://db.sqlite', { namespace: 'connections' });
conlist.on('error', err => console.error(err))


module.exports = {
    name: 'update',
    description: '',
    aliases: ['reload'],
    usage: '[command name]',
    category: 'debug',
    async execute(message, args) {

        if (args.join(' ') == 'all') {
            message.channel.send(`Initializing external connections...`)
            console.log(`initializing connection reload`)
            var currconn = await conlist.get(id)
            if (typeof (currconn) == 'undefined') {
                message.channel.send(`No registered connections.`)
                console.log(`no connections to reload`)
            } else {



                message.channel.send(`Connecting...`)
                Object.getOwnPropertyNames(currconn).forEach(
                    function (val) {
                        //message.channel.send(`Attempting connection to ${currconn[val]['id']}`)
                        console.log(`Attempting connection to ${currconn[val]['id']}`)
                        tryconn(currconn[val]['addr'], 'room').then((socket) => {
                            socket.on('room', (data) => {
                                //message.channel.send(`Connected to ${currconn[val]['id']} ${data}`)
                                console.log(`Connected to ${currconn[val]['id']} ${data}`)
                                socket.emit('enable')

                            })
                            socket.on('connect_error', () => {
                                message.channel.send(`${currconn[val]['id']} connection failed`)
                                console.log(`${currconn[val]['id']} connection failed`)
                                socket.disconnect()
                            })
                            socket.on('recv', (data, room) => {
                                //console.log(`Recieved ${name}`)
                                try {
                                    Object.getOwnPropertyNames(data).forEach(
                                        function (val) {
                                            const cmds = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))
                                            if (typeof (cmds[val]) == 'undefined') { return }
                                            const newcommand = requireFromString(cmds[val]['command']);
                                            const name = cmds[val]['name']
                                            message.client.commands.set(name, newcommand)
                                            message.channel.send(`Loaded ${name} from ${room}`)
                                            console.log(`Loaded ${name} from ${room}`)
                                        }
                                    )
                                    socket.emit('end')
                                } catch (e) {
                                    console.error(e)
                                }
                                //console.log(`Loaded ${remcount} remote commands`)

                                socket.on('disconnect', function () {
                                    message.channel.send(`Refresh for ${currconn[val]['id']} complete; disconnecting`)
                                    console.log(`Refresh for ${currconn[val]['id']} complete; disconnecting`)
                                })
                            })

                        })

                    }
                )

            }
        }



    },
};

