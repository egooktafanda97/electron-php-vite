import { app, BrowserWindow } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
// import { spawn } from 'child_process'
import PhpServer from 'php-server';

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let phpServer: any = null

// function startPHPServer() {
const phpPath = path.join(process.env.APP_ROOT, 'php', 'php.exe')
const resourcesPath = path.join(process.env.APP_ROOT, 'apps')
//   // console.log(phpPath);

//   phpServer = spawn(phpPath, ['-S', '127.0.0.1:8005', '-t', resourcesPath], {
//     detached: true, // Agar tetap berjalan setelah Electron ditutup
//     stdio: 'ignore', // Supaya tidak menampilkan output ke console
//     shell: true
//   });
//   phpServer.unref(); // Supaya tidak mati ketika proses utama selesai


//   phpServer.on('error', (err: Error) => {
//     console.error('Failed to start PHP server:', err)
//   })
// }

async function startPHPServer() {
  try {
    phpServer = await PhpServer({
      port: 8005,
      hostname: '127.0.0.1',
      base: resourcesPath,
      binary: phpPath, // Sesuaikan dengan path PHP di sistem kamu
    });

    console.log('PHP Server started at:', phpServer.url);
  } catch (error) {
    console.error('Failed to start PHP server:', error);
  }
}

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // if (VITE_DEV_SERVER_URL) {
  //   win.loadURL(VITE_DEV_SERVER_URL)
  // } else {
  win.loadURL('http://127.0.0.1:8005')
  // win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  // }
}

app.on('window-all-closed', () => {
  if (phpServer) {
    // phpServer.kill()
  }
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  startPHPServer()
  createWindow()
})