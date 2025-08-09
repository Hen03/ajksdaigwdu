let {
    EmbedBuilder,
    Client,
    CommandInteraction,
    ApplicationCommandOptionType,
} = require("discord.js");
let list = require("../../Schema/list.js");
let Price = require("../../Schema/price.js");
let discount = require("../../Schema/discount.js");
let { Owner } = require("../../config/config.json");
let { Loading, Benar, Salah, WL } = require("../../config/configEmoji.json");
module.exports = {
    name: 'setdiscount',
    description: "Set Discount For Product",
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
            description: "Howmany Price To Discount Into Product?",
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
        let price = interaction.options.getNumber("price");
        let prices = parseFloat(price);
        let user = await client.users.fetch(Owner);

        let solve = await Price
            .findOne({ code: code })
            .then((res) => {
                return res?.price;
            })
            .catch(console.error);

        let getCode = await list
            .findOne({ code: code })
            .then((res) => {
                return res;
            })
            .catch(console.error);

        if (isNaN(price)) return interaction.reply({
            content: `Only use number for price!!`,
            ephemeral: true
        });

        if (!getCode) return interaction.reply({
            content: "Code Not Found",
            ephemeral: true
        });

        if (!solve) return interaction.reply({
            content: `This code not set price right now!`,
            ephemeral: true
        });

        if (solve < prices) return interaction.reply({
            content: `The price of code is **${solve}** set to lower into price!!`,
            ephemeral: true
        });

        await discount.findOneAndUpdate(
            { code: code },
            { price: prices },
            { upsert: true, new: true }
        )
            .then(async (res) => {
                await interaction.reply({
                    content: `Successffully Adeded Discount to **${code}** With Price **${prices}** ${WL}`,
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