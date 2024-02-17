# run projects

```bash
// run the first node
$ HTTP_PORT=3001 P2P_PORT=5001 npm run dev

// run the second node
$ HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev

// run the third node
$ HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev
```
