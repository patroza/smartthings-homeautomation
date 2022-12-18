import { exec, getInputSource, getSwitch, setSoundMode } from "./commands"

const TV = process.argv[2]
if (!TV) { throw new Error("missing TV id")}

const SOUNDBAR = process.argv[3]
if (!SOUNDBAR) { throw new Error("missing TV id")}

const tv = TV
const soundBar = SOUNDBAR

function isOn(): boolean {
  const r = (exec(getSwitch(tv)) as any)
  return r.switch.value === "on" && new Date(r.switch.timestamp).getTime() > Date.now() - 1000 * 60 * 60 * 24
}

function inputSource(): string {
  const r = (exec(getInputSource(tv)) as any)
  return r.inputSource.value
}

async function run() {
  
while (true) {
  if (isOn()) {
    await exec(setSoundMode(soundBar, inputSource() === "HDMI3" ? "game" : "surround"))
  } else {
    await exec(setSoundMode(soundBar, "standard"))
  }
  await new Promise(r => setTimeout(r, 10_000))
}
}

run().catch(console.error)