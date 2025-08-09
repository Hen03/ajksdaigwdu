let {
    ModalBuilder,
    TextInputBuilder,
    ActionRowBuilder,
    TextInputStyle,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} = require("discord.js");
let client = require('../../index');
let Bal = require("../../Schema/balance.js");
let { BOT } = require("../../config/configEmoji.json");
let ctesti = require("../../Schema/AllSettingChannel.js");
let depos = require("../../Schema/depo.js");
let qrisoo = require("../../Schema/qrisPayment.js");
let cd = new Map();

module.exports = {
    name: "Button Menu"
};

client.on("interactionCreate", async (interaction) => {
    try {
        let buy = new ModalBuilder()
            .setCustomId("buys")
            .setTitle("BUYING ITEM");

        let growid = new ModalBuilder()
            .setCustomId("growid1")
            .setTitle("SET GROWID");

        let code = new TextInputBuilder()
            .setCustomId("code")
            .setLabel("Code Of Products")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(10)
            .setMinLength(1)
            .setPlaceholder("Input Code Of Products Like You!")
            .setRequired(true);
        let row1 = new ActionRowBuilder().addComponents(code);

        let amount = new TextInputBuilder()
            .setCustomId("jumlah")
            .setLabel("Amount")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(4)
            .setMinLength(1)
            .setPlaceholder("Howmany do you want to buy?")
            .setValue("1")
            .setRequired(true);
        let row2 = new ActionRowBuilder().addComponents(amount);

        let getgrowid = new TextInputBuilder()
            .setCustomId("growid")
            .setLabel("Input Your GrowID:")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(50)
            .setMinLength(2)
            .setPlaceholder("Input Your GrowID In Here And Make Sure It's Correct")
            .setRequired(true);
        let row3 = new ActionRowBuilder().addComponents(getgrowid);

        let confirm = new TextInputBuilder()
            .setCustomId("confirm")
            .setLabel("Confirm Your GrowID:")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(50)
            .setMinLength(2)
            .setPlaceholder("Input Same Like Above!")
            .setRequired(true);
        let row4 = new ActionRowBuilder().addComponents(confirm);

        growid.addComponents(row4, row3);
        buy.addComponents(row1, row2);

        if (interaction.customId === "Howmanys") {
            try {
                console.log(`[SYSTEM]`.bgRed.bold, `${interaction.user.username}`.bgCyan.bold, `Using Button BUY`.bgBlue.bold);
                let getBal = await Bal.findOne({ DiscordID: interaction.user.id })
                    .then((d) => {
                        return d;
                    })
                    .catch((e) => console.error(e));

                let row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel("Set GrowID")
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(BOT)
                        .setCustomId("growid23")
                );

                if (!getBal) {
                    return interaction.reply({
                        content: "**Set Growid** First Before Using This Button!",
                        components: [row],
                        ephemeral: true
                    });
                }

                let chaneltesti = await ctesti
                    .findOne({})
                    .then((d) => {
                        return d.ChanelTesti;
                    })
                    .catch((e) => console.error(e));

                if (!chaneltesti) return interaction.reply({
                    content: "Tag Owner For Setting Channel Testimoni Now!!!!",
                    ephemeral: true
                });

                let lcd = cd.get(interaction.user.id);
                if (lcd && Date.now() < lcd) {
                    let rt = Math.ceil((lcd - Date.now()) / 1000);
                    return interaction.reply({
                        content: `Just Wait **${rt} Seconds** Before Using The Button Again!`,
                        ephemeral: true
                    });
                }

                cd.set(interaction.user.id, Date.now() + 10000)

                await interaction.showModal(buy);
            } catch (error) {
                console.log(error);
            }
        }

        if (interaction.customId === "growid23") {
            try {
                console.log(`[SYSTEM]`.bgRed.bold, `${interaction.user.username}`.bgCyan.bold, `Using Button Set GrowID`.bgYellow.bold);
                let lcd = cd.get(interaction.user.id);
                if (lcd && Date.now() < lcd) {
                    let rt = Math.ceil((lcd - Date.now()) / 1000);
                    return interaction.reply({
                        content: `Just Wait **${rt} Seconds** Before Using The Button Again!`,
                        ephemeral: true
                    });
                }

                cd.set(interaction.user.id, Date.now() + 10000)

                await interaction.showModal(growid);
            } catch (error) {
                console.log(error);
            }
        }

        if (interaction.customId === "qris2") {
            try {
                console.log(`[SYSTEM]`.bgRed.bold, `${interaction.user.username}`.bgCyan.bold, `Using Button QRIS Deposit`.bgYellow.bold);
                let user = interaction.user.id;
                let getBal = await Bal.findOne({ DiscordID: user })
                    .then((d) => {
                        return d;
                    })
                    .catch((e) => console.error(e));

                let row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel("Set GrowID")
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(BOT)
                        .setCustomId("growid23")
                );

                if (!getBal) {
                    return interaction.reply({
                        content: "**Set Growid** First Before Using This Button!",
                        components: [row],
                        ephemeral: true
                    });
                }

                let lcd = cd.get(interaction.user.id);
                if (lcd && Date.now() < lcd) {
                    let rt = Math.ceil((lcd - Date.now()) / 1000);
                    return interaction.reply({
                        content: `Just Wait **${rt} Seconds** Before Using The Button Again!`,
                        ephemeral: true
                    });
                }

                cd.set(interaction.user.id, Date.now() + 10000)

                let checkqrisi = await qrisoo.findOne({ DiscordID: user })
                    .then((d) => {
                        return d;
                    })
                    .catch(console.error);

                if (checkqrisi) return interaction.reply({
                    content: `**Do you already have transaction!!\nplease complete the payment first before using the button again!**`,
                    ephemeral: true
                });

                let depok = await depos
                    .findOne({})
                    .then((res) => {
                        return res?.ratedl;
                    })
                    .catch(console.error());

                if (!depok) return interaction.reply({
                    content: `Owner do not set rate dl right now!`,
                    ephemeral: true
                });

                let total = depok * 100;
                let qris = new ModalBuilder()
                    .setCustomId("qris")
                    .setTitle("QRIS Deposit");

                let jumlah = new TextInputBuilder()
                    .setCustomId("jumlah")
                    .setLabel(`DEPOSIT (QRIS) [RATE DL : Rp ${new Intl.NumberFormat().format(total)}]`)
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(7)
                    .setMinLength(3)
                    .setPlaceholder("100")
                    .setRequired(true);
                let row5 = new ActionRowBuilder().addComponents(jumlah);
                qris.addComponents(row5);

                await interaction.showModal(qris);
            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.error(error);
    }
})