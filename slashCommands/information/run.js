let {
    ActivityType,
    ButtonStyle,
    ActionRowBuilder,
    EmbedBuilder,
    MessageEmbed,
    ApplicationCommandOptionType,
    ButtonBuilder,
} = require("discord.js");
let shop = require("../../Schema/shop.js");
let channelo = require("../../Schema/AllSettingChannel.js");
let mt = require("../../Schema/mt.js");
let Price = require("../../Schema/price.js");
let order = require("../../Schema/order.js");
let list = require("../../Schema/list.js");
let { Warning, Benar, ARROW, Salah, Megaphone, WL, Dolar, CROWN, EARTH, BOT, BALANCE, imageUrl, COLOR } = require("../../config/configEmoji.json");
module.exports = {
    name: 'run',
    description: "sending realtime product",
    accessableby: "admin",
    options: [
        {
            name: "channel",
            description: "Select Your Server To Send Realtime!",
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: "delay",
            description: "Delay For Seconds/Detik",
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
        let delay = interaction.options.getNumber("delay");
        let channel = interaction.options.getChannel("channel");
        let ChanelID = interaction.guild.channels.cache.get(`${channel.id}`);

        if (!ChanelID.viewable) {
            return interaction.reply({
                content: "The provided channel is not visible to me",
                ephemeral: true
            })
        }

        if (delay < 30 || delay > 120) return interaction.reply({
            content: "Minimum Delay For Realtime Is 30 Seconds And Max Delay 120 Seconds/2 Minutes",
            ephemeral: true
        });

        let chanel = await channelo
            .findOne({})
            .then((d) => {
                return d?.ChannelStock;
            })
            .catch(console.error());

        let getCodesa = await list
            .find({})
            .then((res) => {
                return res;
            })
            .catch(console.error);

        if (getCodesa.length < 1) return interaction.reply({
            content: `**/addproduct first before use this commands!**`,
            ephemeral: true
        });

        await interaction.reply({
            content: `Started Editing The Realtime Stock Delay **${delay}s**`,
            ephemeral: true
        });

        let sat = await channel.send({
            content: `Started Editing The Realtime Stock Delay **${delay}s**`
        });

        await channelo.findOneAndUpdate(
            {},
            { $set: { ChannelStock: ChanelID, MessageID: sat.id, Delay: delay } },
            { upsert: true, new: true }
        );

        try {
            if (!chanel) {
                setInterval(async () => {
                    let MT = await mt
                        .findOne({})
                        .then((d) => {
                            return d?.mt;
                        })
                        .catch(console.error);

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
                        let haveStock = stock.length > 0;
                        let emojis = haveStock ? Benar : Salah;
                        let stockMessage = haveStock ? `${stock.length}` : "";
                        text += `**--------------------------------------------**\n` +
                            `${CROWN} **${code.name}** ${CROWN}\n` +
                            `${ARROW} Code: **${code.code}**\n` +
                            `${ARROW} Stock: **${stockMessage} ${emojis}**\n` +
                            `${ARROW} Price: **${price ? new Intl.NumberFormat().format(price.price) : "Not Set Yet"} ${WL}**\n`;
                    }

                    let embed = new EmbedBuilder()
                        .setTitle(`${Megaphone} PRODUCT LIST ${Megaphone}`)
                        .setDescription(`**Last Update: ${format}**\n${text}`)
                        .setColor(COLOR)
                        .setImage(imageUrl);

                    let row2 = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel("Buy Product")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:emoji_72:1210797404731740181>")
                            .setCustomId("Howmanys"),
                        new ButtonBuilder()
                            .setLabel("Set GrowID")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:emoji_67:1210613521306484796>")
                            .setCustomId("growid23"),
                        new ButtonBuilder()
                            .setLabel("QRIS Deposit")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:qriss:1247160354874851400>")
                            .setCustomId("qris2"),
                        new ButtonBuilder()
                            .setLabel("Check Your Information")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:emoji_74:1211225072963158098>")
                            .setCustomId("balance1"),
                        new ButtonBuilder()
                            .setLabel("Deposit World")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:emoji_75:1211233540386332732>")
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
                            .setEmoji("<:emoji_67:1210613521306484796>")
                            .setDisabled(true)
                            .setCustomId("growid23"),
                        new ButtonBuilder()
                            .setLabel("QRIS Deposit")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:qriss:1247160354874851400>")
                            .setDisabled(true)
                            .setCustomId("qris2"),
                        new ButtonBuilder()
                            .setLabel("Check Your Information")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:emoji_74:1211225072963158098>")
                            .setDisabled(true)
                            .setCustomId("balance1"),
                        new ButtonBuilder()
                            .setLabel("Deposit World")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:emoji_75:1211233540386332732>")
                            .setDisabled(true)
                            .setCustomId("deposit")
                    );

                    if (MT) {
                        await sat.edit({
                            content: `**Auto Store V5.0 By ClaudivaStore**`,
                            embeds: [embed],
                            components: [rowmt]
                        });
                    } else {
                        await sat.edit({
                            content: `**Auto Store V5.0 By ClaudivaStore**`,
                            embeds: [embed],
                            components: [row2]
                        });
                    }
                }, delay * 1000);
            }
        } catch (err) {
            console.error(err);
        }
    }
}