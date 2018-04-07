const fs = require('fs');
const apiKeyEnvRegex = /MOVIEDB_API_KEY[\s]*[:][\s]*(".*"|'.*')/;

fs.readFile('.moviedb-api-key', 'utf-8', (err, data) => {
	const apiKey = data.replace(/\s/, '');
	console.log('export const environment = { production: false, MOVIEDB_API_KEY: \'' + apiKey + '\' };');
});
