let {
    EmbedBuilder,
    Client,
    CommandInteraction,
    ApplicationCommandOptionType,
} = require("discord.js");
let list = require("../../Schema/list.js");
let Price = require("../../Schema/price.js");
let { Owner } = require("../../config/config.json");
let { Loading, Benar, Salah, WL } = require("../../config/configEmoji.json");
module.exports = {
    name: 'setprice',
    description: "Set Price For Product",
    accessableby: "admin",
    options: [
        {
            name: "code",
            description: "Code Of Product",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "price",
            description: "Howmany Price To Add In Product?",
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
        let price = interaction.options.getString("price");
        let prices = parseFloat(price);
        let user = await client.users.fetch(Owner);
        let getCode = await list
            .findOne({ code: code })
            .then((res) => {
                return res;
            })
            .catch(console.error);

        if (!getCode) return interaction.reply({
            content: "Code Not Found",
            ephemeral: true
        });

        if (!isNaN(price)) {
            await Price.findOneAndUpdate(
                { code: code },
                { price: prices },
                { upsert: true, new: true }
            )
                .then(async (res) => {
                    await interaction.reply({
                        content: `Successffully Set **${code}** Price With Price **${prices}** ${WL}`,
                        ephemeral: true
                    });
                    let sendToOwner = new EmbedBuilder()
                        .setTitle("Price History")
                        .setDescription(`- Code: **${code}**\n- New Price: ${prices} ${WL}`)
                        .setTimestamp();
                    user.send({ embeds: [sendToOwner] });
                })
                .catch(console.error);
        }
    }
}