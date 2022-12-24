import { exec, setSoundMode } from "./commands"

import lgtv2 from "lgtv2"

const TV = process.argv[2]
if (!TV) { throw new Error("missing TV id")}

const SOUNDBAR = process.argv[3]
if (!SOUNDBAR) { throw new Error("missing soundbar id")}



const tv = TV
const soundBar = SOUNDBAR

// function isOn(): boolean {
//   const r = (exec(getSwitch(tv)) as any)
//   return r.switch.value === "on" && new Date(r.switch.timestamp).getTime() > Date.now() - 1000 * 60 * 60 * 24
// }

// function inputSource(): string {
//   const r = (exec(getInputSource(tv)) as any)
//   return r.inputSource.value
// }

// function tryIsOn(): boolean {
//   try {
//     return isOn()
//   } catch (e) {
//     console.error(e)
//     return false
//   }
// }

function iteration() {
  return Promise.race([
    new Promise((res) => setTimeout(() => res, 30_000)),
    new Promise((res, rej) => {
      console.log("connecting..")
      var lgtv = lgtv2({
        url: `ws://${tv}:3000`,
        reconnect: 0, // TODO: maybe use a single instance, and actually leverage the auto reconnect...
      });

      lgtv.on('error', function (err) {
        rej(err)
      });

      lgtv.on('connect', function () {
        // HDMI 3 is pc
        console.log('connected');
        lgtv.request('ssap://com.webos.applicationManager/getForegroundAppInfo', async function (err, r) {
          try {
            lgtv.disconnect();
            if (err) { return rej(err) }

            console.log("$$$ tv channel", r.appId)
            await exec(setSoundMode(soundBar, r.appId === "com.webos.app.hdmi3" ? "game" : "surround"))
          } catch (err) {
            return rej(err)
          }
          res(r)
        });
        
      });
})])
}

async function run() {
  while (true) {
    try {
      await iteration()
    } catch (err) {
      console.error(err)
    }
    await new Promise(r => setTimeout(r, 30_000))
  }
}

run().catch(console.error)