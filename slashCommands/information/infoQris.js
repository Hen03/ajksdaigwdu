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
    IntegrationApplication,
} = require("discord.js");
let crypto = require('crypto');
let { keyapi, merchpaydis, servpaydis, batas_time, fee_cus, fee_owner } = require("../../config/configQris.json");
let axios = require('axios');
let { CROWN, Dolar, BALANCE, BOT, EARTH, Saweria, Trakteer, WL, ARROW, Warning, COLOR, imageUrl, Benar, DL, Loading, Salah } = require("../../config/configEmoji.json");
module.exports = {
    name: 'qris',
    description: "sending informasi server",
    accessableby: "admin",
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        let message = await interaction.reply({
            content: `**Processing Get Information In Your Account...**`,
            ephemeral: true
        });
        try {
            let third = 'Profile';
            let hash = crypto.createHash('md5')
                .update(keyapi + third)
                .digest('hex');

            var config = {
                method: 'POST',  // Set the HTTP method to POST
                url: 'https://paydisini.co.id/api/',  // Set the target URL
                data: new URLSearchParams(Object.entries({
                    key: keyapi,
                    request: 'profile',
                    signature: hash,
                })),
            };

            await axios(config)
                .then(async function (response) {
                    if (response.data.success == true) {
                        let embed = new EmbedBuilder()
                            .setTitle(`${CROWN} Information Account PAYDISINI ${CROWN}`)
                            .setDescription(`${ARROW} Status Paydisini: **Connected ${Benar}**\n${ARROW} User Server: **${response.data.data.full_name}**\n${ARROW} Your Saldo: **Rp ${new Intl.NumberFormat().format(response.data.data.saldo)}**\n${ARROW} Hold Saldo: **Rp ${new Intl.NumberFormat().format(response.data.data.saldo_tertahan)}**\n${ARROW} No Telpon: **${response.data.data.telephone}**\n${ARROW} Email: **${response.data.data.email}**`)
                            .setColor(COLOR);

                        if (message) {
                            await message.edit({
                                embeds: [embed],
                                content: `**Successffully To Get Information In Your Account!**`,
                                ephemeral: true
                            });
                        }
                    } else if (response.data.success == false) {
                        let embed = new EmbedBuilder()
                            .setTitle(`${CROWN} Information Account PAYDISINI ${CROWN}`)
                            .setDescription(`${ARROW} Status Paydisini: **Terputus ${Salah}**\n${ARROW} Message: **${response.data.msg}**`)
                            .setColor(COLOR);

                        if (message) {
                            await message.edit({
                                embeds: [embed],
                                content: `**Successffully To Get Information In Your Account!**`,
                                ephemeral: true
                            });
                        }
                    }
                })
        } catch (error) {
            if (message) {
                await message.edit({
                    content: `**Cannot Access To Website https://paydisini.co.id**`,
                    ephemeral: true
                });
            }
            console.error('Error Access The Website:', error);
        }
    }
}