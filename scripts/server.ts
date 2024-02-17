import {GADGET_NAME_NOSPACE} from '@constants/constants';
import {__rootDir} from './utils/general-util';
import {createServer} from 'node:http';
import {join} from 'node:path';
import {readFileSync} from 'node:fs';

const HOST_LIST = ['localhost', '127.0.0.1'] satisfies string[];
const PORT = 3000 satisfies number;

const server = createServer((request, response): void => {
	const {
		url,
		headers: {host},
	} = request;
	const send404 = (): void => {
		response.writeHead(404, {
			'Content-Type': 'text/plain',
		});
		response.end('404 Not Found');
	};

	const {pathname} = new URL(url ?? '', `http://${host}`);

	try {
		switch (pathname) {
			case '/':
				response.writeHead(200, {
					'Content-Type': 'text/plain',
				});
				response.end(GADGET_NAME_NOSPACE);
				break;
			case '/index.css':
			case `${GADGET_NAME_NOSPACE}.css`: {
				const sourceCode: string = readFileSync(join(__rootDir, `dist/${GADGET_NAME_NOSPACE}.css`)).toString();
				response.writeHead(200, {
					'Cache-Control': 'no-store',
					'Content-Type': 'text/css',
				});
				response.end(sourceCode);
				break;
			}
			case '/index.js': {
				const sourceCode: string = readFileSync(join(__rootDir, `dist/${GADGET_NAME_NOSPACE}.js`)).toString();
				response.writeHead(200, {
					'Access-Control-Allow-Origin': '*',
					'Cache-Control': 'no-store',
					'Content-Type': 'application/javascript',
				});
				response.end(sourceCode);
				break;
			}
			default:
				send404();
		}
	} catch {
		send404();
	}
});

for (const host of HOST_LIST) {
	server.listen(PORT, host, (): void => {
		console.log(`Server is listening on http://${host}:${PORT}`);
	});
}
