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
let client = require('../../index.js');
let { Owner } = require('../../config/config.json');
module.exports = {
    name: 'addproduct',
    description: "Add Product In Database",
    accessableby: "admin",
    options: [
        {
            name: "code",
            description: "Code of products",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "name",
            description: "Name of products",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "minimum",
            description: "Minimum buy of products",
            type: ApplicationCommandOptionType.Number,
            required: true
        },
        {
            name: "role",
            description: "Role Buyer For Costumers",
            type: ApplicationCommandOptionType.Role,
            required: true
        },
        {
            name: "type",
            description: "Choose 1 Options Above This!",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "For Sell CID/RDP/SHOCK5/VPN/ETC 💻",
                    value: "yes"
                },
                {
                    name: "For Sell Script Only 📜",
                    value: "script"
                },
                {
                    name: "For Sell DF Only 🌲",
                    value: "df"
                }
            ]
        },
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        let code = interaction.options.getString("code");
        let productName = interaction.options.getString("name");
        let minimum = interaction.options.getNumber("minimum");
        let typeName = interaction.options.getString("type");
        let Role = interaction.options.getRole("role");
        let userars = await client.users.fetch(Owner);

        let getCode = await list
            .findOne({ code: code })
            .then((res) => {
                return res;
            })
            .catch(console.error);

        if (getCode) return interaction.reply({
            content: `Code Has Been Used`,
            ephemeral: true
        });

        if (typeName) {
            if (typeName.includes("script") || typeName.includes("yes") || typeName.includes("df")) {
                await new list({
                    code: code,
                    name: productName,
                    minimum: minimum,
                    type: typeName,
                    role: Role.id,
                })
                .save()
                .then(async (d) => {
                    await interaction.reply({ content: `Product Was Added`, ephemeral: true });
                })
                .catch((e) => console.error(e));

                let sendToOwner = new EmbedBuilder()
                    .setTitle("Adding Product History")
                    .setDescription(`- Code: **${code}**\n- Name: **${productName}**\n- Type: **${typeName}**\n- Role: **${Role.id}**`)
                    .setTimestamp();
                userars.send({ embeds: [sendToOwner] });
            } else {
                await interaction.reply({
                    content: `Choice 1 Options In Type`,
                    ephemeral: true
                });
            }
        }
    }
}