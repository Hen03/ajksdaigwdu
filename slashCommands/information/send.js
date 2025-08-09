let {
    EmbedBuilder,
    Client,
    CommandInteraction,
    ApplicationCommandOptionType,
} = require("discord.js");
let { Owner, serverId } = require("../../config/config.json");
let { Warning, WL, ARROW, Loading, Benar, imageUrl, COLOR, Salah } = require("../../config/configEmoji.json");
let shop = require("../../Schema/shop.js");
let list = require("../../Schema/list.js");
let Price = require("../../Schema/price.js");
let order = require("../../Schema/order.js");
let { MessageEmbed } = require("discord.js");
let ctesti = require("../../Schema/AllSettingChannel.js");

module.exports = {
    name: 'send',
    description: "sending item product",
    accessableby: "admin",
    options: [
        {
            name: "user",
            description: "Tag User Do You Want To Send Product!",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "code",
            description: "Code Of Product",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "amount",
            description: "Howmuch Do You Want To Sell?",
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
        let item = interaction.options.getString("code");
        let howmuch = interaction.options.getNumber("amount");
        let usertosend = interaction.options.getUser("user");
        let usertosender = usertosend.id;
        let user = interaction.user;
        let userars = await client.users.fetch(Owner);
        let usertosends = await client.users.fetch(usertosender);
        let member = interaction.guild.members.cache.get(usertosender);

        let chaneltesti = await ctesti
            .findOne({})
            .then((d) => {
                return d.ChanelTesti;
            })
            .catch((e) => console.error(e));

        if (!chaneltesti) return interaction.reply({
            content: "Channel Testimoni Not Set Now!!!!",
            ephemeral: true
        });

        let testis = interaction.guild.channels.cache.get(chaneltesti);

        let getCode = await list
            .findOne({ code: item })
            .then((res) => {
                return res;
            })
            .catch(console.error);

        if (!getCode) return interaction.reply({
            content: "Code Not Found",
            ephemeral: true
        });

        if (howmuch < 1) return interaction.reply({
            content: "Use a Valid Number!",
            ephemeral: true
        });

        let data = await shop
            .find({ code: item })
            .then((res) => {
                return res;
            })
            .catch(console.error);

        if (data.length == 0) return interaction.reply({
            content: "No Stock Yet",
            ephemeral: true
        });

        if (Number(data.length) < Number(howmuch)) return interaction.reply({
            content: "Not That Much Stock",
            ephemeral: true
        });

        let orderN = await order
            .findOneAndUpdate(
                {},
                { $inc: { Order: 1 } },
                { upsert: true, new: true }
            )
            .then((d) => {
                return d?.Order;
            })
            .catch(console.error);

        if (!orderN) orderN = 1;

        let sending = "";
        await interaction.reply({
            content: `**Proccessing To Send Product Your Costumers ${Loading}**`,
            ephemeral: true,
        });
        if (!getCode.type.includes("script")) {
            for (let i = 0; i < howmuch; i++) {
                let send = await shop
                    .findOneAndDelete({ code: item })
                    .then((res) => {
                        return res;
                    })
                    .catch(console.error);
                sending += send.data + "\n";
            }
        } else {
            let send = await shop
                .findOne({ code: item })
                .then((res) => {
                    return res;
                })
                .catch(console.error);
            sending += send.data;
        }
        try {
            if (!member.roles.cache.some((r) => r.id == getCode.role)) {
                member.roles.add(getCode.role);
            }

            usertosends.send({
                content: `This Is ${usertosend} Order\n# NO REPS NO WARRANTY`,
                files: [
                    {
                        attachment: Buffer.from(sending),
                        name: `${usertosend.username} Order.txt`,
                    },
                ],
            }).catch(async (err) => {
                await interaction.followUp({
                    content: `**Im Cannot Send Your Items In a Direct Message!! ${Salah}**\n*Please dm Owner to get your product!*`,
                    ephemeral: true
                });

                userars.send({
                    content: `**This Order Have Problem To Send For Your Buyer!**\n*Your Only Send This Product For User ${interaction.user}*`,
                    files: [
                        {
                            attachment: Buffer.from(sending),
                            name: `${interaction.user.username} Order.txt`,
                        },
                    ],
                });
            });

            userars.send({
                content: `This Is <@${usertosender}> Order`,
                files: [
                    {
                        attachment: Buffer.from(sending),
                        name: `${usertosend.username} Order.txt`,
                    },
                ],
            });

            await interaction.followUp({
                content: `**Successffully Send The Product To User ${usertosend} ${Benar}**`,
                ephemeral: true
            });

            let testi = new EmbedBuilder()
                .setTitle("#Order Number: " + orderN)
                .setDescription(`${ARROW} Sender: **<@${user.id}>**\n${ARROW} Buyer: **<@${usertosender}>**\n${ARROW} Product: **${getCode?.name}**\n${ARROW} Jumlah: **${howmuch}**\n\n**Thanks You For Purchasing Our Product** ${Benar}`)
                .setColor(COLOR)
                .setTimestamp()
                .setImage(imageUrl);

            await testis.send({ embeds: [testi] });
        } catch (erorr) {
            await interaction.followUp({
                content: "ADA ERROR!",
                ephemeral: true
            });

            userars.send({
                content: "This Is <@" + usertosender + "> Order",
                files: [
                    {
                        attachment: Buffer.from(sending),
                        name: `${usertosend.username} Order.txt`,
                    },
                ],
            });
        }
    }
}