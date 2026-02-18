# Airtable Remote MCP

This remote MCP Agent runs in wrangler and is deployed to cloudflare worker.
Tools implemented:  
`list_records`, `create_record`, `update_record`, `delete_record`, `whoami`, `list_bases`, `list_tables`

## Claude Desktop Config
```
"airtable": {
  "command": "npx",
  "args": [
    "-y",
    "mcp-remote",
    "https://airtable-mcp.curlmate.workers.dev/mcp",
    "--header",
    "access-token: your Airtable Access Token from https://curlmate.dev"
  ]
}
```

## Instruction

```sh
npm install
npm start
```

This will start an MCP server on `http://localhost:5174/mcp`

Inside your `McpAgent`'s `init()` method, you can define resources, tools, etc:

```ts
export class MyMCP extends McpAgent<Env> {
  server = new McpServer({
    name: "Demo",
    version: "1.0.0"
  });

  async init() {
    this.server.resource("counter", "mcp://resource/counter", (uri) => {
      // ...
    });

    this.server.registerTool(
      "add",
      {
        description: "Add to the counter, stored in the MCP",
        inputSchema: { a: z.number() }
      },
      async ({ a }) => {
        // add your logic here
      }
    );
  }
}
```

## API Endpoints

list records -
curl -X GET "https://api.airtable.com/v0/YOUR_BASE_ID/YOUR_TABLE" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

create record -
curl -X POST "https://api.airtable.com/v0/YOUR_BASE_ID/YOUR_TABLE" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "Name": "Test Record"
    }
  }'

update record -
curl -X PATCH "https://api.airtable.com/v0/YOUR_BASE_ID/YOUR_TABLE/RECORD_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "Name": "Updated Name"
    }
  }'

delete record -
curl -X DELETE "https://api.airtable.com/v0/YOUR_BASE_ID/YOUR_TABLE/RECORD_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

whoami -
curl -X GET "https://api.airtable.com/v0/meta/whoami" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

list bases -
curl -X GET "https://api.airtable.com/v0/meta/bases" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

list tablenames -
curl -X GET "https://api.airtable.com/v0/meta/bases/YOUR_BASE_ID/tables" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
