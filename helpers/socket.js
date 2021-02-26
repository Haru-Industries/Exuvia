
const Keyv = require('keyv'),
    conlist = new Keyv('sqlite://db.sqlite', { namespace: 'connections' }),
    { id, owner } = require('../config.json'),
    requireFromString = require('require-module-from-string'),
    io = require('socket.io-client');
conlist.on('error', err => console.error(err))
var connectionlist
var explist
exports.updatelist = async function updatelist() {
    connectionlist = await conlist.get(id)

    console.log(Object.size(connectionlist))
}
exports.io = io

exports.connectinfo = async function connectinfo() {
    var connections = await conlist.get(id)
    //console.log(connections)

    if (typeof (connections) == 'undefined') { return } else {

        Object.getOwnPropertyNames(connections).forEach(
            function (val, idx, array) {
                console.log(`${val} - ${connections[val]['id']}`)
            }
        )
    }
}
async function test() {
    var connections = await conlist.get(id)
    if (typeof (connections) == 'undefined') { return } else {

        Object.getOwnPropertyNames(connections).forEach(
            function (val, idx, array) {
                console.log(`${val} - ${connections[val]['id']}`)
                requireFromString('exports.tsocket = io = require(\'socket.io-client\')(`${connections[val][\'addr\']}`) ')
            }
        )
    }
}

exports.tryconn = async function tryconn(addr, room) {
    const socket = require('socket.io-client')(addr);
    //console.log(addr)
    //socket.open()
    socket.once('connect', function () {
        //console.log(room)
        socket.emit(room)
    })

    return socket


}

exports.activeconn = async function activeconn() {
    if (typeof (connections) == 'undefined') { return `nc` } else {
        var conns = [];
        Object.getOwnPropertyNames(connections).forEach(
            function (val, idx, array) {
                //console.log(`${val} - ${connections[val]['id']}`)
                const socket = io(connections[val]['addr'], { autoConnect: false });
                if (socket.connected = true) {
                    conns.push(connections[val]['id'])
                }
            }
        )
        console.log(conns)
        return conns
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

/*
module.exports = {
    io: io = require('socket.io-client'),

    socket: socket = io('ws://localhost:3000', { autoConnect: false }),
    socket1: socket1 = io('ws://localhost:3100', { autoConnect: false }),

    opensocket: function opensocket() {
        socket.open();
    },

    opensocket1: function opensocket1() {
        socket1.open();
    }

}


*/