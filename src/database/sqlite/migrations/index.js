//Migrations automatizar e recria a tabela caso precise

const sqliteConnection = require('../../sqlite');

const creatUsers = require('./createUsers');

async function migrationsRun(){
    const schemas = [
        creatUsers
    ].join('');

    sqliteConnection()
    .then(db => db.exec(schemas))
    .catch(error => console.error(error));
}

module.exports = migrationsRun