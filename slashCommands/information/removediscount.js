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
let discount = require("../../Schema/discount.js");
module.exports = {
    name: 'removediscount',
    description: "Remove Discord From Product",
    accessableby: "admin",
    options: [
        {
            name: "code",
            description: "Code Of Product",
            type: ApplicationCommandOptionType.String,
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

        let getCode = await list
            .findOne({ code: code })
            .then((res) => {
                return res;
            })
            .catch(console.error);

        if (!getCode) return interaction.reply({
            content: "Product With That Code Doesnt Exist",
            ephemeral: true
        });

        let solve = await discount
            .findOne({ code: code })
            .then((res) => {
                return res;
            })
            .catch(console.error);

        if (!solve) return interaction.reply({
            content: `Not have discount from code **${code}**`,
            ephemeral: true
        });

        await discount
            .deleteOne({ code: code })
            .then(async (d) => {
                await interaction.reply({
                    content: `Discount Removed From Code **${code}**`,
                    ephemeral: true
                });
            })
            .catch(console.error);
    }
}