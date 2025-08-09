let {
    Client,
    CommandInteraction,
} = require("discord.js");
let mt = require("../../Schema/mt.js")
module.exports = {
    name: 'setqris',
    description: "Set your QRIS Enable Dan Disable",
    accessableby: "admin",
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        await mt
            .findOne({})
            .then(async (d) => {
                if (d) {
                    d.qris = !d?.qris;
                    await d
                        .save()
                        .then(async (d1) => {
                            await interaction.reply({
                                content:`${d?.qris ? "*Qris Feature Has Been Disable*" : "*Qris Feature Has Been Enable*"}`,
                                ephemeral: true
                            });
                        })
                        .catch(console.error);
                } else {
                    await new mt({ qris: !d?.qris })
                        .save()
                        .then(async (d) => {
                            await interaction.reply({
                                content:`${d?.qris ? "*Qris Feature Has Been Disable*" : "*Qris Feature Has Been Enable"}`,
                                ephemeral: true
                            });
                        })
                        .catch(console.error);
                }
            })
            .catch(console.error);
    }
}