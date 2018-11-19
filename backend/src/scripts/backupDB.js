const path = require('path');
const fs = require('fs');
const util = require('util');
const cp = require('child_process');

const knex = require('../db.js');

const copyFile = util.promisify(fs.copyFile);
const execFile = util.promisify(cp.execFile);

const createBackup = backupName =>
  knex.transaction(() => {
    const dbFile = path.join(__dirname, '../mydb.sqlite');
    const backupFile = path.join('/tmp', backupName + '.sqlite');
    return copyFile(dbFile, backupFile).then(() => backupFile);
  });

const scp = (backupFile, url) => execFile('scp', [backupFile, url]);

const main = async () => {
  const url = process.argv[process.argv.length - 1];
  if (!url) throw new Error('No se encontro URL para subir backup');

  const name = new Date().toISOString();
  const backupFile = await createBackup(name);
  return scp(backupFile, url);
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
