require('./commands.js');
const now   = new Date();
const cron  = require("cron");
const mysql = require('mysql');
const { Client, Intents } = require('discord.js');
const { token, host, user, password, database, port, meetingRoomId, meetingTextRoomId } = require('./config.json');

let step = null;
let ids_bots = [
    "368105370532577280",
    "159985870458322944",
    "432610292342587392",
    "468281173072805889",
    "571027211407196161",
    "887361046032023562",
    "943444812747669504",
    "862102568146567188",
    "1123517039022182440",
];
let con = mysql.createConnection({
    host: host,
    user: user,
    port: port,
    password: password,
    database: database
});

/**
 * Fonction pour faire le recap sur le serveur de meeting textuel
 * 
 * @param {Date} now 
 * 
 * @return {Void}
 */
function summary(now) {
    const date    = now.toISOString().slice(0, 10).replace('T', ' ');
    const channel = client.channels.cache.find(channel => channel.id === meetingTextRoomId);

    con.query(`SELECT * FROM response WHERE time LIKE '%${date}%'`, function (err, result, fields) {
        if (err) throw err;

        var message   = '';

        Object.values(result).forEach((element) => {
            console.log(element);

            message += `<@${element.id_user}> à déclarer : ${element.response_obj} ! \n`;
        });

        channel.send(`
            <@everyone> Oyez 📢 ! Oyez 📢 ! Voici le recap du meeting d'aujourd'hui : \n

            ${message}
        ` );
    });
}

/**
 * Direct message, gestion des étapes du daily meeting
 * 
 * @param {Message} msg
 * @param {null|String} invit
 * 
 * @return {Void}
 */
function tutor_step(msg, invit = null) {
    const search = `SELECT step FROM workers WHERE id_user= "${msg.author.id}"`

    con.query(search, (err, result) => {
        step = result[0].step;

        //* Step to check at what step the member is between phase 1 to 3
        switch (step) {
            case 1:
                msg.author.send(`C'est noté ! Et qu'as-tu prévu pour aujourd'hui ?`).catch((e) => console.error(`Erreur DM: ${msg.author.tag}`));
            break;

            case 2:
                msg.author.send(`Compris ! Tu peux te preparer pour le Scrum Meeting ! \n ${invit}`).catch((e) => console.error(`Erreur DM: ${msg.author.tag}`));
            break;

            case 3:
                step = 0;
            break;

            default:
            return;
        }

        const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');
        const sql       = `INSERT INTO response (id_user, name_user, response_obj, time, step) VALUES ("${msg.author.id}", "${msg.author.username}", "${msg.content}", "${timestamp}", "${step}")`;

        if (step !== 0) step++;

        const put_workers = `UPDATE workers SET step = "${step}" where id_user = "${msg.author.id}"`;

        try {
            if (step > 0) con.query(sql);

            con.query(put_workers);
        } catch (e) {
            console.log(e);
        }
    });
}

//* Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES, //* Flag DM
        Intents.FLAGS.GUILDS, //* Flag Guils
        Intents.FLAGS.GUILD_MEMBERS //* Flag Guild member's
    ],
    partials: [
        'CHANNEL', //* Required to DM
    ]
});

//* When the client is ready, run this code (only once)
client.once('ready', () => {
    //* Connection to database
    con.connect((err) => {
        if (err) throw err;
    });

    console.log('Dailymeet Bot ready ✔️ !');
});

//* Bot DM Interaction
client.on("messageCreate", async message => {
    const room   = await client.channels.fetch(meetingRoomId);
    const invite = await room.createInvite({ unique: true, maxAge: 300 });

    if (message.channel.type === 'DM' && !ids_bots.includes(message.author.id)) tutor_step(message, `https://discord.gg/${invite.code}`);
});

//* Bot Commands Interaction
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return; //* If not recognized as command

    const channel = client.channels.cache.find(channel => channel.id === meetingTextRoomId); //* Id channel "#général"
    const { commandName } = interaction;

    switch (commandName) {
        case 'meetup':
            interaction.reply(`<@${interaction.user.id}> Planifie un daily meeting !`);

            step  = 1;

            //! For test every minutes 00 * * * * * || 00 05 09 * * 1-5 for Monday - Friday 09h05
            let message = new cron.CronJob('00 * * * * *', () => { //* Format [Seconde: 0-59, Minutes: 0-59, Hours: 0-23, Day of Month: 1-31, Month: 0-11, Day of week: 0-6 (Sun-Sat)]
                channel.send(`Le Daily meeting commence à l'initiative de <@${interaction.user.id}>!`); //* Message in a specific channel that meetup is launched

                interaction.guild.members.fetch({ withPresences: true }).then(members => { //* Fetch all members and add them to the cache
                    members.forEach(members => { //* Looping through each member of the guild.
                        //* This method might fail because of the member's privacy settings, so we're using .catch
                        //* Trying to send a message to the member.
                        //* Filter to avoid ids_bots
                        if (!ids_bots.includes(members.id)) {
                            const insert = `INSERT INTO workers (id_user, username, step, id_guild) VALUES ("${members.id}", "${members.user.username}", 1, "${interaction.guild.id}")`;

                            con.query(insert, (err, res) => {
                                const search = `SELECT id_user= "${members.id}" FROM workers`;

                                con.query(search, (err, res) => {
                                    const updateWorkers = `UPDATE workers SET step = 1 where id_user = "${members.id}"`;

                                    con.query(updateWorkers);
                                });
                            });

                            members.send("Qu'as-tu fais de ta journée d'hier ?").catch(e => console.error(`Impossible d'envoyer un message à <@${members.user.username}>. L'utilisateur a probablement restreint ses messages privés`));
                        } else {
                            console.log(`Impossible d'envoyer un message privé à <@${members.id}>. Il semblerait que l'utilisateur soit un bot.`); //* DM closed or Bot himself
                        }
                    });
                });
            });

            let recap = new cron.CronJob('59 * * * * *', () => {
                summary(now);
            });

            message.start(); //* Launch daily task
            recap.start(); //* Launch recap
        break;

        case 'cheers':
            interaction.reply(`<@${interaction.user.id}> lance une hola pour l'équipe 🎉 !`);

            //* First use guild.members.fetch to make sure all members are cached
            interaction.guild.members.fetch({ withPresences: true }).then(members => {
                members.forEach(member => { //* Looping through each member.
                    //* Trying to send a message to the member.
                    if (!ids_bots.includes(member.id)) {
                        member.send(`<@${interaction.user.id}> vous a félécité ! Beau boulot 👍 !`).catch(e => console.error(`Erreur: Envoi du message à <@${member.user.username}> échoué`));
                    } else {
                        console.log(`Le message en destination de <@${member.user.username}> n'a pas pu être envoyé. L'utilisateur a probablement restreint ses messages privés.`); //* DM closed or Bot himself
                    }
                });
            });
        break;

        case 'cheersto':
            const target = interaction.options.getUser('target');

            target.send(`<@${interaction.user.id}> vous a félécité personnellement ! Alors, ça fait quoi de se sentir spécial 🥰 ?`).catch(e => console.error(`Erreur: Envoi du message à <@${target.username}> échoué`));

            interaction.reply({ content: `Vous avez félicité <@${target.id}>. C'est beau de reconnaître un travail bien fait 😌`, ephemeral: true });
        break;

        default:
            interaction.reply({ content: `Commande inconnue.`, ephemeral: true });
        break;
    }
});

client.login(token) //* Login to Discord with your client's token