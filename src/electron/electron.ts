import {
	app,
	BrowserWindow,
	Menu,
	Notification,
	ipcMain,
	Tray,
	dialog,
	clipboard,
	nativeTheme
} from 'electron';
import OAuthWindow from './OAuthWindow';
import { ProviderEnum } from '../models/skizzle/ProviderEnum';
import * as path from 'path';
import * as fs from 'fs';
import { autoUpdater } from 'electron-updater';
import type { SettingsType } from '../models/skizzle/SettingsType';
import type { CustomListType } from '../models/skizzle/CustomListType';
import { WindowEnum } from '../models/skizzle/WindowEnum';
import { requester } from './requester';

try {
	autoUpdater.logger = require('electron-log');
	require('electron-reloader')(module);
} catch (_) {}

const setAppUserModelId = () => {
	//@ts-ignore
	global.appUserModelId = 'com.axa.skizzle';
	app.setAppUserModelId('com.axa.skizzle');
};

setAppUserModelId();
autoUpdater.autoInstallOnAppQuit = true;

let window: BrowserWindow;
let github: OAuthWindow;
let azure: OAuthWindow;
let tray: Tray;

const hangOrCrash = async (window: BrowserWindow) => {
	const options = {
		type: 'info',
		title: 'Renderer Process Hanging',
		message: 'This process is hanging.',
		buttons: ['Reload', 'Close']
	};

	const index = await dialog.showMessageBox(window, options);

	if (index.response === 0) {
		window.reload();
	} else {
		window.close();
	}
};

