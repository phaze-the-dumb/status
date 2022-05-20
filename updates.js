const fetch = require('node-fetch');
const octokit = require('@octokit/core');
const fs = require('fs');
require('dotenv').config();

const client = new octokit.Octokit({ auth: process.env.GH_TOKEN });

const status = require('./info/status.json');
const sites = require('./info/sites.json');

console.log('Script Started');

Object.keys(status).forEach(key => {
    if(status[key].length > 100){
        status[key].shift()
    }
})

let testSite = ( site, done ) => {
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

        done()
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

        done()
    })
}

let updateFile = async ( data ) => {
    console.log('Pushing to GitHub');

    let d = await client.request('GET /repos/wiresboy-exe/status/contents/info/status.json');
    await client.request('PUT /repos/wiresboy-exe/status/contents/info/status.json', {
        path: 'info/status.json',
        message: 'Website Update: '+Date.now(),
        content: Buffer.from(data, 'utf-8').toString(d.data.encoding),
        sha: d.data.sha,
        branch: 'main'
    })

    console.log('Pushed to GitHub')
}

let runSiteTest = ( i ) => {
    testSite(sites[i], () => {
        if(sites[i + 1]){
            runSiteTest(i + 1);
        } else{
            updateFile(JSON.stringify(status))
        }
    })
}

runSiteTest(0)
