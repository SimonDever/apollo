const fs = require('fs');
const apiKeyEnvRegex = /MOVIEDB_API_KEY[\s]*[:][\s]*(".*"|'.*')/;

fs.readFile('.moviedb-api-key', 'utf-8', (err, data) => {
    if (err) return console.log(err);
    const apiKey = data.replace(/\s/, '');
    console.log('apiKey: ' + apiKey);
    fs.readFile('./src/environments/environment.ts', 'utf-8', (err, data) => {
        if (err) return console.log(err);
        data = data.replace(apiKeyEnvRegex, 'MOVIEDB_API_KEY: \''+apiKey+'\'');
        fs.writeFile('./src/environments/environment.ts', data, 'utf-8', (err) => {
            if(err) return console.log(err);
            console.log("Finished smudging API key in environment.ts");
        });
    });
});