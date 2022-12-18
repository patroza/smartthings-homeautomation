1. install smartthings cli
2. configure login for the cli, or provide a PAT (Personal Access Token) in "TOKEN" env variable (or put in .env.local file)
3. run `npm i`
4. run `npm start`

Find your soundbar device id with `smartthings devices` command

send GET request to http://localhost:3000/soundbar/:id/soundmode/:mode
e.g http://localhost:3000/soundbar/abc/soundmode/surround
