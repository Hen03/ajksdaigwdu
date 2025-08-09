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
let list = require("../../Schema/list.js");
module.exports = {
    name: 'changetype',
    description: "Change Type Of Product",
    accessableby: "admin",
    options: [
        {
            name: "code",
            description: "Code Of Product",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "type",
            description: "Choose 1 Options Above This!",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "For Sell CID/RDP/SHOCK5/VPN/ETC",
                    value: "yes"
                },
                {
                    name: "For Sell Script Only",
                    value: "script"
                },
                {
                    name: "For Sell DF Only 🌲",
                    value: "df"
                }
            ]
        }
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        let code = interaction.options.getString("code");
        let typeName = interaction.options.getString("type");

        let getCode = await list
            .findOne({ code: code })
            .then((d) => {
                return d;
            })
            .catch(console.error);

        if (!getCode) return interaction.reply({
            content: `Product With That Code Doesn't Exist`,
            ephemeral: true
        });

        if (typeName) {
            if (typeName.includes("script") || typeName.includes("yes") || typeName.includes("df")) {
                await list
                    .updateOne(
                        {
                            code: code,
                        },
                        {
                            type: typeName,
                        }
                    )
                    .then(async (d) => {
                        await interaction.reply({
                            content: `Product Type Changed **${getCode.type}** to **${typeName}**`,
                            ephemeral: true
                        });
                    })
                    .catch(console.error);
            } else {
                await interaction.reply({
                    content: `Choice 1 Options In Type`,
                    ephemeral: true
                });
            }
        }
    }
}