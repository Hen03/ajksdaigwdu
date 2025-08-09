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
    InteractionType,
    MessageEmbed,
} = require("discord.js");
let client = require('../../index');
let depos = require("../../Schema/depo.js");
let { keyapi, merchpaydis, servpaydis, fee_owner, ChannelQrisLog } = require("../../config/configQris.json");
let { CROWN, WL, ARROW, COLOR, imageUrl, Benar, Loading, Salah } = require("../../config/configEmoji.json");
let qris = require("../../Schema/qrisPayment.js");
let Bal = require("../../Schema/balance.js");
let crypto = require('crypto');
let sharp = require("sharp");
let fs = require("fs");
let axios = require('axios');
let { userInfo } = require("os");

module.exports = {
    name: "ButtonMessage"
};

client.on("interactionCreate", async (interaction) => {
    function GenerateCodeUnik() {
        let character = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        let result = ""
        let characterlengeth = character.length;

        for (let i = 0; i < 32; i++) {
            let randomString = Math.floor(Math.random() * characterlengeth);
            result += character[randomString];
        }
        return result
    }
    let koderefe = GenerateCodeUnik();

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let get_status_paydisini = async (koddep) => {
        let user = interaction.user.id;
        let checkqris = await qris.findOne({ DiscordID: user })
            .then((d) => {
                return d;
            })
            .catch(console.error);

        let wallet = await Bal.findOne({ DiscordID: user })
            .then((d) => {
                return d;
            })
            .catch(console.error);

        if (!wallet) return interaction.reply({
            content: `Do you already not have growid in my database!`,
            ephemeral: true
        });

        let jumlah = checkqris.Jumlah;
        let Jumlahdl = checkqris.JumlahDL;
        let messageid = checkqris.MessageID;
        let dm = await interaction.user.createDM();
        let editmessage = await dm.messages.fetch(messageid);
        let qrislog = await client.channels.fetch(ChannelQrisLog);

        let third = 'StatusTransaction';
        let hash = crypto.createHash('md5')
            .update(keyapi + koddep + third)
            .digest('hex');

        var config = {
            method: 'POST',  // Set the HTTP method to POST
            url: 'https://paydisini.co.id/api/',  // Set the target URL
            data: new URLSearchParams(Object.entries({
                key: keyapi,
                request: 'status',
                unique_code: koddep,
                signature: hash,
            })),
        };

        axios(config).then(async (res) => {
            let status = res.data.data.status;
            while (status !== 'Success') {
                await sleep(1000);
                let response = await axios(config);
                if (response.data.data.status == "Success") {
                    await Bal.updateOne({ DiscordID: user }, { $inc: { Balance: Jumlahdl, Deposit: Jumlahdl } });
                    let wallet1 = await Bal.findOne({ DiscordID: user })
                        .then((d) => {
                            return d;
                        })
                        .catch(console.error);

                    let embed = new EmbedBuilder()
                        .setTitle(`${CROWN} Qris Payment Information ${CROWN}`)
                        .setDescription(`${ARROW} Payment ID: **${response.data.data.unique_code}**\n${ARROW} Nominal: **Rp ${new Intl.NumberFormat().format(jumlah)}**\n${ARROW} Fee Admin: **Rp ${new Intl.NumberFormat().format(checkqris.FeeAdmin)}**\n${ARROW} Total Payment: **Rp ${new Intl.NumberFormat().format(response.data.data.amount)}**\n${ARROW} Status Payment: **${response.data.data.status} ${Benar}**\n${ARROW} Current Balance: **${wallet.Balance} ${WL}**\n${ARROW} New Balance: **${wallet1.Balance} ${WL}**\n${ARROW} Expired: **${response.data.data.expired}**`)
                        .setColor(COLOR);

                    if (editmessage) {
                        await editmessage.edit({
                            embeds: [embed],
                            components: [],
                            files: []
                        });
                    }

                    let checkqrisi = await qris.findOne({ DiscordID: user })
                        .then((d) => {
                            return d;
                        })
                        .catch(console.error);

                    let embed1 = new EmbedBuilder()
                        .setTitle(`${CROWN} Qris Payment Information ${CROWN}`)
                        .setDescription(`${ARROW} Discord: **<@${checkqrisi.DiscordID}>**\n${ARROW} Payment ID: **${response.data.data.unique_code}**\n${ARROW} Nominal: **Rp ${new Intl.NumberFormat().format(jumlah)}**\n${ARROW} Status Payment: **${response.data.data.status} ${Benar}**\n${ARROW} Current Balance: **${wallet.Balance} ${WL}**\n${ARROW} New Balance: **${wallet1.Balance} ${WL}**\n${ARROW} Expired: **${response.data.data.expired}**`)
                        .setImage(imageUrl)
                        .setColor(COLOR);

                    if (qrislog) {
                        await qrislog.send({
                            embeds: [embed1]
                        });
                    }

                    if (checkqrisi) {
                        await qris
                            .deleteOne({ DiscordID: user })
                            .then(async (d) => {
                                console.log(d);
                            })
                            .catch(console.error);
                    }
                    break;
                }
                if (response.data.data.status == "Canceled") {
                    let checkqrisi = await qris.findOne({ DiscordID: user })
                        .then((d) => {
                            return d;
                        })
                        .catch(console.error);

                    let embed = new EmbedBuilder()
                        .setTitle(`${CROWN} Qris Payment Information ${CROWN}`)
                        .setDescription(`${ARROW} Payment ID: **${response.data.data.unique_code}**\n${ARROW} Nominal: **Rp ${new Intl.NumberFormat().format(jumlah)}**\n${ARROW} Fee Admin: **Rp ${new Intl.NumberFormat().format(checkqris.FeeAdmin)}**\n${ARROW} Total Payment: **Rp ${new Intl.NumberFormat().format(response.data.data.amount)}**\n${ARROW} Status Payment: **Expired/Canceled ${Salah}**\n${ARROW} The amount of World Lock: **${checkqris.JumlahDL} ${WL}**\n${ARROW} Expired: **${response.data.data.expired}**`)
                        .setColor(COLOR);

                    if (editmessage) {
                        await editmessage.edit({
                            embeds: [embed],
                            components: [],
                            files: []
                        });
                    }

                    let embed1 = new EmbedBuilder()
                        .setTitle(`${CROWN} Qris Payment Information ${CROWN}`)
                        .setDescription(`${ARROW} Discord: **<@${checkqris.DiscordID}>**\n${ARROW} Payment ID: **${response.data.data.unique_code}**\n${ARROW} Nominal: **Rp ${new Intl.NumberFormat().format(jumlah)}**\n${ARROW} Status Payment: **Expired/Canceled ${Salah}**\n${ARROW} The amount of World Lock: **${checkqris.JumlahDL} ${WL}**\n${ARROW} Expired: **${response.data.data.expired}**`)
                        .setImage(imageUrl)
                        .setColor(COLOR);

                    if (qrislog) {
                        await qrislog.send({
                            embeds: [embed1]
                        });
                    }

                    if (checkqrisi) {
                        await qris
                            .deleteOne({ DiscordID: user })
                            .then(async (d) => {
                                console.log(d);
                            })
                            .catch(console.error);
                    }
                    break;
                }
            }
        });
    }

    if (interaction.customId === "qris") {
        if (interaction.type !== InteractionType.ModalSubmit) return;
        try {
            let jumlahnya = interaction.fields.getTextInputValue("jumlah");

            if (isNaN(jumlahnya)) return interaction.reply({
                content: "**Only Use Number For Amount!**",
                ephemeral: true
            });

            let reff_deposi = koderefe;
            let feenya = parseFloat(fee_owner);
            let jumlah = parseFloat(jumlahnya);
            if (jumlah < 100) return interaction.reply({
                content: `Minimum Deposit With Qris Is **Rp 100**`,
                ephemeral: true
            });

            if (jumlah > 1000000) return interaction.reply({
                content: `Maximum Deposit With Qris Is **Rp 1,000,000**`,
                ephemeral: true
            });

            let depok = await depos
                .findOne({})
                .then((res) => {
                    return res?.ratedl;
                })
                .catch(console.error());

            let totals = Math.floor(jumlah / depok);
            let depositnya = jumlah + feenya;
            let times = "300";
            let batas_time = parseFloat(times);

            let row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Check Status")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("📥")
                    .setDisabled(true)
                    .setCustomId("checkstatus"),
                new ButtonBuilder()
                    .setLabel("Cancle Payment")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("✖️")
                    .setCustomId("cancelpayment")
            );

            try {
                let creating = await interaction.reply({
                    content: `**Proccessing Generate Qris Payment...**`,
                    ephemeral: true
                });
                
                let third = 'NewTransaction';
                let hash = crypto.createHash('md5')
                    .update(keyapi + reff_deposi + servpaydis + depositnya + batas_time + third)
                    .digest('hex');

                var config = {
                    method: 'POST',  // Set the HTTP method to POST
                    url: 'https://paydisini.co.id/api/',  // Set the target URL
                    data: new URLSearchParams(Object.entries({
                        key: keyapi,
                        request: 'new',
                        merchant_id: merchpaydis,
                        unique_code: reff_deposi,
                        service: servpaydis,
                        amount: depositnya,
                        note: 'Deposit Qris Bot Discord',
                        valid_time: batas_time,
                        ewallet_phone: '',
                        customer_email: '',
                        type_fee: '2',
                        payment_guide: '',
                        callback_count: '',
                        return_url: '',
                        signature: hash,
                    })),
                };

                await axios(config)
                    .then(async function (response) {
                        try {
                            if (response.data.success == false) {
                                let embed = new EmbedBuilder()
                                    .setTitle(`${CROWN} Qris Payment Information ${CROWN}`)
                                    .setDescription(`${ARROW} Status Creating Image: **GAGAL** ${Salah}\n${ARROW} Message: **${response.data.msg}**`)
                                    .setColor(COLOR);

                                await creating.edit({
                                    embeds: [embed],
                                    ephemeral: true
                                });
                                return;
                            };

                            let koddep = response.data.data.unique_code;
                            let url = response.data.data.qrcode_url;
                            let status = response.data.data.status;
                            let date = response.data.data.expired;
                            let user = interaction.user;
                            let respons = await fetch(url);
                            let ContentType = respons.headers.get("content-type");

                            if (ContentType && ContentType.startsWith("image/")) {
                                let Arraybuffer = await respons.arrayBuffer();
                                let buffer = Buffer.from(Arraybuffer);
                                let image = sharp(buffer);
                                let resize = await image
                                    .resize({
                                        width: 1113,
                                        height: 1113,
                                        fit: sharp.fit.inside,
                                    })
                                    .withMetadata()
                                    .negate()
                                    .toFormat('png', { quality: 100 })
                                    .toBuffer();

                                let attachment = new AttachmentBuilder(resize, { name: "image.png" });
                                if (response.data.success == true) {
                                    let embed = new EmbedBuilder()
                                        .setTitle(`${CROWN} Qris Payment Information ${CROWN}`)
                                        .setDescription(`${ARROW} Payment ID: **${response.data.data.unique_code}**\n${ARROW} Nominal: **Rp ${new Intl.NumberFormat().format(jumlah)}**\n${ARROW} Fee Admin: **Rp ${new Intl.NumberFormat().format(feenya)}**\n${ARROW} Total Payment: **Rp ${new Intl.NumberFormat().format(response.data.data.amount)}**\n${ARROW} Status Payment: **${response.data.data.status} ${Loading}**\n${ARROW} The amount of World Lock: **${totals} ${WL}**\n${ARROW} Expired Time: **${response.data.data.expired}**\n\n**Please Complete The QRIS Payment Using The QR Code Below!**`)
                                        .setColor(COLOR)
                                        .setImage(`attachment://${attachment.name}`);

                                    let message = await user.send({
                                        embeds: [embed],
                                        components: [row],
                                        files: [attachment]
                                    });

                                    await new qris({
                                        KodeUnik: koddep,
                                        DiscordID: user.id,
                                        StatusPayment: status,
                                        Jumlah: jumlah,
                                        JumlahDL: totals,
                                        Expired: date,
                                        MessageID: message.id,
                                        FeeAdmin: feenya,
                                    })
                                        .save()
                                        .then(async (d) => {
                                            console.log(d);
                                        })
                                        .catch((e) => console.error(e));

                                    if (creating) {
                                        await creating
                                            .edit({
                                                content: `**Check Your Direct Message For Payments!!**`,
                                                ephemeral: true
                                            })
                                            .then(async (moba) => {
                                                setTimeout(async () => {
                                                    try {
                                                        await creating.delete();
                                                    } catch (error) {
                                                        console.error("Failed To Deleted Message!")
                                                    }
                                                }, 5000);
                                            })
                                            .catch(console.error());
                                    }

                                    get_status_paydisini(koddep);
                                }
                            }
                        } catch (error) {
                            console.error(error);
                            await creating
                                .edit({
                                    content: `**Failed to get image from QRIS!**`,
                                    ephemeral: true
                                })
                                .then(async (m) => {
                                    setTimeout(async () => {
                                        if (m) {
                                            await creating.delete();
                                        }
                                    }, 5000);
                                })
                                .catch(console.error());
                        }
                    });
            } catch (error) {
                await creating.edit({
                    content: `**Cannot Access To Website https://paydisini.co.id**`,
                    ephemeral: true
                });
                console.error(error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    /*if (interaction.customId === "checkstatus") {
        try {
            let user = interaction.user.id;
            let checkqris = await qris.findOne({ DiscordID: user })
                .then((d) => {
                    return d;
                })
                .catch(console.error);

            let wallet = await Bal.findOne({ DiscordID: user })
                .then((d) => {
                    return d;
                })
                .catch(console.error);

            if (!wallet) return interaction.reply({
                content: `**Do you already not have growid in my database!**`,
                ephemeral: true
            });

            if (!checkqris?.KodeUnik) return interaction.reply({
                content: `**Do you transaction already done!**`,
                ephemeral: true
            });

            let kodedep = checkqris.KodeUnik;
            let jumlah = parseFloat(checkqris.Jumlah);
            let Jumlahdl = parseFloat(checkqris.JumlahDL);
            let qrislog = await client.channels.fetch(ChannelQrisLog);

            let third = 'StatusTransaction';
            let hash = crypto.createHash('md5')
                .update(keyapi + kodedep + third)
                .digest('hex');

            var config = {
                method: 'POST',  // Set the HTTP method to POST
                url: 'https://paydisini.co.id/api/',  // Set the target URL
                data: new URLSearchParams(Object.entries({
                    key: keyapi,
                    request: 'status',
                    unique_code: kodedep,
                    signature: hash,
                })),
            };

            axios(config)
                .then(async (response) => {
                    let status = response.data.data.status;
                    if (status == "Pending") {
                        let bal = parseFloat(wallet.Balance);
                        let totalis = bal + Jumlahdl;
                        let embed = new EmbedBuilder()
                            .setTitle(`${CROWN} Qris Payment Information ${CROWN}`)
                            .setDescription(`${ARROW} Payment ID: **${kodedep}**\n${ARROW} Status Payment: **${status} ${Loading}**\n${ARROW} Current Balance: **${wallet.Balance} ${WL}**\n${ARROW} New Balance: **${totalis} ${WL}**`)
                            .setColor(COLOR);

                        await interaction
                            .reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                            .then(async (m) => {
                                setTimeout(async () => {
                                    if (m) {
                                        await m.delete();
                                    }
                                }, 5000);
                            })
                            .catch(console.error());
                    } else if (status == "Success") {
                        await Bal.updateOne({ DiscordID: user }, { $inc: { Balance: Jumlahdl, Deposit: Jumlahdl } });
                        let wallet1 = await Bal.findOne({ DiscordID: user })
                            .then((d) => {
                                return d;
                            })
                            .catch(console.error);

                        let embed = new EmbedBuilder()
                            .setTitle(`${CROWN} Qris Payment Information ${CROWN}`)
                            .setDescription(`${ARROW} Payment ID: **${response.data.data.unique_code}**\n${ARROW} Nominal: **Rp ${new Intl.NumberFormat().format(jumlah)}**\n${ARROW} Fee Admin: **Rp ${new Intl.NumberFormat().format(checkqris.FeeAdmin)}**\n${ARROW} Total Payment: **Rp ${new Intl.NumberFormat().format(response.data.data.amount)}**\n${ARROW} Status Payment: **${response.data.data.status} ${Benar}**\n${ARROW} Current Balance: **${wallet.Balance} ${WL}**\n${ARROW} New Balance: **${wallet1.Balance} ${WL}**\n${ARROW} Expired Time: **${response.data.data.expired}**`)
                            .setColor(COLOR);

                        await interaction.update({
                            embeds: [embed],
                            components: [],
                            files: []
                        });

                        let checkqrisi = await qris.findOne({ DiscordID: user })
                            .then((d) => {
                                return d;
                            })
                            .catch(console.error);

                        let embed1 = new EmbedBuilder()
                            .setTitle(`${CROWN} Qris Payment Information ${CROWN}`)
                            .setDescription(`${ARROW} Discord: **<@${checkqrisi.DiscordID}>**\n${ARROW} Payment ID: **${response.data.data.unique_code}**\n${ARROW} Nominal: **Rp ${new Intl.NumberFormat().format(jumlah)}**\n${ARROW} Status Payment: **${response.data.data.status} ${Benar}**\n${ARROW} Current Balance: **${wallet.Balance} ${WL}**\n${ARROW} New Balance: **${wallet1.Balance} ${WL}**\n${ARROW} Expired: **${response.data.data.expired}**`)
                            .setImage(imageUrl)
                            .setColor(COLOR);

                        if (qrislog) {
                            await qrislog.send({
                                embeds: [embed1]
                            });
                        }

                        if (checkqrisi) {
                            await qris
                                .deleteOne({ DiscordID: user })
                                .then(async (d) => {
                                    console.log(d);
                                })
                                .catch(console.error);
                        }
                    } else if (status == "Canceled") {
                        let embed = new EmbedBuilder()
                            .setTitle(`${CROWN} Qris Payment Information ${CROWN}`)
                            .setDescription(`${ARROW} Payment ID: **${response.data.data.unique_code}**\n${ARROW} Nominal: **Rp ${new Intl.NumberFormat().format(jumlah)}**\n${ARROW} Fee Admin: **Rp ${new Intl.NumberFormat().format(checkqris.FeeAdmin)}**\n${ARROW} Total Payment: **Rp ${new Intl.NumberFormat().format(response.data.data.amount)}**\n${ARROW} Status Payment: **Expired ${Salah}**\n${ARROW} The amount of World Lock: **${checkqris.JumlahDL} ${WL}**\n${ARROW} Expired Time: **${response.data.data.expired}**`)
                            .setColor(COLOR);

                        await interaction.update({
                            embeds: [embed],
                            components: [],
                            files: []
                        });

                        let checkqrisi = await qris.findOne({ DiscordID: user })
                            .then((d) => {
                                return d;
                            })
                            .catch(console.error);

                        let embed1 = new EmbedBuilder()
                            .setTitle(`${CROWN} Qris Payment Information ${CROWN}`)
                            .setDescription(`${ARROW} Discord: **<@${checkqris.DiscordID}>**\n${ARROW} Payment ID: **${response.data.data.unique_code}**\n${ARROW} Nominal: **Rp ${new Intl.NumberFormat().format(jumlah)}**\n${ARROW} Status Payment: **Expired ${Salah}**\n${ARROW} The amount of World Lock: **${checkqrisi.JumlahDL} ${WL}**\n${ARROW} Expired: **${response.data.data.expired}**`)
                            .setImage(imageUrl)
                            .setColor(COLOR);

                        if (qrislog) {
                            await qrislog.send({
                                embeds: [embed1]
                            });
                        }

                        if (checkqrisi) {
                            await qris
                                .deleteOne({ DiscordID: user })
                                .then(async (d) => {
                                    console.log(d);
                                })
                                .catch(console.error);
                        }
                    }
                });
        } catch (error) {
            console.log(error);
        }
    }*/

    if (interaction.customId === "cancelpayment") {
        try {
            let user = interaction.user.id;
            let checkqris = await qris.findOne({ DiscordID: user })
                .then((d) => {
                    return d;
                })
                .catch(console.error);

            if (!checkqris) return interaction.reply({
                content: `Do you not have transaction right now!`,
                ephemeral: true
            });

            let koddep = checkqris.KodeUnik;
            let third = 'CancelTransaction';
            let hash = crypto.createHash('md5')
                .update(keyapi + koddep + third)
                .digest('hex');

            var config = {
                method: 'POST',  // Set the HTTP method to POST
                url: 'https://paydisini.co.id/api/',  // Set the target URL
                data: new URLSearchParams(Object.entries({
                    key: keyapi,
                    request: 'cancel',
                    unique_code: koddep,
                    signature: hash,
                })),
            };

            axios(config).then(async (response) => {
                if (response.data.success == true) {
                    let fee = parseFloat(checkqris.FeeAdmin);
                    let totals = parseFloat(checkqris.Jumlah);
                    let nominal = totals - fee;

                    let embed = new EmbedBuilder()
                        .setTitle(`${CROWN} Qris Payment Information ${CROWN}`)
                        .setDescription(`${ARROW} Payment ID: **${checkqris.KodeUnik}**\n${ARROW} Nominal: **Rp ${new Intl.NumberFormat().format(nominal)}**\n${ARROW} Fee Admin: **Rp ${new Intl.NumberFormat().format(fee)}**\n${ARROW} Total Payment: **Rp ${new Intl.NumberFormat().format(totals)}**\n${ARROW} Status Payment: **Expired/Canceled ${Salah}**\n${ARROW} The amount of World Lock: **${checkqris.JumlahDL} ${WL}**\n${ARROW} Expired Time: **${checkqris.Expired}**`)
                        .setColor(COLOR);

                    await interaction.update({
                        embeds: [embed],
                        components: [],
                        files: []
                    });
                } else if (response.data.success == false) {
                    await interaction.reply({
                        content: `**Failed To Canceled Your Transaction\nMessage: ${response.data.msg}**`,
                        ephemeral: true
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
})