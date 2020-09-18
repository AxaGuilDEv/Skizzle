const fs = require('fs');
const path = require('path');
const unhandled = require('electron-unhandled');
const contextMenu = require('electron-context-menu');
const log = require('electron-log');
const { openNewGitHubIssue, debugInfo, is } = require('electron-util');
const debug = require('electron-debug');
const electron = require('electron');
const { app, BrowserWindow, Menu, Notification, ipcMain, Tray } = electron;
const { checkForUpdates } = require('./updater.js');
const { dialog } = require('electron');

try {
	require('electron-reloader')(module);
} catch (_) {}

const setAppUserModelId = () => {
	global.appUserModelId = 'skizzle';
	app.setAppUserModelId('skizzle');
};

setAppUserModelId();

contextMenu({
	showCopyImage: false,
	showSearchWithGoogle: false,
});
debug();
unhandled({
	showDialog: !app.isPackaged,
	reportButton: error => {
		openNewGitHubIssue({
			repoUrl: 'https://github.com/AxaGuilDEv/skizzle',
			body: `\`\`\`\n${error.stack}\n\`\`\`\n\n---\n\n${debugInfo()}`,
		});
	},
});

const config = {
	clientId: '26940866-2575-4627-B2A4-DFF5972172B3',
	clientSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIs',
	clientAssertion:
		'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im9PdmN6NU1fN3AtSGpJS2xGWHo5M3VfVjBabyJ9.eyJjaWQiOiIyNjk0MDg2Ni0yNTc1LTQ2MjctYjJhNC1kZmY1OTcyMTcyYjMiLCJjc2kiOiJlMmMyNmQyOC00MDljLTQ2OTAtYWM4Mi1mZDc5Y2U3NDk0NjgiLCJuYW1laWQiOiI2ZTBkMzcwYi01ZDA1LTY3ODgtYjk0ZC1lY2E2ODU5ZTRhZTEiLCJpc3MiOiJhcHAudnN0b2tlbi52aXN1YWxzdHVkaW8uY29tIiwiYXVkIjoiYXBwLnZzdG9rZW4udmlzdWFsc3R1ZGlvLmNvbSIsIm5iZiI6MTU3OTg4MjU4OSwiZXhwIjoxNzM3NzM1Mzg5fQ.JZ3XeXL22-nw-9BHi3sigm_Wruj1uPKBO-bA_um3tFaauex2eTvsEPPJZ3C5GYOdldroMRE_UGZUvBNctL2Ya6JjjESWEwwhTb2kkHs9r466ewnU7l-UfjdWV-cPJoKWlfEhU7IfH1PD1eSPJijXeB6zQYpPkM-TNAyVZl3PwOoOFdqkQrV1_eufxfiYeO9aBaxCCtzo_b3PsgvSVuZxGVWVdS0svX8bB_RKiwcWCcR089-5OnhK38OZVfx-RVP2HF2Eb-xmqTsQjcvWMdBam_sND3HKeo02GnxrByBizvTLyb6cE1yJJ-K1YY9vIGuWMaYjBLXFWEykYD60tr_bog',
	authorizationUrl: 'https://app.vssps.visualstudio.com/oauth2/authorize',
	tokenUrl: 'https://app.vssps.visualstudio.com/oauth2/token',
	logout: 'https://app.vssps.visualstudio.com/_signout',
	useBasicAuthorizationHeader: false,
	redirectUri: 'https://localhost:3000/',
	postLogoutRedirectUri:
		'https://login.microsoftonline.com/common/oauth2/logout',
	scope:
		'vso.analytics vso.build vso.code vso.connected_server vso.dashboards vso.entitlements vso.extension vso.extension.data vso.graph vso.identity vso.loadtest vso.machinegroup_manage vso.memberentitlementmanagement vso.notification vso.packaging vso.project vso.release vso.securefiles_read vso.serviceendpoint vso.symbols vso.taskgroups_read vso.test vso.variablegroups_read vso.wiki vso.work',
};
const directory = '/assets/langs/';

let proxyLogin = null;
let proxyPassword = null;
let window;
let authWindow;
let logoutWindow;
let splashscreen;
let tray;
let translate;

