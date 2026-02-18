import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

const zAccessTokenResponse = z.object({
  accessToken: z.string(),
})

async function getAccessToken(jwt: string | undefined, connection: string | undefined) {
  if(!jwt || !connection) {
    throw new Error("missing jwt or connection in header");
  }
  const res = await fetch("https://curlmate.dev/api/token", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "x-connection": connection
    }
  });

  if (!res.ok) throw new Error(await res.text());
  const data = zAccessTokenResponse.parse(await res.json());
  return data.accessToken;
}

export class AirtableMCP extends McpAgent<Env, {}> {
  server = new McpServer({
    name: "airtable-mcp",
    version: "0.0.1",
  });

  async init() {
    this.server.registerTool(
      "list_records",
      {
        description: "List records from an Airtable table",
        inputSchema: { 
          baseId: z.string(),
          tableName: z.string()
        }
      },
      async ({ baseId, tableName }, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const accessToken = await getAccessToken(jwt, connection);
        
        const response = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          }
        })

        if (!response.ok) {
          return {
            content: [
              {
                text: JSON.stringify(await response.text()),
                type: "text"
              }
            ]
          }
        }

        return {
          content: [
            {
              text: JSON.stringify(await response.json()),
              type: "text"
            }
          ]
        };
      }
    );

    this.server.registerTool(
      "create_record",
      {
        description: "Create a new record in an Airtable table",
        inputSchema: { 
          baseId: z.string(),
          tableName: z.string(),
          fields: z.record(z.string(), z.string())
        }
      },
      async ({ baseId, tableName, fields }, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const accessToken = await getAccessToken(jwt, connection);
        
        const response = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fields })
        })

        if (!response.ok) {
          return {
            content: [
              {
                text: JSON.stringify(await response.text()),
                type: "text"
              }
            ]
          }
        }

        return {
          content: [
            {
              text: JSON.stringify(await response.json()),
              type: "text"
            }
          ]
        };
      }
    );

    this.server.registerTool(
      "update_record",
      {
        description: "Update an existing record in an Airtable table",
        inputSchema: { 
          baseId: z.string(),
          tableName: z.string(),
          recordId: z.string(),
          fields: z.record(z.string(), z.string())
        }
      },
      async ({ baseId, tableName, recordId, fields }, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const accessToken = await getAccessToken(jwt, connection);
        
        const response = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${recordId}`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fields })
        })

        if (!response.ok) {
          return {
            content: [
              {
                text: JSON.stringify(await response.text()),
                type: "text"
              }
            ]
          }
        }

        return {
          content: [
            {
              text: JSON.stringify(await response.json()),
              type: "text"
            }
          ]
        };
      }
    );

    this.server.registerTool(
      "delete_record",
      {
        description: "Delete a record from an Airtable table",
        inputSchema: { 
          baseId: z.string(),
          tableName: z.string(),
          recordId: z.string()
        }
      },
      async ({ baseId, tableName, recordId }, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const accessToken = await getAccessToken(jwt, connection);
        
        const response = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${recordId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          }
        })

        if (!response.ok) {
          return {
            content: [
              {
                text: JSON.stringify(await response.text()),
                type: "text"
              }
            ]
          }
        }

        return {
          content: [
            {
              text: JSON.stringify(await response.json()),
              type: "text"
            }
          ]
        };
      }
    );

    this.server.registerTool(
      "whoami",
      {
        description: "Get information about the authenticated Airtable user",
        inputSchema: { }
      },
      async ({}, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const accessToken = await getAccessToken(jwt, connection);
        
        const response = await fetch(`https://api.airtable.com/v0/meta/whoami`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          }
        })

        if (!response.ok) {
          return {
            content: [
              {
                text: JSON.stringify(await response.text()),
                type: "text"
              }
            ]
          }
        }

        return {
          content: [
            {
              text: JSON.stringify(await response.json()),
              type: "text"
            }
          ]
        };
      }
    );

    this.server.registerTool(
      "list_bases",
      {
        description: "List all bases accessible to the authenticated user",
        inputSchema: { }
      },
      async ({}, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const accessToken = await getAccessToken(jwt, connection);
        
        const response = await fetch(`https://api.airtable.com/v0/meta/bases`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          }
        })

        if (!response.ok) {
          return {
            content: [
              {
                text: JSON.stringify(await response.text()),
                type: "text"
              }
            ]
          }
        }

        return {
          content: [
            {
              text: JSON.stringify(await response.json()),
              type: "text"
            }
          ]
        };
      }
    );

    this.server.registerTool(
      "list_tables",
      {
        description: "List all tables in a specific base",
        inputSchema: { 
          baseId: z.string()
        }
      },
      async ({ baseId }, { requestInfo }) => {
        const jwt = requestInfo?.headers["access-token"] as string | undefined;
        const connection = requestInfo?.headers["x-connection"] as string | undefined;
        const accessToken = await getAccessToken(jwt, connection);
        
        const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          }
        })

        if (!response.ok) {
          return {
            content: [
              {
                text: JSON.stringify(await response.text()),
                type: "text"
              }
            ]
          }
        }

        return {
          content: [
            {
              text: JSON.stringify(await response.json()),
              type: "text"
            }
          ]
        };
      }
    );
  }

  onError(_: unknown, error?: unknown): void | Promise<void> {
    console.error("AirtableMCP initialization error:", error);
  }
}

export default {
  fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/sse")) {
      return AirtableMCP.serveSSE("/sse", { binding: "AirtableMCP" }).fetch(
        request,
        env,
        ctx
      );
    }

    if (url.pathname.startsWith("/mcp")) {
      return AirtableMCP.serve("/mcp", { binding: "AirtableMCP" }).fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  }
};
