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
let { Owner } = require("../../config/config.json");
module.exports = {
    name: 'changedescription',
    description: "Change Description Of Product",
    accessableby: "admin",
    options: [
        {
            name: "code",
            description: "Code Of Product",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "description",
            description: "Description Of Product",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        let code = interaction.options.getString("code");
        let description = interaction.options.getString("description");
        let descriptions = description ? description : "Not Set";

        let getCode = await list
            .findOne({ code: code })
            .then((d) => {
                return d;
            })
            .catch(console.error);

        if (!getCode) return interaction.reply({
            content: `Product With That Code Doesnt Exit`,
            ephemeral: true
        });

        await list
            .findOneAndUpdate(
                {
                    code: code,
                },
                {
                    desc: descriptions,
                }
            )
            .then(async (d) => {
                await interaction.reply({
                    content: `Description Has Been Changed **${getCode.desc}** To **${descriptions}**`,
                    ephemeral: true
                });
            })
            .catch(console.error);
    }
}