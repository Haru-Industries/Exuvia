# Exuvia
Project Exuvia

Proof of concept discord bot that allows for the use of both "local" commands and "remote" commands

Local commands are the typical run of the mill commands; plonked in commands/cmds or wherever the bot maker fancies

remote commands however arent stored in the dir with the bot. the bot instead connects to a server and fetches it

use `$.add <name> <port>/<address:port>`
If you provide only a number, it will be treated as a port: `ws://localhost:<port>`
