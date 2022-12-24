import cp from "child_process"
// import util from "util"
// const exec = util.promisify(cp.exec);


export type Modes = "standard" | "surround" | "game" | "adaptive"

export function command(cmd: string, args: string) {
  const TOKEN = process.env["TOKEN"]
  return `smartthings ${cmd} -j ${TOKEN ? `--token ${TOKEN} ` : ""}${args}`
}

export function setSoundMode(deviceId: string, soundMode: Modes) {
  return command("devices:commands", `${deviceId} 'execute:execute("/sec/networkaudio/soundmode", { "x.com.samsung.networkaudio.soundmode":"${soundMode}" })'`)
}

export function getSwitch(deviceId: string) {
  return command("devices:capability-status", `${deviceId} 1 27`)
}

export function getInputSource(deviceId: string) {
  return command("devices:capability-status", `${deviceId} 1 12`)
}

export const exec = (cmd: string) =>  {
  console.debug("cmd: ", cmd)
  const r = cp.execSync(cmd, { encoding: "utf-8" })
  //console.log("r: ", r)
  if (r.startsWith("Command executed successfully")) {
    return undefined
  }
  return JSON.parse(r) as unknown
}