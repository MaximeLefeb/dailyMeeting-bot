const { WebClient } = require('@slack/web-api');
const { App, LogLevel } = require('@slack/bolt'); 
const mysql = require('mysql');
const schedule = require('node-schedule');
const path = require('path');
const { token, channelId, host, user, password, database, port, signingSecret } = require(path.resolve(__dirname, '../config/slackConfig.json'));

const web = new WebClient(token);

const con = mysql.createConnection({ host, user, password, database, port });

con.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
});

const app = new App({
  token: token,
  signingSecret: signingSecret,
  logLevel: LogLevel.DEBUG
});

async function sendMessage(userId, text) {
    try {
        const conversation = await web.conversations.open({ users: userId });
        await web.chat.postMessage({ channel: conversation.channel.id, text });
    } catch (error) {
        console.error(error);
    }
}

async function isBot(userId) {
    const response = await web.users.info({ user: userId });
    return response.user.is_bot;
}

async function updateUserStep(userId, step) {
    return new Promise((resolve, reject) => {
        const updateQuery = `UPDATE workersslack SET step=${step} WHERE id_user="${userId}"`;
        con.query(updateQuery, (err, result) => {
            if (err) {
                console.error(`Error updating user step: ${err}`);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

async function sendNextMessage(userId, step) {
    switch (step) {
        case 0:
            await sendMessage(userId, "C'est noté ! Et qu'as-tu prévu pour aujourd'hui ?");
            break;
        case 1:
            await sendMessage(userId, "Compris ! Tu peux te preparer pour le Scrum Meeting !");
            break;
        case 2:
            break;
        default:
            break;
    }
}
async function sendDailyMessageToUser(userId) {
    sendMessage(userId, "Qu'avez-vous fait hier?");

    const search = `SELECT step FROM workersslack WHERE id_user= "${userId}"`;
    con.query(search, async (err, result) => {
        if (err) console.error(err);

        // Vérifiez si result[0] existe avant d'essayer d'accéder à 'step'
        if(result[0]) {
            let step = result[0].step;
            if (step === 0) {
                await updateUserStep(userId, 1);
                sendNextMessage(userId, 1);
            }
        } else {
            console.log(`No user found with id: ${userId}`);
        }
    });
}

app.event('message', async ({ event, client }) => {
    const userId = event.user;
    const message = event.text;

    if (event.thread_ts || !event.text) {
        // This is a thread reply or a message without text, so ignore it
        return;
    }

    await sendMessage(userId, message);

    const search = `SELECT step FROM workersslack WHERE id_user= "${userId}"`;
    con.query(search, async (err, result) => {
        if (err) console.error(err);

        // Vérifier si result[0] existe avant d'essayer d'accéder à 'step'
        if(result[0]) {
            let step = result[0].step;
            step = (step + 1) % 3;
            await updateUserStep(userId, step);
            sendNextMessage(userId, step);
        } else {
            console.log(`No user found with id: ${userId}`);
        }
    });
});

(async () => {
    await app.start(process.env.PORT || 3000);

    console.log('Dailymeet Bot ready ✔️ !');

    const members = await web.conversations.members({ channel: channelId });
    for (let member of members.members) {
        if (member !== 'USLACKBOT' && !(await isBot(member))) {
            await sendDailyMessageToUser(member);
        }
    }
})();

schedule.scheduleJob('0 0 9 * * *', async function() {
    const members = await web.conversations.members({ channel: channelId });
    for (let member of members.members) {
        if (member !== 'USLACKBOT' && !(await isBot(member))) {
            await sendDailyMessageToUser(member);
        }
    }
}); 
