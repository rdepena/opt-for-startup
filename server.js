const connectLib = require('connect');
const http = require('http');
const slow = require('connect-slow');
const { connect} = require('hadouken-js-adapter');
const serveStatic = require('serve-static');

let fin;
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
}).then(async(f) => {
    fin = f;
    console.timeEnd('Connecting to OpenFin');
    fin.InterApplicationBus.subscribe({uuid:'*'}, 'child-window-creation' ,a => {
        console.log(`Child Window Load: ${a.toFixed(3)} ms`);
    });
    fin.InterApplicationBus.subscribe({uuid:'*'}, 'child-window-shown', a => {
        console.log(`Child Window Shown: ${a.toFixed(3)} ms`);
    });

    await fin.Application.start( {
	name: 'opt-coordinator',
	url: 'http://127.0.0.1:5555/coordinator.html',
	uuid: 'opt-coordinator',
	applicationIcon: 'http://127.0.0.1:5555/favicon.ico',
	autoShow: true,
	waitForPageLoad: true
    });
})
.catch(console.error);
