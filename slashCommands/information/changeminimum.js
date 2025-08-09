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
    name: 'changeminimum',
    description: "Change mimimum buy Of Product",
    accessableby: "admin",
    options: [
        {
            name: "code",
            description: "Code Of Product",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "minimum",
            description: "New minimum buy For Product",
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        let code = interaction.options.getString("code");
        let productName = interaction.options.getNumber("minimum");

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


        await list
            .updateOne(
                {
                    code: code,
                },
                {
                    minimum: productName,
                }
            )
            .then(async (d) => {
                await interaction.reply({
                    content: `Product Name **${getCode.minimum}** Changed To **${productName}**`,
                    ephemeral: true
                });
            })
            .catch(console.error);
    }
}