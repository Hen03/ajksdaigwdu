let {
    EmbedBuilder,
    Client,
    CommandInteraction,
    ChannelType,
    AttachmentBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ApplicationCommandOptionType,
} = require("discord.js");
let depo = require("../../Schema/depo.js")
let { Owner } = require("../../config/config.json");
module.exports = {
    name: 'setdepo',
    description: "Set World Deposit",
    accessableby: "admin",
    options: [
        {
            name: "world",
            description: "World Deposit",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "owner",
            description: "Nama Owner World Depo",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "botname",
            description: "Name Of Bot Depo",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "saweria",
            description: "Put The Link For Donate!",
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: "trakteer",
            description: "Put The Link For Donate!",
            type: ApplicationCommandOptionType.String,
            required: false
        },
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        let world = interaction.options.getString("world");
        let owner = interaction.options.getString("owner");
        let botName = interaction.options.getString("botname");
        let sawerias = interaction.options.getString("saweria");
        let trakteers = interaction.options.getString("trakteer");
        let trakteer = trakteers ? trakteers : "Not Set";
        let saweria = sawerias ? sawerias : "Not Set";
        await depo.findOneAndUpdate(
                {},
                {
                    $set: {
                        world: world,
                        owner: owner,
                        botName: botName,
                        saweria: saweria,
                        Trakteer: trakteer
                    },
                },
                { upsert: true, new: true }
            )
            .then(async (d) => {
                if (sawerias && trakteers) {
                    await interaction.reply({
                        content: `**Successfully Set Deposit**\n- With World: **${world}**\n- With Owner: **${owner}**\n- With Bot Name: **${botName}**\n- Set Link Saweria: **${sawerias}**\n- Set Link Trakteer: **${trakteers}**`,
                        ephemeral: true
                    });
                } else if (sawerias) {
                    await interaction.reply({
                        content: `**Successfully Set Deposit**\n- With World: **${world}**\n- With Owner: **${owner}**\n- With Bot Name: **${botName}**\n- Set Link Saweria: **${sawerias}**`,
                        ephemeral: true
                    });
                } else if (trakteers) {
                    await interaction.reply({
                        content: `**Successfully Set Deposit**\n- With World: **${world}**\n- With Owner: **${owner}**\n- With Bot Name: **${botName}**\n- Set Link Trakteer: **${trakteers}**`,
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: `**Successfully Set Deposit**\n- With World: **${world}**\n- With Owner: **${owner}**\n- With Bot Name: **${botName}**`,
                        ephemeral: true
                    });
                }
            })
            .catch((e) => console.error(e));
    }
}