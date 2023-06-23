const { Events } = require('discord.js')

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction) {
        // Deconstructed client from interaction object.
        const { client } = interaction

        // Checks if the interaction is a command (to prevent weird bugs)

        if (!interaction.isCommand()) return
        /**
         * @description The Interaction command object
         * @type {Object}
         */

        const command = client.slashCommands.get(interaction.commandName)

        // If the interaction is not a command in cache.

        if (!command) return

        if (command.modules && command.modules.length > 0) {
            const moduleTable = client.db.table('module')
            const enabledModules = (await moduleTable.all())
                .filter((e) => e.value === true)
                .map((e) => e.id)

            if (!command.modules.some((e) => enabledModules.includes(e)))
                return interaction.reply({
                    content: 'You cant use it by now!',
                    ephemeral: true,
                })
        }

        // A try to executes the interaction.

        try {
            await command.execute(interaction, client)
        } catch (err) {
            console.error(err)
            try {
                await interaction.reply({
                    content: 'There was an issue while executing that command!',
                    ephemeral: true,
                })
            } catch (error) {}
        }
    },
}
