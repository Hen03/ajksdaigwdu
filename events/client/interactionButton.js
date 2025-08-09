let {
    InteractionType,
    ButtonStyle,
    ActionRowBuilder,
    EmbedBuilder,
    MessageEmbed,
    ButtonBuilder,
} = require("discord.js");
let client = require('../../index');
let { CROWN, BALANCE, BOT, EARTH, Coin, WL, Warning, COLOR, imageUrl, DL, EmojiSaweria, EmojiTrakteer } = require("../../config/configEmoji.json");
let Bal = require("../../Schema/balance.js");
let depo = require("../../Schema/depo.js");
let cd = new Map();

module.exports = {
    name: "ButtonMessage"
};

client.on("interactionCreate", async (interaction) => {
    if (interaction.customId === "balance1") {
        try {
            console.log(`[SYSTEM]`.bgRed.bold, `${interaction.user.username}`.bgCyan.bold, `Using Button Balance`.bgMagenta.bold);
            let user = interaction.user.id;
            let row6000 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Set GrowID")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(BOT)
                    .setCustomId("growid23")
            );

            let lcd = cd.get(interaction.user.id);
            if (lcd && Date.now() < lcd) {
                let rt = Math.ceil((lcd - Date.now()) / 1000);
                return interaction.reply({
                    content: `Just Wait **${rt} Seconds** Before Using The Button Again!`,
                    ephemeral: true
                });
            }

            cd.set(interaction.user.id, Date.now() + 5000)

            let wallet1 = await Bal.findOne({ DiscordID: user })
                .then((d) => {
                    return d;
                })
                .catch((e) => console.error(e));

            if (!wallet1) return interaction.reply({
                content: "Set GrowID First Before Use This Button!",
                components: [row6000],
                ephemeral: true,
            });

            let convert = parseFloat(wallet1.Balance).toFixed(1);

            let embed = new EmbedBuilder()
                .setTitle(`${CROWN} Balance Information ${CROWN}`)
                .setDescription(
                    `- [${BOT}] GrowID: **${wallet1.GrowIDNow}**\n` +
                    `- [${Coin}] Balance: **${convert} ${WL}**\n` +
                    `- [${BALANCE}] Total Deposit: **${wallet1.Deposit} ${WL}**`
                )
                .setTimestamp()
                .setColor(COLOR)
                .setImage(imageUrl)
                .setFooter({
                    text: `This Is Your Balance ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                });

            await interaction
                .reply({ embeds: [embed], ephemeral: true })
                .catch(console.error);
        } catch (error) {
            console.log(error);
        }
    }

    if (interaction.customId === "deposit") {
        try {
            console.log(`[SYSTEM]`.bgRed.bold, `${interaction.user.username}`.bgCyan.bold, `Using Button Deposit`.bgYellow.bold);
            let user = interaction.user.id;
            let row6000 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Set GrowID")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(BOT)
                    .setCustomId("growid23")
            );

            let lcd = cd.get(interaction.user.id);
            if (lcd && Date.now() < lcd) {
                let rt = Math.ceil((lcd - Date.now()) / 1000);
                return interaction.reply({
                    content: `Just Wait **${rt} Seconds** Before Using The Button Again!`,
                    ephemeral: true
                });
            }

            cd.set(interaction.user.id, Date.now() + 5000)

            let wallet1 = await Bal.findOne({ DiscordID: user })
                .then((d) => {
                    return d;
                })
                .catch((e) => console.error(e));

            if (!wallet1) return interaction.reply({
                content: "Set GrowID First Before Use This Button!",
                components: [row6000],
                ephemeral: true,
            });

            let deposit = await depo
                .findOne({})
                .then((d) => {
                    return d;
                })
                .catch((e) => console.error(e));

            if (!deposit) return interaction.reply({
                content: "Owner Do Not Set Deposit World Right Now!",
                ephemeral: true
            });

            if (!deposit?.ratedl) return interaction.reply({
                content: "Tag Owner To Use Commands /ratedl",
                ephemeral: true
            });

            let total = parseFloat(deposit.ratedl) * 100;

            let embed = new EmbedBuilder()
                .setTitle(`${CROWN} Deposit World ${CROWN}`)
                .setDescription(`- [${EARTH}] World: **${deposit?.world ? deposit.world : "Not Set Yet"}**\n- [${CROWN}] Owner: **${deposit?.owner ? deposit.owner : "Not Set Yet"}**\n- [${BOT}] Bot Name: **${deposit?.botName ? deposit.botName : "Not Set Yet"}**${deposit?.saweria != "Not Set" ? `\n- [${EmojiSaweria}] Saweria Link: **${deposit.saweria}**` : ""}${deposit?.Trakteer != "Not Set" ? `\n- [${EmojiTrakteer}] Trakteer Link: **${deposit.Trakteer}**` : ""}${deposit?.ratedl && deposit?.saweria != "Not Set" || deposit?.Trakteer != "Not Set" ? `\n- [${DL}] Rate DL: **${new Intl.NumberFormat().format(total)}**` : ""}`)
                .setTimestamp()
                .setImage(imageUrl)
                .setColor(COLOR)
                .setFooter({
                    text: `Note: Don't Donate If Bot Isnt The World`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                });

            await interaction
                .reply({ embeds: [embed], ephemeral: true })
                .catch(console.error);
        } catch (error) {
            console.log(error);
        }
    }
    
    if (interaction.customId === "growid1") {
        if (interaction.type !== InteractionType.ModalSubmit) return;
        try {
            let id = interaction.fields.getTextInputValue("growid");
            let correct = interaction.fields.getTextInputValue("confirm");

            let GrowID = id.toLowerCase();
            let user = interaction.user.id;

            if (!correct.includes(id)) return interaction.reply({
                content: `Can You Correctly Ser?`,
                ephemeral: true
            });

            let checkuser = await Bal
                .findOne({ DiscordID: user })
                .then((d) => {
                    return d;
                })
                .catch(console.error);

            let existingEntry = await Bal.findOne({ GrowID: GrowID })
                .then((d) => {
                    return d?.DiscordID;
                })
                .catch((e) => console.error(e));

            if (existingEntry && existingEntry !== user) return interaction.reply({
                content: `GrowID Is Already Used!!`,
                ephemeral: true
            });

            if (existingEntry) {
                if (checkuser.GrowID == GrowID) return interaction.reply({
                    embeds: [{
                        description: `**GrowID Already Used By You!**`
                    }],
                    ephemeral: true
                });
            }

            await Bal.findOneAndUpdate(
                { DiscordID: user },
                { $set: { GrowID: GrowID, GrowIDNow: id } },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            )

            if (!checkuser) {
                await interaction.reply({
                    embeds: [{
                        description: `Successfully Set Your GrowID to **${id}**`
                    }],
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    embeds: [{
                        description: `Successfully Updated Your GrowID **${checkuser.GrowIDNow}** to **${id}**`
                    }],
                    ephemeral: true,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
})