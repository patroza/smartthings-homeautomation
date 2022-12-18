import dotenv from "dotenv"
import f from "fastify"
import S from "fluent-json-schema"
import { Modes, exec, setSoundMode } from "./commands"

const envFile = "./.env.local"

const { error } = dotenv.config({ path: envFile })
if (error) {
  console.log("did not load .env.local")
} else {
  console.log("loading env from: " + envFile)
}

const PORT = process.env["PORT"] ? parseInt(process.env["PORT"]) : 3000

const fastify = f({ logger: true })

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