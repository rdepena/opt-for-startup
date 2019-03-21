import { html, render } from '../node_modules/lit-html/lit-html.js';

class openfinInfo extends HTMLElement {
    constructor() {
        super();
        this.render();
    }
    render(){
        window.requestAnimationFrame(async () => {
            const loadingDiv = document.querySelector('#loading');
            loadingDiv.style.visibility = 'hidden';
            const info = html`
            <div class="logo-container">
                <svg class="logo" height="100%" viewBox="0 0 1092.83 297.91" width="100%" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <path d="M283.38 114a50 50 0 0 0-5.75-4.94l-.75-.52c-.43-.3-.85-.61-1.29-.9s-.95-.6-1.42-.89l-.66-.41c-.59-.35-1.19-.68-1.79-1l-.35-.19a49.6 49.6 0 0 0-23-5.68 49.71 49.71 0 0 1-49.67-49.76A49.62 49.62 0 1 0 149 99.24 49.71 49.71 0 0 1 198.67 149a49.71 49.71 0 0 1-49.76 49.67A49.62 49.62 0 0 1 99.25 149a49.62 49.62 0 1 0-49.62 49.62 49.62 49.62 0 0 1 49.62 49.62 49.71 49.71 0 0 0 99.43 0 49.62 49.62 0 0 1 49.62-49.62 49.56 49.56 0 0 0 25.19-6.86c.66-.39 1.31-.8 2-1.22l.14-.09c.6-.4 1.2-.82 1.78-1.24l.26-.18c.52-.38 1-.79 1.55-1.2l.44-.34c.48-.39.94-.8 1.41-1.21l.51-.44q.9-.81 1.77-1.68l.09-.08a49.84 49.84 0 0 0 5.8-7q.56-.81 1.08-1.64a49.61 49.61 0 0 0-6.94-61.44z" class="logo-openfin-shape" fill="currentColor"></path>
                    </g>
                </svg>
            </div>
            `;
            render(info, this);
        });
    }
}

class mainControls extends HTMLElement {
    constructor() {
        super();
        this.render = this.render.bind(this);
        this.createChild = this.createChild.bind(this);

        this.render();
    }
    render(){
        const ctrl = html`
        <div>
            <p>
                <button class="btn" @click=${this.createChild}>Create child window</button>
            </p>
        </div>
        `;
        render(ctrl, this);
    }
    async createChild() {
        const winName = `child-window-${Date.now()}`;
        const app = fin.Application.getCurrentSync();
        const win = fin.Window.wrapSync({ uuid: app.identity.uuid, name: winName});

        await win.once('shown', () => {
            const bShown = performance.now();    
            fin.InterApplicationBus.publish(`child-window-shown`, bShown - a);
        });
        const a = performance.now();
        const { initialOptions } = await app.getInfo();
        await fin.Window.create({
            name: winName,
            url: `${location.origin}/child.html`,
            defaultWidth: 288,
            defaultHeight: 331,
            resizable: false,
            saveWindowState:false,
            waitForPageLoad: initialOptions.waitForPageLoad,
            backgroundColor : "#201F45"
        });

        const bCreate = performance.now();
        fin.InterApplicationBus.publish('child-window-creation', bCreate - a);
    }
}

class coordinator extends HTMLElement {
    constructor() {
        super();
        this.render = this.render.bind(this);
        this.createApp = this.createApp.bind(this);
        this.data = {};

        fin.InterApplicationBus.subscribe({uuid: '*'}, 'child-window-creation', (loadTime) => {
            this.data.childWindowLoad = loadTime;
            this.render();
        });
        fin.InterApplicationBus.subscribe({uuid: '*'}, 'child-window-shown', (shownTime) => {
            this.data.childWindowShow = shownTime;
            this.render();
        });

        this.appConfigs = {
            appConfig1: {
                name: 'OpenfinPOC1',
                url: 'http://127.0.0.1:5555/index1.html',
                uuid: 'OpenfinPOC1',
                applicationIcon: 'http://127.0.0.1:5555/favicon.ico',
                autoShow: true,
                waitForPageLoad: true,
                defaultWidth: 288,
                defaultHeight: 331,
                resizable: false,
                saveWindowState:false,
                backgroundColor : "#201F45"
            },
            appConfig2: {
                name: 'OpenfinPOC2',
                url: 'http://127.0.0.2:5555/index1.html',
                uuid: 'OpenfinPOC2',
                applicationIcon: 'http://127.0.0.2:5555/favicon.ico',
                autoShow: true,
                waitForPageLoad: false,
                defaultWidth: 288,
                defaultHeight: 331,
                resizable: false,
                saveWindowState:false,
                backgroundColor : "#201F45"
            },
            appConfig3: {
                name: 'OpenfinPOC3',
                url: 'http://127.0.0.3:5555/index3.html',
                uuid: 'OpenfinPOC3',
                applicationIcon: 'http://127.0.0.3:5555/favicon.ico',
                autoShow: true,
                waitForPageLoad: false,
                defaultWidth: 288,
                defaultHeight: 331,
                resizable: false,
                saveWindowState:false,
                backgroundColor : "#201F45"
            }
        };
        this.render({});
    }
    render(){
        const ctrl = html`
        <div>
            <ul>
                <li><button class="btn" @click=${() => this.createApp('appConfig1')}>Create Application 1</button></li>
                <li><button class="btn" @click=${() => this.createApp('appConfig2')}>Create Application 2</button></li>
                <li><button class="btn" @click=${() => this.createApp('appConfig3')}>Create Application 3</button></li>
            </ul>
            <ul class="evt-times">
                ${this.data.mainWindowShow
                    ? html`<li >Main Window Shown: <span class="numbers">${this.data.mainWindowShow.toFixed(2)}ms</span></li>`
                    : html``
                }
                ${this.data.mainWindowLoad
                   ? html`<li >Main Window Loaded: <span class="numbers">${this.data.mainWindowLoad.toFixed(2)}ms</span></li>`
                    : html``
                }
                ${this.data.childWindowShow
                   ? html`<li >Child Window Shown: <span class="numbers">${this.data.childWindowShow.toFixed(2)}ms</span<</li>`
                    : html``
                }
                ${this.data.childWindowLoad
                    ? html`<li >Child Window Loaded: <span class="numbers">${this.data.childWindowLoad.toFixed(2)}ms</span></li>`
                    : html``
                }
            </ul>
        </div>
        `;
        render(ctrl, this);
    }
    
    async createApp(appConfigName) {
        this.data = {};
        this.render();
        const config = this.appConfigs[appConfigName];
        const win = fin.Window.wrapSync(config);

        try {
            await win.once('shown', () => {
                this.data.mainWindowShow = performance.now() - startTime;
                this.render();
            });

            const startTime = performance.now();
            await fin.Application.start(config);
            this.data.mainWindowLoad = performance.now() - startTime;
            this.render();
        } catch (err) {
            console.error(err);
        }
    }
}
customElements.define('openfin-info', openfinInfo);
customElements.define('main-controls', mainControls);
customElements.define('app-coordinator', coordinator);
//#4f4df9