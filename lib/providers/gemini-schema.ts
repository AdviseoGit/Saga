/**
 * Översätter JSON Schema (formen Claude vill ha) till Geminis `responseSchema`,
 * som bara är en delmängd av OpenAPI 3.0.
 *
 * Tre skillnader att hålla reda på:
 *  - typen anges som versal enum: OBJECT / STRING / NUMBER / …
 *  - unionstyper finns inte — `["string", "null"]` blir `STRING` + `nullable: true`
 *  - `additionalProperties` stöds inte alls och måste bort
 */

export interface JsonSchemaNode {
  type?: string | string[];
  properties?: Record<string, JsonSchemaNode>;
  items?: JsonSchemaNode;
  required?: string[];
  enum?: string[];
  description?: string;
  additionalProperties?: boolean;
}

export interface GeminiSchemaNode {
  type: string;
  nullable?: boolean;
  enum?: string[];
  description?: string;
  properties?: Record<string, GeminiSchemaNode>;
  /** Gemini följer fältordningen bokstavligt — samma ordning som i källschemat. */
  propertyOrdering?: string[];
  required?: string[];
  items?: GeminiSchemaNode;
}

const TYPE_MAP: Record<string, string> = {
  object: "OBJECT",
  array: "ARRAY",
  string: "STRING",
  number: "NUMBER",
  integer: "INTEGER",
  boolean: "BOOLEAN",
};

export function toGeminiSchema(node: JsonSchemaNode): GeminiSchemaNode {
  const declared = Array.isArray(node.type) ? node.type : [node.type ?? "string"];
  const nullable = declared.includes("null");
  const primary = declared.find((t) => t && t !== "null") ?? "string";
  const mapped = TYPE_MAP[primary];
  if (!mapped) throw new Error(`Gemini-schema: typen "${primary}" kan inte översättas.`);

  const out: GeminiSchemaNode = { type: mapped };
  if (nullable) out.nullable = true;
  if (node.enum) out.enum = node.enum;
  if (node.description) out.description = node.description;

  if (node.properties) {
    const keys = Object.keys(node.properties);
    const properties: Record<string, GeminiSchemaNode> = {};
    for (const key of keys) properties[key] = toGeminiSchema(node.properties[key]);
    out.properties = properties;
    out.propertyOrdering = keys;
    if (node.required?.length) out.required = node.required;
  }

  if (node.items) out.items = toGeminiSchema(node.items);

  // additionalProperties utelämnas medvetet — Gemini avvisar fältet.
  return out;
}