const createWindow = () => {
	const isMacOs = process.mas === true || process.platform === 'darwin';
	nativeTheme.themeSource = 'system';

	window = new BrowserWindow({
		title: 'Skizzle',
		center: true,
		width: 1024,
		minWidth: 250,
		minHeight: 500,
		height: 768,
		resizable: true,
		icon: path.join(__dirname, '../../', isMacOs ? 'assets/icon.icns' : 'assets/icon.ico'),
		webPreferences: {
			preload: path.join(__dirname, '../../preload.js'),
			contextIsolation: true,
			nodeIntegration: false,
			experimentalFeatures: true
		}
	});

	const url = app.isPackaged
		? `file://${path.join(__dirname, '../../index.html')}`
		: 'http://localhost:3000';

	window.loadURL(url);
	window.on('closed', () => {
		window = null;
	});

	if (!app.isPackaged) {
		window.webContents.openDevTools({ mode: 'detach' });
	}

	//@ts-ignore
	window.on('render-process-gone', () => hangOrCrash(window));
	window.on('unresponsive', () => hangOrCrash(window));

	window.on('maximize', () => {
		window.webContents.send('change-maximisze', true);
	});

	window.on('unmaximize', () => {
		window.webContents.send('change-maximisze', false);
	});

	window.once('focus', () => window.flashFrame(false));
	window.flashFrame(true);

	const iconName = isMacOs ? 'assets/icon-macos.png' : 'assets/icon.png';

	const iconPath = path.join(__dirname, '../../', iconName);

	window.setMenuBarVisibility(false);
	tray = new Tray(iconPath);
	tray.setToolTip('Skizzle application');

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'About Skizzle',
			role: 'about'
		},
		{
			label: 'Edit',
			submenu: [
				{ label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
				{
					label: 'Redo',
					accelerator: 'Shift+CmdOrCtrl+Z',
					role: 'redo'
				},
				{ type: 'separator' },
				{ label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
				{ label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
				{ label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
				{
					label: 'Select All',
					accelerator: 'CmdOrCtrl+A',
					role: 'selectAll'
				}
			]
		},
		{
			label: 'Quit',
			role: 'quit',
			click: () => app.quit(),
			accelerator: 'CommandOrControl+Q'
		}
	]);

	tray.setContextMenu(contextMenu);
	Menu.setApplicationMenu(contextMenu);

	tray.on('click', () => {
		if (window.isMinimized()) window.restore();
		if (!window.isVisible()) window.show();
		window.focus();
	});

	github = new OAuthWindow(
		{
			parent: window,
			params: {
				client_id: '90831528b6fd1b9f98d7',
				scope: 'repo user read:org',
				client_secret: 'dd17cefb74536fa55088ae713f220bf736e5b310'
			}
		},
		['client_secret']
	);

	azure = new OAuthWindow(
		{
			parent: window,
			params: {
				client_id: '26940866-2575-4627-B2A4-DFF5972172B3',
				client_secret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIs',
				response_type: 'code',
				redirect_uri: 'https://localhost:3000/',
				post_logout_redirect_uri: 'https://localhost:3000/',
				response_mode: 'query',
				scope:
					'vso.analytics vso.build vso.code vso.connected_server vso.dashboards vso.entitlements vso.extension vso.extension.data vso.graph vso.identity vso.loadtest vso.machinegroup_manage vso.memberentitlementmanagement vso.notification vso.packaging vso.project vso.release vso.securefiles_read vso.serviceendpoint vso.symbols vso.taskgroups_read vso.test vso.variablegroups_read vso.wiki vso.work',
				client_assertion:
					'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im9PdmN6NU1fN3AtSGpJS2xGWHo5M3VfVjBabyJ9.eyJjaWQiOiIyNjk0MDg2Ni0yNTc1LTQ2MjctYjJhNC1kZmY1OTcyMTcyYjMiLCJjc2kiOiJlMmMyNmQyOC00MDljLTQ2OTAtYWM4Mi1mZDc5Y2U3NDk0NjgiLCJuYW1laWQiOiI2ZTBkMzcwYi01ZDA1LTY3ODgtYjk0ZC1lY2E2ODU5ZTRhZTEiLCJpc3MiOiJhcHAudnN0b2tlbi52aXN1YWxzdHVkaW8uY29tIiwiYXVkIjoiYXBwLnZzdG9rZW4udmlzdWFsc3R1ZGlvLmNvbSIsIm5iZiI6MTU3OTg4MjU4OSwiZXhwIjoxNzM3NzM1Mzg5fQ.JZ3XeXL22-nw-9BHi3sigm_Wruj1uPKBO-bA_um3tFaauex2eTvsEPPJZ3C5GYOdldroMRE_UGZUvBNctL2Ya6JjjESWEwwhTb2kkHs9r466ewnU7l-UfjdWV-cPJoKWlfEhU7IfH1PD1eSPJijXeB6zQYpPkM-TNAyVZl3PwOoOFdqkQrV1_eufxfiYeO9aBaxCCtzo_b3PsgvSVuZxGVWVdS0svX8bB_RKiwcWCcR089-5OnhK38OZVfx-RVP2HF2Eb-xmqTsQjcvWMdBam_sND3HKeo02GnxrByBizvTLyb6cE1yJJ-K1YY9vIGuWMaYjBLXFWEykYD60tr_bog'
			}
		},
		['client_assertion']
	);
};

autoUpdater.on('update-downloaded', () =>
	window.webContents.send('check-for-update-response')
);

ipcMain.handle(
	'check-for-update-request',
	async (event, _) => (await autoUpdater.checkForUpdates()).updateInfo.version
);
ipcMain.handle('check-for-update-restart', async (event, _) =>
	autoUpdater.quitAndInstall(true, true)
);

ipcMain.handle('copy-to-clipboard', async (event, url: string) => {
	clipboard.writeText(url, 'clipboard');

	return true;
});

ipcMain.handle('isMaximized', event => window.isMaximized());

ipcMain.handle(
	'file-export',
	async (event: Electron.IpcMainEvent, currentTabData: CustomListType) => {
		try {
			const { filePath } = await dialog.showSaveDialog(window, {
				title: 'Exporter la liste sous...',
				defaultPath: `${currentTabData.name}.json`,
				filters: [
					{
						name: 'Skizzle List',
						extensions: ['json']
					}
				]
			});

			fs.writeFileSync(filePath, JSON.stringify(currentTabData, undefined, 2));

			return true;
		} catch {
			return false;
		}
	}
);

ipcMain.handle('file-import', async (event: Electron.IpcMainEvent) => {
	try {
		const { filePaths } = await dialog.showOpenDialog(window, {
			properties: ['openFile'],
			title: 'Importer une liste',
			filters: [{ name: 'Skizzle List', extensions: ['json'] }]
		});

		return fs.readFileSync(filePaths[0], 'utf8');
	} catch {
		return undefined;
	}
});

ipcMain.on('restart', () => {
	app.relaunch();
	app.exit();
});

ipcMain.on('state', (event: Electron.IpcMainEvent, { state }: { state: WindowEnum }) => {
	switch (state) {
		case WindowEnum.Maximize:
			window.maximize();
			break;
		case WindowEnum.Minimize:
			window.minimize();
			break;
		case WindowEnum.Unmaximize:
			window.unmaximize();
			break;
		case WindowEnum.Hide:
			window.hide();
			break;
	}
});

if (app.isPackaged) {
	const settings = app.getLoginItemSettings();

	app.setLoginItemSettings({
		openAtLogin: settings.openAtLogin
	});

	ipcMain.on('launch-startup', (event, arg) => {
		app.setLoginItemSettings({
			openAtLogin: arg
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

	app.whenReady().then(() => {
		createWindow();

		app.on('window-all-closed', () => {
			if (process.platform !== 'darwin') app.quit();
			if (tray) tray.destroy();
		});
	});

	ipcMain.on('oauth', async (event, key: ProviderEnum, isSilent = false) => {
		switch (key) {
			case ProviderEnum.AzureDevOps:
				azure.startRequest(
					'https://app.vssps.visualstudio.com/oauth2/authorize',
					event,
					isSilent
				);
				break;
			case ProviderEnum.Github:
				github.startRequest('https://github.com/login/oauth/authorize', event, isSilent);
				break;
		}
	});

	ipcMain.handle(
		'token',
		async (
			event,
			{ key, body, settings }: { key: ProviderEnum; body: any; settings: SettingsType }
		) => {
			try {
				switch (key) {
					case ProviderEnum.AzureDevOps:
						return azure.requestToken(
							'https://app.vssps.visualstudio.com/oauth2/token',
							body,
							settings
						);
					case ProviderEnum.Github:
						return github.requestToken(
							'https://github.com/login/oauth/access_token',
							body,
							settings
						);
				}
			} catch (err) {
				return {
					message: `Can't reach acces_token call: ${err}`
				};
			}
		}
	);

	ipcMain.handle('request', async (event, args) => {
		const { url, options, settings } = JSON.parse(args);

		options['user-agent'] = window.webContents.session.getUserAgent();

		return requester(url, options, settings);
	});

	ipcMain.on('notifier', (event, arg) => {
		if (Notification.isSupported()) {
			const iconName =
				process.mas === true || process.platform === 'darwin'
					? 'assets/icon-macos.png'
					: 'assets/icon.png';

			const icon = path.join(__dirname, '../../', iconName);

			new Notification({ ...arg, icon }).show();
		}
	});
}
