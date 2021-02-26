const Discord = require('discord.js'),
    Exuvia = new Discord.Client(),
    Keyv = require('keyv'),
    fs = require('fs'),
    { id, token, prefix, prefix: Gprefix, owner } = require('./config.json'),
    pfx = new Keyv('sqlite://db.sqlite', { namespace: 'prefix' }),
    ID = new Keyv('sqlite://db.sqlite', { namespace: 'ID' }),
    Creation = new Keyv('sqlite://db.sqlite', { namespace: 'date' }),
    Conns = new Keyv('sqlite://db.sqlite', { namespace: 'socket' }),
    conlist = new Keyv('sqlite://db.sqlite', { namespace: 'connections' }),
    requireFromString = require('require-module-from-string'),
    { io, socket, socket1, opensocket, opensocket1, tryconn } = require('./helpers/socket.js'),
    //cmdsocket = io('ws://localhost:3200', { autoConnect: false }),
    cmds = new Keyv('sqlite://db.sqlite', { namespace: 'cmds' });
pfx.on('error', err => console.error(err));
ID.on('error', err => console.error(err));
Creation.on('error', err => console.error(err));
Conns.on('error', err => console.error(err));
conlist.on('error', err => console.error(err))




console.log(`Exuvia initializing`)
console.log('Starting Exuvia login')
//J4V9
//F9DN

try {
    Exuvia.login(token).then(() => console.log('Exuvia logged in'));
} catch (e) {
    console.error(e)
};

Exuvia.on('ready', () => {
    setID();
    console.log('Exuvia ready')
    loadconn();
})

Exuvia.commands = new Discord.Collection();
var cmdcount = 0;
const cmdFiles = fs.readdirSync('./commands');
for (const folder of cmdFiles) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        cmdcount = cmdcount + 1
        const command = require(`./commands/${folder}/${file}`);
        Exuvia.commands.set(command.name, command);
    }
}
console.log(`Loaded ${cmdcount} local commands`)
var remcount = 0;

async function loadconn() {
    console.log(`Initializing external connections...`)
    var currconn = await conlist.get(id)
    if (typeof (currconn) == 'undefined') {
        return console.log(`No registered connections.`)
    } else {
        console.log(`Discovered ${Object.size(currconn)} registered connections`)
        console.log(`Connecting...`)
        Object.getOwnPropertyNames(currconn).forEach(
            function (val) {
                console.log(`Attempting connection to ${currconn[val]['id']}`)
                tryconn(currconn[val]['addr'], 'room').then((socket) => {
                    socket.on('room', (data) => {
                        console.log(`Connected to ${currconn[val]['id']} ${data}`)
                        socket.emit('enable')

                    })
                    socket.on('connect_error', () => {
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
                                    Exuvia.commands.set(name, newcommand)
                                    console.log(`Loaded ${name} from ${room}`)
                                    remcount = remcount + 1;
                                }
                            )
                            socket.emit('end')
                        } catch (e) {
                            console.error(e)
                        }
                        //console.log(`Loaded ${remcount} remote commands`)

                        socket.on('disconnect', function () {
                            console.log(`Refresh for ${currconn[val]['id']} complete; disconnecting`)
                        })
                    })

                })

            }
        )

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

Exuvia.on('message', async message => {
    if (message.author.bot) return;
    let args;
    if (message.guild) {
        let prefix2;
        if (message.content.startsWith(Gprefix)) {
            prefix2 = Gprefix;
        } else {
            const guildPrefix = await pfx.get(message.guild.id);
            if (message.content.startsWith(guildPrefix)) prefix2 = guildPrefix;
        }
        if (!prefix2) return;
        args = message.content.slice(prefix.length).trim().split(/\s+/);
    } else {
        const slice = message.content.startsWith(Gprefix) ? Gprefix.length : 0;
        args = message.content.slice(slice).split(/\s+/);
    }
    const cmdName = args.shift().toLowerCase();
    const command = Exuvia.commands.get(cmdName) || Exuvia.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
    if (!command) { return; };
    try {
        command.execute(message, args);
    } catch (error) {
        logger.error(error);
    };
});

async function setID() {
    if (typeof (await ID.get(id)) == 'undefined') {
        await ID.set(id, rand());
        await Creation.set(id, new Date())
        console.log(`Set ID to ${await ID.get(id)}`)
    } else {
        console.log(`using existing ID: ${await ID.get(id)}`)
        console.log(`ID was assigned at ${await Creation.get(id)}`)
    }
}



function rand() {
    return Math.random().toString(16).substr(2, 8);
}

