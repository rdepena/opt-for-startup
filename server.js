const connectLib = require('connect');
const http = require('http');
const slow = require('connect-slow');
const { connect} = require('hadouken-js-adapter');
const readline = require('readline');
const serveStatic = require('serve-static');

let fin;

const appConfig1 = {
    name: 'OpenfinPOC1',
    url: 'http://127.0.0.1:5555/index1.html',
    uuid: 'OpenfinPOC1',
    applicationIcon: 'http://127.0.0.1:5555/favicon.ico',
    autoShow: true,
    waitForPageLoad: true
}

const appConfigCoordinator = {
    name: 'opt-coordinator',
    url: 'http://127.0.0.1:5555/coordinator.html',
    uuid: 'opt-coordinator',
    applicationIcon: 'http://127.0.0.1:5555/favicon.ico',
    autoShow: true,
    waitForPageLoad: true
}

const appConfig2 = {
    name: 'OpenfinPOC2',
    url: 'http://127.0.0.2:5555/index1.html',
    uuid: 'OpenfinPOC2',
    applicationIcon: 'http://127.0.0.2:5555/favicon.ico',
    autoShow: true,
    waitForPageLoad: false
}


const appConfig3 = {
    name: 'OpenfinPOC3',
    url: 'http://127.0.0.3:5555/index3.html',
    uuid: 'OpenfinPOC3',
    applicationIcon: 'http://127.0.0.3:5555/favicon.ico',
    autoShow: true,
    waitForPageLoad: false
}


readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);


//start the server 
var app = connectLib();
app.use(slow({
    url: /\.js$/i,
    delay: 300
}))
.use(serveStatic('./'));

http.createServer(app).listen(5555);

console.time('Connecting to OpenFin');
connect({
    uuid: 'node-connection', //Supply an addressable Id for the connection
    runtime: {
        version: '10.66.40.10',
        arguments: ''
    },
    nonPersistent: true //We want OpenFin to exit as our application exists.
}).then(f => {
    fin = f;
    console.timeEnd('Connecting to OpenFin');
    fin.InterApplicationBus.subscribe({uuid:'*'}, 'child-window-creation' ,a => {
        console.log(`Child Window Load: ${a.toFixed(3)} ms`);
    });
    fin.InterApplicationBus.subscribe({uuid:'*'}, 'child-window-shown', a => {
        console.log(`Child Window Shown: ${a.toFixed(3)} ms`);
    });
})
.catch(console.error);

async function launchapp(config) {
    const win = fin.Window.wrapSync(config);
    await win.once('shown', () => console.timeEnd('Main Window Shown'))
    console.time('Main Window Load');
    console.time('Main Window Shown');
    await fin.Application.start(config);
    console.timeEnd('Main Window Load');
}
process.stdin.on('keypress', async (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit();
    } else if (key.name === '1') {
        await launchapp(appConfig1);
    } else if (key.name === '2') {
        await launchapp(appConfig2);
    } else if (key.name === '3') {
        await launchapp(appConfig3);
    } else if (key.name === '0') {
        await launchapp(appConfigCoordinator);
    } else if (key.ctrl && key.name === 'r') {
        console.time('Clearing the cache');
        await fin.System.clearCache();
        console.timeEnd('Clearing the cache');
    } else {
        console.log(`You pressed the "${str}" key`);
        console.log();
        console.log(key);
        console.log();
    }
});
console.log('Press any key...');