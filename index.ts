import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { z, ZodObject, ZodRawShape } from "zod";

export const withSchema = <S extends ZodRawShape>(
  schema: ZodObject<S>,
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    data: z.infer<typeof schema>
  ) => Promise<void>,
  bodyType: "POST" | "GET" = "POST"
) => {
  const middleHandler: NextApiHandler = async (req, res) => {
    const body = bodyType === "POST" ? req.body : req.query;

    try {
      const parsedSchema = schema.parse(body);

      await handler(req, res, parsedSchema);
    } catch (e) {
      res.status(503).json({
        success: false,
        e: "schema_failed",
      });
    }
  };

  return middleHandler;
};