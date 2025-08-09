let { Owner } = require("../../config/config.json");
let {
    InteractionType,
    ButtonStyle,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    MessageEmbed,
} = require("discord.js");
let Bal = require("../../Schema/balance.js");
let shop = require("../../Schema/shop.js");
let discount = require("../../Schema/discount.js");
let list = require("../../Schema/list.js");
let Price = require("../../Schema/price.js");
let order = require("../../Schema/order.js");
let client = require('../../index.js');
let ctesti = require("../../Schema/AllSettingChannel.js");
let { Warning, Benar, WL, ARROW, Loading, COLOR, CROWN, Megaphone, Coin, BALANCE, imageUrl, BOT } = require("../../config/configEmoji.json");

module.exports = {
    name: "Buying Item Of Menu"
};

client.on("interactionCreate", async (interaction) => {
    if (interaction.customId === "buys") {
        try {
            if (interaction.type !== InteractionType.ModalSubmit) return;
            let howmuch = interaction.fields.getTextInputValue("jumlah");
            let item = interaction.fields.getTextInputValue("code");
            let user = interaction.user;
            let userars = await client.users.fetch(Owner);
            let member = interaction.guild.members.cache.get(user.id);

            let discon = await discount
                .findOne({ code: item })
                .then((res) => {
                    return res;
                })
                .catch(console.error);

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
                content: "Use a Positif Number!",
                ephemeral: true,
            });

            if (howmuch < Number(getCode.minimum)) return interaction.reply({
                content: `Minimum Order The Products Is **${getCode.minimum}**!`,
                ephemeral: true,
            });

            if (isNaN(howmuch)) return interaction.reply({
                content: "Only Use Number For Amount",
                ephemeral: true,
            });

            let row6050 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Set GrowID")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(BOT)
                    .setCustomId("growid23")
            );

            let getBal = await Bal.findOne({ DiscordID: user.id })
                .then((d) => {
                    return d;
                })
                .catch((e) => console.error(e));

            if (!getBal) return interaction.reply({
                content: "Register First Before Using This Button!",
                components: [row6050],
                ephemeral: true,
            });

            let pricao = await Price.findOne({ code: item })
                .then((d) => {
                    return d;
                })
                .catch((e) => console.error(e));

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

            if (!pricao) return interaction.reply({
                content: `Tag Owner To Set Price For **${item}**`,
                ephemeral: true
            });

            let chaneltesti = await ctesti
                .findOne({})
                .then((d) => {
                    return d.ChanelTesti;
                })
                .catch((e) => console.error(e));

            let price = pricao.price;
            let wallet = getBal.Balance;
            let oprice = Number(price) * Number(howmuch);
            let testimoni = interaction.guild.channels.cache.get(chaneltesti);

            if (!discon) {
                if (wallet < oprice) return interaction.reply({
                    content: `**Our Money Is Less, The Price Is ${oprice} ${WL}**`,
                    ephemeral: true,
                });

                await Bal.updateOne(
                    { DiscordID: user.id },
                    { $inc: { Balance: -Number(oprice) } }
                );
            } else {
                let loprice = Number(discon.price) * Number(howmuch);
                if (wallet < loprice) return interaction.reply({
                    content: `**Our Money Is Less, The Price Is ${loprice} ${WL}**`,
                    ephemeral: true
                });

                await Bal.updateOne(
                    { DiscordID: user.id },
                    { $inc: { Balance: -Number(loprice) } }
                );
            }

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

            await interaction.reply({
                content: `Processing Your Order ${Loading}`,
                ephemeral: true
            });

            let sending = "";
            try {
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
                if (!member.roles.cache.some((r) => r.id == getCode.role)) {
                    member.roles.add(getCode.role);
                }

                if (!discon) {
                    let testi = new EmbedBuilder()
                        .setTitle("#Order Number: " + orderN)
                        .setDescription(`${ARROW} Buyer: **<@${user.id}>**\n${ARROW} Product: **${howmuch} ${getCode?.name}**\n${ARROW} Total Price:** ${parseFloat(oprice).toFixed(1)} ${WL}**\n\n**Thanks For Purchasing Our Product** ${Benar}`)
                        .setColor(COLOR)
                        .setTimestamp()
                        .setImage(imageUrl);

                    await testimoni.send({ embeds: [testi] });
                } else {
                    let loprice = Number(discon.price) * Number(howmuch);
                    let testis = new EmbedBuilder()
                        .setTitle("#Order Number: " + orderN)
                        .setDescription(`${ARROW} Buyer: **<@${user.id}>**\n${ARROW} Product: **${howmuch} ${getCode?.name}**\n${ARROW} Total Price:** ~~${parseFloat(oprice).toFixed(1)}~~ ${parseFloat(loprice).toFixed(1)} ${WL}**\n\n**Thanks For Purchasing Our Product** ${Benar}`)
                        .setColor(COLOR)
                        .setTimestamp()
                        .setImage(imageUrl);

                    await testimoni.send({ embeds: [testis] });
                }

                await interaction.followUp({
                    content: `**This Is Your Order!**\n*For More You Can Check The DIRECT MESSAGE!*`,
                    files: [
                        {
                            attachment: Buffer.from(sending),
                            name: `${interaction.user.username} Order.txt`,
                        },
                    ],
                    ephemeral: true
                });

                user.send({
                    content: `**This Is Your Order!**\n# Order Number: ${orderN}`,
                    files: [
                        {
                            attachment: Buffer.from(sending),
                            name: `${interaction.user.username} Order.txt`,
                        },
                    ],
                }).catch(async (err) => {
                    await interaction.followUp({
                        content: `**Im Cannot Send Your Items In a Direct Message!!**\n*Please dm Owner to get your product!*`,
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
                    content: `This Is <@${interaction.user.id}> Order`,
                    files: [
                        {
                            attachment: Buffer.from(sending),
                            name: `${interaction.user.username} Order.txt`,
                        },
                    ],
                });

                await list.findOneAndUpdate(
                    { code: item },
                    { $inc: { sold: howmuch } },
                    { upsert: true, new: true }
                );

            } catch (erorr) {
                await interaction.followUp({
                    content: `**Im Cannot Send Your Items In a Direct Message!!**\n*Please dm Owner to get your product!*`,
                    ephemeral: true
                });

                userars.send({
                    content: `**This Order Have Problem To Send For Your Buyer!\nYour Only Send This Product For User ${interaction.user}**`,
                    files: [
                        {
                            attachment: Buffer.from(sending),
                            name: `${interaction.user.username} Order.txt`,
                        },
                    ],
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
})