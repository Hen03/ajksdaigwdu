let client = require('../../index.js');
let {
    ActivityType,
    ButtonStyle,
    ActionRowBuilder,
    EmbedBuilder,
    MessageEmbed,
    ButtonBuilder,
} = require("discord.js");
let shop = require("../../Schema/shop.js");
let channelo = require("../../Schema/AllSettingChannel.js");
let mt = require("../../Schema/mt.js");
let order = require("../../Schema/order.js");
let Price = require("../../Schema/price.js");
let list = require("../../Schema/list.js");
let { Benar, ARROW, Salah, Megaphone, WL, CROWN, Watermark, BOT, imageUrl, COLOR } = require("../../config/configEmoji.json");
const Discount = require('../../Schema/discount.js');

module.exports = {
    name: "ready"
};

client.once("ready", async (client) => {
    try {
        let activities = [`type /help To See How To Buy`, `Auto Store Script By Claudiva Store`], i = 0;
        let chanel = await channelo
            .findOne({})
            .then((d) => {
                return d;
            })
            .catch(console.error());

        let checkdelay = chanel?.Delay ? chanel?.Delay : "60";
        setInterval(async () => {
            client.user.setPresence({
                activities: [{ name: `${activities[i++ % activities.length]}`, type: ActivityType.Custom }],
                status: "dnd",
            });

            let MT = await mt
                .findOne({})
                .then((d) => {
                    return d?.mt;
                })
                .catch(console.error);

            let orderan = await order
                .findOne({})
                .then((d) => {
                    return d?.Order;
                })
                .catch((e) => console.error(e));

            let getCodes = await list
                .find({})
                .then((res) => {
                    return res;
                })
                .catch(console.error);
            if (getCodes.length < 1) return;
            let polas = new Date();
            let format = `<t:${Math.floor(polas.getTime() / 1000)}:R>`;
            let text = "";
            let sold = "";
            let solding = 0;
            for (let i = 0; i < getCodes.length; i++) {
                let code = getCodes[i];
                let stock = await shop
                    .find({ code: code.code })
                    .then((res) => {
                        return res;
                    })
                    .catch(console.error);
                let price = await Price.findOne({ code: code.code })
                    .then((res) => {
                        return res;
                    })
                    .catch(console.error);
                let discount = await Discount.findOne({ code: code.code })
                    .then((res) => {
                        return res;
                    })
                    .catch(console.error);
                let haveStock = stock.length > 0;
                let emojis = haveStock ? Benar : Salah;
                let stockMessage = haveStock ? `${stock.length}` : "";
                sold += `${ARROW} ${code.name} : **${code.sold}**\n`;
                solding += Number(code.sold);
                text += `**--------------------------------------------**\n` +
                    `${CROWN} **${code.name}** ${CROWN}\n` +
                    `${ARROW} Code: **${code.code}**\n` +
                    `${code?.desc != "Not Set" ? `${ARROW} Description: **${code?.desc}**\n` : ""}` +
                    `${ARROW} Stock: **${stockMessage} ${emojis}**\n` +
                    `${ARROW} Price: **${discount ? `${price ? `~~${new Intl.NumberFormat().format(price.price)}~~ ${new Intl.NumberFormat().format(discount.price)}` : "Not Set Yet"}` : `${price ? new Intl.NumberFormat().format(price.price) : "Not Set Yet"}`} ${WL}**\n`;
            }

            let embed = new EmbedBuilder()
                .setTitle(`${Megaphone} PRODUCT LIST ${Megaphone}`)
                .setDescription(`**Last Update: ${format}**\n${text}`)
                .setColor(COLOR)
                .setImage(imageUrl);

            let embed1 = new EmbedBuilder()
                .setTitle(`${CROWN} Statistic Stock ${CROWN}`)
                .setDescription(`${ARROW} Total Order : **${orderan}**\n${ARROW} Total Purchase : **${solding}**\n**Purchases Product:**\n${sold}`)
                .setColor(COLOR)
                .setImage(imageUrl);

            let row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Buy")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<:emoji_72:1210797404731740181>")
                    .setCustomId("Howmanys"),
                new ButtonBuilder()
                    .setLabel("Set GrowID")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<a:book431:1248246276022206485>")
                    .setCustomId("growid23"),
                new ButtonBuilder()
                    .setLabel("QRIS Deposit")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<:qriss:1247160354874851400>")
                    .setCustomId("qris2"),
                new ButtonBuilder()
                    .setLabel("Balance")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<a:faq:1174339877333119068>")
                    .setCustomId("balance1"),
                new ButtonBuilder()
                    .setLabel("Deposit World")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<a:world:1174338186189733899>")
                    .setCustomId("deposit")
            );

            let rowmt = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Buy Product")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<:emoji_72:1210797404731740181>")
                    .setDisabled(true)
                    .setCustomId("Howmanys"),
                new ButtonBuilder()
                    .setLabel("Set GrowID")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<a:book431:1248246276022206485>")
                    .setDisabled(true)
                    .setCustomId("growid23"),
                new ButtonBuilder()
                    .setLabel("QRIS Deposit")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<:qriss:1247160354874851400>")
                    .setDisabled(true)
                    .setCustomId("qris2"),
                new ButtonBuilder()
                    .setLabel("Balance")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<a:faq:1174339877333119068>")
                    .setDisabled(true)
                    .setCustomId("balance1"),
                new ButtonBuilder()
                    .setLabel("Deposit World")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<a:world:1174338186189733899>")
                    .setDisabled(true)
                    .setCustomId("deposit")
            );

            let rowqris = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Buy Product")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<:emoji_72:1210797404731740181>")
                    .setDisabled(false)
                    .setCustomId("Howmanys"),
                new ButtonBuilder()
                    .setLabel("Set GrowID")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<a:book431:1248246276022206485>")
                    .setDisabled(false)
                    .setCustomId("growid23"),
                new ButtonBuilder()
                    .setLabel("QRIS Deposit")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<:qriss:1247160354874851400>")
                    .setDisabled(true)
                    .setCustomId("qris2"),
                new ButtonBuilder()
                    .setLabel("Balance")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<a:faq:1174339877333119068>")
                    .setDisabled(false)
                    .setCustomId("balance1"),
                new ButtonBuilder()
                    .setLabel("Deposit World")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<a:world:1174338186189733899>")
                    .setDisabled(false)
                    .setCustomId("deposit")
            );

            let chanelas = await channelo
                .findOne({})
                .then((d) => {
                    return d;
                })
                .catch(console.error);

            if (chanel?.ChannelStock) {
                let channel = await client.channels.fetch(chanelas?.ChannelStock);
                let messageid = await channel.messages.fetch(chanelas?.MessageID);
                if (MT?.mt) {
                    await messageid.edit({
                        content: `**${Watermark}**`,
                        embeds: [embed1, embed],
                        components: [rowmt]
                    });
                } else {
                    if (MT?.qris) {
                        await messageid.edit({
                            content: `**${Watermark}**`,
                            embeds: [embed1, embed],
                            components: [rowqris]
                        });
                    } else {
                        await messageid.edit({
                            content: `**${Watermark}**`,
                            embeds: [embed1, embed],
                            components: [row]
                        });
                    }
                }
            }
        }, checkdelay * 1000);
        console.log("----------------------------------------".yellow);
        console.log(`[READY]`.bgGreen.bold, `${client.user.tag} is up and ready to go.`.cyan.bold);
        console.log("----------------------------------------".yellow);
    } catch (err) {
        console.error(err);
    }
})