function getWord(word, ...format) {
	let translation = translate.words[word];

	if (!translation) {
		translation = word;
	}

	if (translation && format) {
		for (let i = 0; i < format.length + 1; i++) {
			translation = translation.replace('$' + i, format[i]);
		}
	}

	return translation;
}

function createSplashScreen() {
	splashscreen = new BrowserWindow({
		autoHideMenuBar: true,
		frame: false,
		width: 525,
		height: 265,
		resizable: false,
		skipTaskbar: true,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	splashscreen.loadURL(`file:///${__dirname}/splashscreen.html`);

	splashscreen.on('closed', () => {
		splashscreen = null;
	});
}

function hangOrCrash() {
	const options = {
		type: 'info',
		title: 'Renderer Process Hanging',
		message: 'This process is hanging.',
		buttons: ['Reload', 'Close'],
	};

	dialog.showMessageBox(options, index => {
		if (index === 0) {
			window.reload();
		} else {
			window.close();
		}
	});
}

function createWindow() {
	window = new BrowserWindow({
		title: 'Skizzle',
		center: true,
		width: 1024,
		height: 768,
		resizable: true,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			experimentalFeatures: true,
			webviewTag: true,
			enableRemoteModule: true,
		},
	});

	window.loadURL(`file:///${__dirname}/index.html`);

	window.on('closed', () => {
		window = null;
	});

	window.on('render-process-gone', () => hangOrCrash());
	window.on('unresponsive', () => hangOrCrash());

	window.once('focus', () => window.flashFrame(false));
	window.flashFrame(true);

	const iconName =
		is.macAppStore || is.macos ? '/assets/icon-macos.png' : '/assets/icon.png';

	const iconPath = __dirname + iconName;
	tray = new Tray(iconPath);
	tray.setToolTip('Skizzle application');

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Application',
			submenu: [
				{
					label: getWord('About Application'),
					selector: 'orderFrontStandardAboutPanel:',
				},
				{ type: 'separator' },
				{
					label: getWord('Quit'),
					accelerator: 'Command+Q',
					click() {
						app.quit();
					},
				},
			],
		},
		{
			label: getWord('Edit'),
			submenu: [
				{ label: getWord('Undo'), accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
				{
					label: getWord('Redo'),
					accelerator: 'Shift+CmdOrCtrl+Z',
					selector: 'redo:',
				},
				{ type: 'separator' },
				{ label: getWord('Cut'), accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
				{ label: getWord('Copy'), accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
				{ label: getWord('Paste'), accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
				{
					label: getWord('Select All'),
					accelerator: 'CmdOrCtrl+A',
					selector: 'selectAll:',
				},
			],
		},
		{
			label: getWord('Open devtool'),
			click: () => window.webContents.openDevTools({ mode: 'detach' }),
			accelerator: 'CommandOrControl+O',
			visible: is.development,
		},
		{
			label: getWord('Reload application'),
			click: () => window.reload(),
			accelerator: 'F5',
		},
		{ type: 'separator' },
		{
			label: getWord('Quit'),
			click: () => app.quit(),
			accelerator: 'CommandOrControl+Q',
		},
	]);

	tray.setContextMenu(contextMenu);
	Menu.setApplicationMenu(contextMenu);

	tray.on('click', () => {
		if (window.isMinimized()) window.restore();
		if (!window.isVisible()) window.show();
		window.focus();
	});
}

if (app.isPackaged) {
	const settings = app.getLoginItemSettings();

	app.setLoginItemSettings({
		openAtLogin: settings.openAtLogin,
	});

	ipcMain.on('launch-startup', (event, arg) => {
		app.setLoginItemSettings({
			openAtLogin: arg,
		});
	});
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
	app.quit();
} else {
	app.on('second-instance', (event, commandLine, workingDirectory) => {
		if (window) {
			if (window.isMinimized()) window.restore();
			if (!window.isVisible()) window.show();
			window.focus();
		}
	});

	app.commandLine.appendSwitch('disable-site-isolation-trials');
	app.on('ready', () => {
		let argv = process.argv;
		let lang = argv.find(x => x.startsWith('--skizzle-language='));
		let currentLanguage = app.getLocale();

		if (lang) {
			currentLanguage = lang.split('=')[1];
		}

		let languages = JSON.parse(
			fs.readFileSync(`${__dirname}/assets/langs/langs.json`, 'utf8'),
		).find(x => x.code === currentLanguage.toUpperCase());

		translate = {
			...languages,
			words: JSON.parse(
				fs.readFileSync(`${__dirname}/${languages.words}`, 'utf8'),
			),
		};

		createSplashScreen();
		checkForUpdates(splashscreen, createWindow, getWord);
	});

	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit();
		}

		if (tray) {
			tray.destroy();
		}
	});
	app.on('activate', () => {
		if (window === null) {
			createWindow();
		}
	});

	app.on('login', (event, webContents, request, authInfo, callback) => {
		if (authInfo.isProxy || authInfo.scheme === 'ntlm') {
			event.preventDefault();
			callback(proxyLogin, proxyPassword);
		}
	});

	ipcMain.on('update-language', (event, loadedLanguage) => {
		translate = loadedLanguage;
		let argv = [...process.argv.slice(1)];

		let exist = argv.findIndex(x => x.startsWith('--skizzle-language='));

		if (exist !== -1) {
			argv = argv.filter(x => !x.startsWith('--skizzle-language='));
		}

		const response = dialog.showMessageBoxSync(window, {
			buttons: [getWord('Yes'), getWord('No')],
			type: 'question',
			title: getWord('ChangingLanguageTitle'),
			message: getWord('ChangingLanguageMessage'),
			cancelId: 2,
		});

		if (response === 0) {
			event.sender.send('update-language-res', true);

			setTimeout(() => {
				app.relaunch({
					args: [...argv, '--skizzle-language=' + loadedLanguage.code],
				});
				app.exit(0);
			}, 1000);
		} else {
			event.sender.send('update-language-res', false);
		}
	});

	ipcMain.on('mentioned', (event, args) => {
		const { body, title, pullRequestId } = args;

		if (Notification.isSupported()) {
			const notification = new Notification({ body, title });

			notification.on('click', () => {
				event.sender.send(`mentioned-${pullRequestId}:clicked`);
			});

			notification.show();
		}
	});

	const login = (event, url) => {
		const details = url;

		if (details && details.startsWith(config.redirectUri)) {
			const _url = details.split('?')[1];
			const _params = new URLSearchParams(_url);
			const _accessCode = _params.get('code');

			if (_accessCode) {
				event.sender.send('getToken', {
					url: config.tokenUrl,
					redirect_uri: config.redirectUri,
					client_assertion: config.clientAssertion,
					access_code: _accessCode,
				});

				authWindow.close();
				authWindow = null;
			}
		}
	};

	ipcMain.on('notifier', (event, arg) => {
		const { body, title } = arg;

		if (Notification.isSupported()) {
			new Notification({ body, title }).show();
		}
	});

	ipcMain.on('proxy-config', (event, arg) => {
		proxyLogin = arg.proxyLogin;
		proxyPassword = arg.proxyPassword;

		if (authWindow) {
			authWindow.close();
		}
	});

	ipcMain.on('azure-devops-oauth', (event, arg) => {
		if (!authWindow && !logoutWindow) {
			authWindow = new BrowserWindow({
				autoHideMenuBar: true,
				parent: window,
				webPreferences: {
					nodeIntegration: false,
					contextIsolation: true,
				},
			});

			authWindow.show();

			authWindow.webContents.loadURL(
				`${config.authorizationUrl}?client_id=${config.clientId}&client_secret=${config.clientSecret}&response_type=code&redirect_uri=${config.redirectUri}&post_logout_redirect_uri=https://localhost:3000/&response_mode=query&scope=${config.scope}`,
			);

			authWindow.on('closed', () => {
				authWindow = null;
			});

			authWindow.webContents.on('will-navigate', (e, url) => login(event, url));
			authWindow.webContents.on('will-redirect', (e, url) => login(event, url));
		}
	});

	ipcMain.on('logout', (event, arg) => {
		logoutWindow = new BrowserWindow({
			show: false,
			modal: true,
			autoHideMenuBar: true,
			parent: window,
		});

		logoutWindow.show();

		logoutWindow.webContents.on('did-navigate', (e, url) => {
			if (url.startsWith(config.postLogoutRedirectUri)) {
				event.sender.send('loggedOut');
				setTimeout(() => {
					logoutWindow.close();
					logoutWindow = null;
				}, 2000);
			}
		});

		logoutWindow.webContents.loadURL(config.logout);
	});
}
