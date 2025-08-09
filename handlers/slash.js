let client = require('../index.js');
let { CLIENTID, TOKEN } = require("../config/config.json");
let { REST, Routes } = require('discord.js');
let fs = require('fs');

module.exports = async () => {
    let slash = [];
    fs.readdirSync('./slashCommands/').forEach(dir => {
        let commands = fs.readdirSync(`./slashCommands/${dir}`).filter(file => file.endsWith('.js'));
        for (let file of commands) {
            let pull = require(`../slashCommands/${dir}/${file}`);
            if (pull.name) {
                slash.push(pull)
                client.slash.set(pull.name, pull);
            } else {
                console.log("----------------------------------------".yellow);
                console.log(`[HANDLER - EVENTS]`.bgYellow.bold, `Couldn't load the file ${file}, missing name or aliases`.bgRed.bold);
                console.log("----------------------------------------".yellow);
                continue;
            }
        }
    });
    let CLIEND_ID = CLIENTID;
    let rest = new REST({ version: '10' })
        .setToken(TOKEN);

    await rest.put(
        Routes.applicationCommands(CLIEND_ID),
        { body: slash }
    )
    .then(() => {
        console.log("----------------------------------------".yellow);
        console.log(`[HANDLER - SLASH]`.bgMagenta.bold, `Slash commands has been registered successfully to all the guilds`.green.bold);
        console.log("----------------------------------------".yellow);
    })
    .catch(console.error());
}