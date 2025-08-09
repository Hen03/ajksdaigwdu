require('./console/watermark')
let {
    GatewayIntentBits,
    Client,
    Collection
} = require("discord.js");
let IncludedIntents = Object
    .entries(GatewayIntentBits)
    .reduce((t, [, V]) => t | V, 0);
let client = new Client({ intents: IncludedIntents });

client.startTime = Date.now()
client.events = new Collection()
client.slash = new Collection()
client.config = require("./config/config.json")

module.exports = client;

["mongodb", "discord", "event", "slash"].forEach((file) => {
    require(`./handlers/${file}`)(client);
});

process.on("unhandledRejection", async (err) => {
    console.log(`[SYSTEM ERROR]`.bgRed.bold, `Unhandled Rejection : \n${err.stack}`.red.bold);
})