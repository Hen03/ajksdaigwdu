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
let shop = require("../../Schema/shop.js");
let path = require("path");
let request = require("request");
let { Loading, Benar, Salah } = require("../../config/configEmoji.json");
module.exports = {
    name: 'addstock',
    description: "add Stock For Stock",
    accessableby: "admin",
    options: [
        {
            name: "code",
            description: "What Code For Add Stock?",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "item",
            description: "Write Data",
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: "file",
            description: "Upload Your file",
            type: ApplicationCommandOptionType.Attachment,
            required: false
        }
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        let itemo = interaction.options.getString("item");
        let filo = interaction.options.getAttachment("file");
        let code = interaction.options.getString("code");
        let getCode = await list
            .findOne({ code: interaction.options.getString("code") })
            .then((d) => {
                return d;
            })
            .catch(console.error);

        let typo = await list
            .findOne({ code: code })
            .then((d) => {
                return d?.type
            })
            .catch(console.error);

        if (!getCode) return interaction.reply({
            content: `Wrong Code`,
            ephemeral: true
        });

        if (filo && itemo) return interaction.reply({
            content: `Pilih Salah Satu Options Saja!`,
            ephemeral: true
        });

        if (filo) {
            let getf = path.extname(filo.name);
            let sal = [".txt", ".lua", ".js"]

            if (!sal.includes(getf)) return interaction.reply({
                content: `**Error!!!\nYour File Is: ${getf}\nOnly file .txt or .lua or .js Can add For It!** ${Salah}`,
                ephemeral: true
            });
        }

        await interaction.reply({
            content: `**Proccessing Your Data Into Database** ${Loading}`,
            ephemeral: true
        });

        try {
            if (filo || itemo) {
                if (filo) {
                    let filos = interaction.options.getAttachment("file");
                    if (typo.includes("script") || typo.includes("df")) {
                        request(filos.url, async (err, res, body) => {
                            if (err) return console.error(err);
                            let script = body;
                            let items = body.split("|");
                            if (typo.includes("df")) {
                                for (let item of items) {
                                    await new shop({
                                        code: code,
                                        data: `================================\n${item}`,
                                    })
                                        .save()
                                        .then((d) => {
                                            console.log(`[COMMANDS]`.bgMagenta.bold, `Adding Your Data: \n${item}`.green.bold);
                                        })
                                        .catch(console.error);
                                }

                                await interaction.followUp({
                                    content: `**Successfully Added Item For Dirtfarm Into Database ${Benar}**`,
                                    ephemeral: true
                                });
                            } else if (typo.includes("script")) {
                                await new shop({
                                    code: code,
                                    data: script,
                                })
                                    .save()
                                    .then((d) => {
                                        console.log(`[COMMANDS]`.bgMagenta.bold, `Adding Your Data: \n${script}`.green.bold);
                                    })
                                    .catch(console.error);

                                await interaction.followUp({
                                    content: `**Successfully Added Script Into Database ${Benar}**`,
                                    ephemeral: true
                                });
                            }
                        });
                    } else {
                        request(filos.url, async (err, res, body) => {
                            if (err) return console.error(err);
                            let items = body.split(/[\n\r\s]+/);
                            if (items.length == 0) return interaction.followUp({ content: `No Item In This File!`, ephemeral: true })
                            for (let item of items) {
                                await new shop({
                                    code: code,
                                    data: item,
                                })
                                    .save()
                                    .then((d) => {
                                        console.log(d);
                                    })
                                    .catch(console.error);
                            }
                            await interaction.followUp({
                                content: `**Write File Succesffully And Added Into the database! ${Benar}**`,
                                ephemeral: true
                            });
                        });
                    }
                } else {
                    let items = interaction.options.getString("item").split(/\s+/);
                    let itema = interaction.options.getString("item").split("|");
                    let itemi = interaction.options.getString("item");
                    if (typo.includes("script") || typo.includes("df")) {
                        if (typo.includes("df")) {
                            itema.forEach(async (item) => {
                                await new shop({
                                    code: code,
                                    data: item,
                                })
                                    .save()
                                    .then((d) => {
                                        console.log(`[COMMANDS]`.bgMagenta.bold, `Adding Your Data: \n${item}`.green.bold);
                                    })
                                    .catch(console.error);
                            });
                            await interaction.followUp({
                                content: `**Successfully Added Item For Dirtfarm Into Database ${Benar}**`,
                                ephemeral: true
                            });
                        } else if (typo.includes("script")) {
                            await new shop({
                                code: code,
                                data: itemi,
                            })
                                .save()
                                .then((d) => {
                                    console.log(`[COMMANDS]`.bgMagenta.bold, `Adding Your Data: \n${itemi}`.green.bold);
                                })
                                .catch(console.error);

                            await interaction.followUp({
                                content: `**Successfully Added Script Into Database ${Benar}**`,
                                ephemeral: true
                            });
                        }
                    } else {
                        items.forEach(async (item) => {
                            await new shop({
                                code: code,
                                data: item,
                            })
                                .save()
                                .then((d) => {
                                    console.log(`[COMMANDS]`.bgMagenta.bold, `Adding Your Data: ${item}`.green.bold);
                                })
                                .catch(console.error);
                        });
                        await interaction.followUp({
                            content: `**The All Item Has Been Added Into Database ${Benar}**`,
                            ephemeral: true
                        });
                        console.log(`[COMMANDS]`.bgMagenta.bold, `Successfully Adding Stock`.bgBlue.bold);
                    }
                }
            } else {
                interaction.followUp({
                    content: "**Error!!!\nNot Have Item Or File In Your Send!** " + Salah,
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error(error);
            interaction.followUp({
                content: `Ada Yang Salah!`,
                ephemeral: true
            });
        }
    }
}