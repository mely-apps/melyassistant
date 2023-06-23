// Declare constants which will be used throughout the bot.

const fs = require('fs')
const {
    Client,
    Collection,
    GatewayIntentBits,
    REST,
    Routes,
} = require('discord.js')
const { token, client_id, test_guild_id } = require('./config.json')
const { QuickDB } = require('quick.db')
const db = new QuickDB()

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.MessageContent,
]

const client = new Client({
    intents: [intents],
    ws: { intents: intents },
    disableMentions: 'everyone',
    // allowedMentions: {
    // 	repliedUser: false,
    // },
})

/**********************************************************************/
// Below we will be making an event handler!

/**
 * @description All event files of the event handler.
 * @type {String[]}
 */

const eventFiles = fs
    .readdirSync('./events')
    .filter((file) => file.endsWith('.js'))

// Loop through all files and execute the event when it is actually emmited.
for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if (event.skip) continue
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client))
    } else {
        client.on(
            event.name,
            async (...args) => await event.execute(...args, client)
        )
    }
}

/**********************************************************************/
// Define Collection of Commands, Slash Commands and cooldowns

client.commands = new Collection()
client.slashCommands = new Collection()
client.buttonCommands = new Collection()
client.selectCommands = new Collection()
client.contextCommands = new Collection()
client.modalCommands = new Collection()
client.cooldowns = new Collection()
client.db = db
require('./modules/util/client')(client)

// Requires Manager from discord-giveaways
const { GiveawaysManager } = require('discord-giveaways')
const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
    // This function is called when the manager needs to get all giveaways which are stored in the database.
    async getAllGiveaways() {
        // Get all giveaways from the database
        return await db.get('giveaways')
    }

    // This function is called when a giveaway needs to be saved in the database.
    async saveGiveaway(messageId, giveawayData) {
        // Add the new giveaway to the database
        await db.push('giveaways', giveawayData)
        // Don't forget to return something!
        return true
    }

    // This function is called when a giveaway needs to be edited in the database.
    async editGiveaway(messageId, giveawayData) {
        // Get all giveaways from the database
        const giveaways = await db.get('giveaways')
        // Remove the unedited giveaway from the array
        const newGiveawaysArray = giveaways.filter(
            (giveaway) => giveaway.messageId !== messageId
        )
        // Push the edited giveaway into the array
        newGiveawaysArray.push(giveawayData)
        // Save the updated array
        await db.set('giveaways', newGiveawaysArray)
        // Don't forget to return something!
        return true
    }

    // This function is called when a giveaway needs to be deleted from the database.
    async deleteGiveaway(messageId) {
        // Get all giveaways from the database
        const giveaways = await db.get('giveaways')
        // Remove the giveaway from the array
        const newGiveawaysArray = giveaways.filter(
            (giveaway) => giveaway.messageId !== messageId
        )
        // Save the updated array
        await db.set('giveaways', newGiveawaysArray)
        // Don't forget to return something!
        return true
    }
}
const manager = new GiveawayManagerWithOwnDatabase(client, {
    storage: './giveaways.json',
    default: {
        botsCanWin: false,
        embedColor: '#FF0000',
        embedColorEnd: '#000000',
        reaction: '🎉',
    },
})
// We now have a giveawaysManager property to access the manager everywhere!
client.giveawaysManager = manager

/**********************************************************************/
// Registration of Message-Based Commands

/**
 * @type {String[]}
 * @description All command categories aka folders.
 */

const commandFolders = fs.readdirSync('./commands')

// Loop through all files and store commands in commands collection.

