reed 
const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;


///////////////////


module.exports = { session: process.env.SESSION_ID || 'Byte;;;eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR05ta2tURGNVWWZWK0ZpZmY5WjdOb3lTbUtNWkNHUGxTeUpxcHBlVWpYRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVTkvVUZLbFpxMGI0SkRFOXZEdVc2QmNhN3hiL2M2TkJqck1KWVFONElTUT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJpRDcxcTFqYkxmY2EzWmc0SExmY2Zyc05KWXZxbnl5Q3c1cGZIK0FqRFVVPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI4eXpqMUJmVUJoQjBtSW1xWjBERm1vVngxVGlCRGVBaE9CRDFra0RhVUJnPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkdFQml4SmpHSHZMcVpOaGFwdERMTjdkaGZzRExWWUtwalFQdnF4Zms3VTQ9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IndUcjlSUXFIR1c3STIrYXlFdDNrZWZOS0hYU080UkZHQ015MmkzR05YQWc9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZ0dUaGlOaXdaeEQ0bDVDUzlIMXd1SHpNb0s3NG5JdnV0eUY2STVzOEdYVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTDVMeEUwZUtNNUNsRHV6S01lSE8vVElLeThyL2U1RTZoMDhrcUc3bmRucz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjFFcnFHUEo2OHZoQmoxVnAzem0vamN4V1c0N2hJZ055VG1tWW5XRTdrWG1ENE90cDkwZEY5dStoU05pK0RBMGxJMlJITTVZSGh6bGlIenpWOFUxeGpnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTU1LCJhZHZTZWNyZXRLZXkiOiJ5bEhDbFNvUmVRdlZ5ajh2TndhZy9DUk5sSVRLeGxySVU4MzJNLzhRVzc4PSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJ0aVE0WkhmTlIxNnZhcFlCck45QnN3IiwicGhvbmVJZCI6Ijg0NmQzMjc0LTY1YzEtNGEzNC1hNTMzLTAzOTAyZTg2OTBiOCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJrQUNSL0RETW56RHJhSE9sTmJmcmFVTmxBSU09In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRlJpL3VlOXROU2FteUsyZVF6Y3ZrL21oakxjPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IlJDWFpRSEhNIiwibWUiOnsiaWQiOiIyNTQxMDI0NDM5OTE6MkBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSkxIMW9BRUVKR1o4TGNHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiMkVUQktVdVJYMFpDSWRtbnlaR2E5blppUmZ4NjFzNHBuVWUzZ01OYkdUYz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiVHVvWGJPT1JWOVdLRUFKWDJiNmwxWGZFb3ZlWTl5dERRNmxDR284UStHVlRlL2RvVkVqaHpveGVuM1ZudjJHK2ZhN1VwMDlCdlNENWJtU3hIMWkvQmc9PSIsImRldmljZVNpZ25hdHVyZSI6IlFiWVBFSXBtbS9aYmR4a1lERWtDbXloZlNLUUZET1dabG5qOFU3dHZaNWFyWjVQMWV6OVV5Ujd5amM5clpoVnk0dWxsTVYwUjQ2QndkeVN5WkJGcmhRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0MTAyNDQzOTkxOjJAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCZGhFd1NsTGtWOUdRaUhacDhtUm12WjJZa1g4ZXRiT0taMUh0NEREV3hrMyJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyNzc5NDM0Nn0=',

////////////////////////////////



    PREFIXE: process.env.PREFIX || ".",



///////////////////////////
    A_REACT : process.env.AUTO_REACTION || 'on',
    CHATBOT: process.env.CHAT_BOT || "on",
    OWNER_NAME: process.env.OWNER_NAME || "MR ANONYMOUS",
    NUMERO_OWNER : process.env.OWNER_NUMBER || "923072380380",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    BOT : process.env.BOT_NAME || 'BYTE-MD',
    OPENAI_API_KEY : process.env.OPENAI_API_KEY || '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',
    URL : process.env.BOT_MENU_LINKS || 'https://raw.githubusercontent.com/HyHamza/HyHamza/main/Images/BYTE-MD-LITE.jpeg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_API_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    //GPT : process.env.OPENAI_API_KEY || '',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Update ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
