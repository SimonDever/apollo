const fs = require('fs');
const apiKeyEnvRegex = /MOVIEDB_API_KEY[\s]*[:][\s]*(".*"|'.*')/;

console.log('export const environment = { production: false, MOVIEDB_API_KEY: \'\' };');
