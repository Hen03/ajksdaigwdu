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
let Price = require("../../Schema/price.js");
let shop = require("../../Schema/shop.js");
let { Owner } = require("../../config/config.json");
module.exports = {
    name: 'changecode',
    description: "Change Code Of Product",
    accessableby: "admin",
    options: [
        {
            name: "code",
            description: "Code Of Product",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "newcode",
            description: "New Code For Products",
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
        let productCode = interaction.options.getString("newcode");
        let getCode = await list
            .findOne({ code: code })
            .then((d) => {
                return d;
            })
            .catch(console.error);

        if (!getCode) return interaction.reply({
            content: "Product With That Code Doesn't Exist",
            ephemeral: true
        });
        
        await list
            .updateOne(
                {
                    code: code,
                },
                {
                    code: productCode,
                }
            )
            .catch(console.error);
        await Price
            .updateOne(
                {
                    code: code,
                },
                {
                    code: productCode,
                }
            )
            .catch(console.error);
        await shop
            .updateOne(
                {
                    code: code,
                },
                {
                    code: productCode,
                }
            )
            .catch(console.error);
        await interaction.reply({ content: `Code **${code}** Changed To **${productCode}**`, ephemeral: true });
    }
}