for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith('.js'))
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`)
        client.commands.set(command.name, command)
    }
}

/**********************************************************************/
// Registration of Slash-Command Interactions.

/**
 * @type {String[]}
 * @description All slash commands.
 */

const slashCommands = fs.readdirSync('./interactions/slash')

// Loop through all files and store slash-commands in slashCommands collection.

for (const module of slashCommands) {
    const commandFiles = fs
        .readdirSync(`./interactions/slash/${module}`)
        .filter((file) => file.endsWith('.js'))

    for (const commandFile of commandFiles) {
        const command = require(`./interactions/slash/${module}/${commandFile}`)
        client.slashCommands.set(command.data.name, command)
    }
}

/**********************************************************************/
// Registration of Context-Menu Interactions

/**
 * @type {String[]}
 * @description All Context Menu commands.
 */

const contextMenus = fs.readdirSync('./interactions/context-menus')

// Loop through all files and store slash-commands in slashCommands collection.

for (const folder of contextMenus) {
    const files = fs
        .readdirSync(`./interactions/context-menus/${folder}`)
        .filter((file) => file.endsWith('.js'))
    for (const file of files) {
        const menu = require(`./interactions/context-menus/${folder}/${file}`)
        const keyName = `${folder.toUpperCase()} ${menu.data.name}`
        client.contextCommands.set(keyName, menu)
    }
}

/**********************************************************************/
// Registration of Button-Command Interactions.

/**
 * @type {String[]}
 * @description All button commands.
 */

const buttonCommands = fs.readdirSync('./interactions/buttons')

// Loop through all files and store button-commands in buttonCommands collection.

for (const module of buttonCommands) {
    const commandFiles = fs
        .readdirSync(`./interactions/buttons/${module}`)
        .filter((file) => file.endsWith('.js'))

    for (const commandFile of commandFiles) {
        const command = require(`./interactions/buttons/${module}/${commandFile}`)
        client.buttonCommands.set(command.id, command)
    }
}

/**********************************************************************/
// Registration of select-menus Interactions

/**
 * @type {String[]}
 * @description All Select Menu commands.
 */

const selectMenus = fs.readdirSync('./interactions/select-menus')

// Loop through all files and store select-menus in slashCommands collection.

for (const module of selectMenus) {
    const commandFiles = fs
        .readdirSync(`./interactions/select-menus/${module}`)
        .filter((file) => file.endsWith('.js'))
    for (const commandFile of commandFiles) {
        const command = require(`./interactions/select-menus/${module}/${commandFile}`)
        client.selectCommands.set(command.id, command)
    }
}

/**********************************************************************/
// Registration of Modal-Command Interactions.

/**
 * @type {String[]}
 * @description All modal commands.
 */

const modalCommands = fs.readdirSync('./interactions/modals')

// Loop through all files and store modal-commands in modalCommands collection.

for (const module of modalCommands) {
    const commandFiles = fs
        .readdirSync(`./interactions/modals/${module}`)
        .filter((file) => file.endsWith('.js'))

    for (const commandFile of commandFiles) {
        const command = require(`./interactions/modals/${module}/${commandFile}`)
        client.modalCommands.set(command.id, command)
    }
}

/**********************************************************************/
// Registration of Slash-Commands in Discord API

const rest = new REST({ version: '9' }).setToken(token)

const commandJsonData = [
    ...Array.from(client.slashCommands.values()).map((c) => c.data.toJSON()),
    ...Array.from(client.contextCommands.values()).map((c) => c.data),
]

;(async () => {
    try {
        if (!Array.isArray(await db.get('giveaways'))) db.set('giveaways', [])

        console.log('Started refreshing application (/) commands.')

        await rest.put(
            /**
			 * Here we are sending to discord our slash commands to be registered.
					There are 2 types of commands, guild commands and global commands.
					Guild commands are for specific guilds and global ones are for all.
					In development, you should use guild commands as guild commands update
					instantly, whereas global commands take upto 1 hour to be published. To
					deploy commands globally, replace the line below with:
				Routes.applicationCommands(client_id)
			 */

            Routes.applicationGuildCommands(client_id, test_guild_id),
            { body: commandJsonData }
        )

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
})()

// Login into your client application with bot's token.

client.login(token)
