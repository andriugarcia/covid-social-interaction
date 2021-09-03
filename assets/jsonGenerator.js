countryMask = require('./countryMask')
countryPrefixes = require('./countryPrefixes')

countryPrefixes.forEach(country => {
  country.mask = countryMask[country.code]
})

var json = JSON.stringify(countryPrefixes);
var fs = require('fs');
fs.writeFile('countries.json', json, 'utf8', () => { });