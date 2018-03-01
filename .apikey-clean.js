const fs = require('fs');
const apiKeyEnvRegex = /MOVIEDB_API_KEY[\s]*[:][\s]*(".*"|'.*')/;

fs.readFile('./src/environments/environment.ts', 'utf-8', (err, data) => {
    if (err) return console.log(err);
    data = data.replace(apiKeyEnvRegex, 'MOVIEDB_API_KEY: \'\'');
    fs.writeFile('./src/environments/environment.ts', data, 'utf-8', (err) => {
        if(err) return console.log(err);
        console.log("Finished cleaning API key from environment.ts");
    });
});