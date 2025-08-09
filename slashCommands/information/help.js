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
let { Owner, Admin } = require("../../config/config.json");
let { Warning, ARROW, COLOR, CROWN, imageUrl } = require("../../config/configEmoji.json");
module.exports = {
    name: 'help',
    description: "help commands",
    accessableby: "everyone",
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        try {
            let publicCmds = [];
            let adminCmds = [];

            client.slash.forEach((command) => {
                let cmdString = `**/${command.name}**\n${ARROW} ${command.description}`;
                let cmdStrings = `**/${command.name}**\n${ARROW} ${command.description}`;
                if (command.accessableby === "everyone") {
                    publicCmds.push(cmdString);
                } else if (command.accessableby === "admin") {
                    adminCmds.push(cmdStrings);
                }
            });

            let publicCmdList = publicCmds.join("\n");
            let adminCmdList = adminCmds.join("\n");
            let text;

            if (!interaction.user.bot && !Admin.includes(interaction.user.id) && interaction.user.id !== Owner ) {
                text = 
                    publicCmdList +
                    `\n\n${Warning} **HOW TO BUY** ${Warning}\n` +
                    `- Click Button **Set GrowID**\n` +
                    `- Make Sure Click Button **Balance** To Check Your GrowID\n` +
                    `- Click Button **Deposit** To See World Deposit\n` +
                    `- Click Button **Buy** For Buying The Items`;
            } else {
                text =
                    adminCmdList +
                    "\n" +
                    publicCmdList;
            }

            let help = new EmbedBuilder()
                .setTitle(`${CROWN} **Available Slash Commands** ${CROWN}`)
                .setDescription(text)
                .setColor(COLOR)
                .setImage(imageUrl);

            await interaction.reply({
                embeds: [ help ],
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
        }
    }
}