`/fetch`
	Waits for a message
`/push?message=foo`
	Sends a message to all with `/fetch` connected clients

Usage
=====
	1. Start server with `node server.js`
	2. Open client with `http://localhost:port/client.html`
	3. Open second connection `with http://localhost:port/push?message=foo`
	4. Fuck yeah!