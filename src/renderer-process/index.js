const {ipcRenderer} = require('electron');
const prompt = require('electron-prompt');

let os = require('os');

let interfaces = os.networkInterfaces();

const btnCreateGame = document.querySelector('#btn-create-game');
const btnJoinGame = document.querySelector('#btn-join-game');


btnCreateGame.addEventListener('click', (event) => {
    ipcRenderer.send('create-game');

    toggleSpinner('on');
});

btnJoinGame.addEventListener('click', (event) => {
    prompt({
        title: "Enter opponent's IP Address.",
        label: "Opponent's IP Address:",
        value: '192.168.0.11:8081',
        inputAttrs: {
            type: 'url'
        }
    })
    .then((r) => {
        let ip = r;
        if(!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip.split(":")[0])) {
            ipcRenderer.send('open-error-dialog');
            return false;
        }
        ipcRenderer.send('join-game', ip);
    })
    .catch(console.error);
});

document.addEventListener("DOMContentLoaded", function(event) {
	ipcRenderer.send('index-window-did-finish-load');
});
ipcRenderer.on('set-port', (event, port) => {
    let ip = findIp(interfaces);
    document.querySelector("#my-ip").innerHTML = ip + ":" + port;
});

function findIp(interfaces) {
	for (let key in interfaces) {
		for (let a in interfaces[key]) {
			if (!interfaces[key][a].internal && interfaces[key][a].family == 'IPv4') {
				return interfaces[key][a].address;
			}
		}
	}

	return '127.0.0.1';
}

function toggleSpinner(action) {
	let spinner = document.querySelector('.spinner');
	if(action === 'on') {
		spinner.style.display = 'block';
	} else {
		spinner.style.display = 'none';
	}
}