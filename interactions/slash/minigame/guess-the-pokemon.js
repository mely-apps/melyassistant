const { SlashCommandBuilder } = require(`discord.js`)
const { GuessThePokemon } = require('discord-gamecord')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`guess-the-pokemon`)
        .setDescription(`Play a game of Guess the Pokemon!`),
    async execute(interaction) {
        const game = new GuessThePokemon({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: `Who's The Pokemon`,
                color: '#2f3136',
            },
            timeoutTime: 60000,
            winMessage: '🎉 | You guessed it right! It was a {pokemon}.',
            loseMessage: '> Better luck next time! It was a {pokemon}.',
            errMessage: 'Unable to fetch pokemon data! Please try again.',
            timeoutMessage: '> The game went unfinished.',
            playerOnlyMessage: 'Only {player} can use these buttons.',
        })

        try {
            await game.startGame()
        } catch (err) {
            console.log(err)
            await interaction.reply('There was an error starting the game!')
        }
    },
}
