const fetch = require('node-fetch');
const fs = require('fs');

const status = require('./info/status.json');
const sites = require('./info/sites.json');

let testSite = ( site ) => {
    fetch(site.url).then(data => {
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
    }).catch(e => {
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
    })
}

testSite(sites[0])