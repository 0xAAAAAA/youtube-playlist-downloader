const fs = require('fs')
const qs = require('querystring')
const ytlist = require('youtube-playlist')
const ytdl = require('ytdl-core')
const mp4tomp3 = require.resolve('./mp4tomp3.bat')
const { spawn } = require('child_process')
// Change the variable below to your playlist link
const url = "PLAYLIST URL HERE"

async function download() {
	const names = await ytlist(url, 'names')

	names.data.playlist.forEach(elm => {
		const str = String(qs.escape(elm['data-title'])).replace(/%20/gi, ' ').replace(/%26/gi, '&').replace(/%2C/gi, ',').replace(/%3A/gi, '').replace(/%5D/gi, ']').replace(/%5B/gi,'[').replace(/%[A-F0-9]{1}[A-F0-9]{1}/gi, '')

		ytdl(`http://www.youtube.com/watch?v=${elm['data-video-id']}`)
			.pipe(fs.createWriteStream(`${str}.mp4`))
			.on('finish', () => {
				console.log(`[MP4] Finished downloading ${str}.mp4`)

				const worker = spawn(mp4tomp3, [`${str}.mp4`])

				worker.stdout.on('data', data => console.log(data.toString()))
				worker.stderr.on('data', data => console.log(data.toString()))

				worker.on('exit', () => {
					console.log(`[MP3] Converted ${str}.mp4`)
					fs.unlink(`./${str}.mp4`, err => {
						if (err) {
							console.trace(err.message)
						}
					})
				})
			})
			.on('error', err => console.trace(err))
	})
}

download()