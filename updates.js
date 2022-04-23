const fetch = require('node-fetch');
const fs = require('fs');

const status = require('./info/status.json');
const sites = require('./info/sites.json');

console.log('Script Started');

let testSite = ( site ) => {
    console.log('Fetching '+site.name);

    fetch(site.url).then(data => {
        console.log('Response With Code: '+data.status);

        let statusres = {
            online: data.status === 200,
            code: data.status,
            text: data.statusText,
            timestamp: Date.now()
        }

        if(!status[site.name]){
            status[site.name] = []
        }

        status[site.name].push(statusres)

        fs.writeFileSync('info/status.json', JSON.stringify(status))
        console.log('Updated JSON File');

        data.text().then(text => console.log(text))
    }).catch(e => {
        console.log('Fetch Error: '+e);

        let statusres = {
            online: false,
            code: 000,
            text: 'Fetch Error',
            timestamp: Date.now()
        }

        if(!status[site.name]){
            status[site.name] = []
        }

        status[site.name].push(statusres)

        fs.writeFileSync('info/status.json', JSON.stringify(status))
        console.log('Updated JSON File');
    })
}

testSite(sites[0])