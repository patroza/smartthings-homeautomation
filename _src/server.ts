import dotenv from "dotenv"
import cp from "child_process"
import f from "fastify"
import S from "fluent-json-schema"
// import util from "util"
// const exec = util.promisify(cp.exec);

const envFile = "./.env.local"

const { error } = dotenv.config({ path: envFile })
if (error) {
  console.log("did not load .env.local")
} else {
  console.log("loading env from: " + envFile)
}

const TOKEN = process.env["TOKEN"]
const PORT = process.env["PORT"] ? parseInt(process.env["PORT"]) : 3000

function command(cmd: string, args: string) {
  return `smartthings ${cmd} -j ${TOKEN ? `--token ${TOKEN} ` : ""}${args}`
}

function setSoundMode(deviceId: string, soundMode: Modes) {
  return command("devices:commands", `${deviceId} 'execute:execute("/sec/networkaudio/soundmode", { "x.com.samsung.networkaudio.soundmode":"${soundMode}" })'`)
}

const exec = (cmd: string) =>  {
  //console.debug("cmd: ", cmd)
  const r = cp.execSync(cmd, { encoding: "utf-8" })
  //console.log("r: ", r)
  if (r.startsWith("Command executed successfully")) {
    return undefined
  }
  return JSON.parse(r) as unknown
}


const fastify = f({ logger: true })

type Modes = "standard" | "surround" | "game" | "adaptive"
interface Params {
  id: string
  mode: Modes
}

fastify.get(
  '/soundbar/:id/soundmode/:mode',
  { schema: { params: S.object().prop("id", S.string()).prop("mode", S.enum(["standard", "surround", "game", "adaptive"]) ) } },
  async (request, reply ) => {
    const params = request.params as Params // yuk
    const r = exec(setSoundMode(params.id, params.mode))
    reply.status(r ? 200 : 204)
    return r
})

const start = async () => {
  try {
    await fastify.listen({ port: PORT })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()