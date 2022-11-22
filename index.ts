import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { z, ZodObject, ZodRawShape } from "zod";

export const withSchema = <S extends ZodRawShape>(
  schema: ZodObject<S>,
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    data: z.infer<typeof schema>
  ) => Promise<void>,
  bodyType: "POST" | "GET" | "auto" = "auto",
  options: {
    debug?: boolean;
    throwErrors?: boolean;
  } = {}
) => {
  const middleHandler: NextApiHandler = async (req: NextApiRequest, res) => {
    let actualBodyTypeToUse: "POST" | "GET";

    if (bodyType === "auto") {
      const tryBodyType = req.method?.toUpperCase();
      if (tryBodyType === "POST" || tryBodyType === "GET") {
        actualBodyTypeToUse = tryBodyType;
      } else {
        throw new Error("Invalid Method [type=auto]");
      }
    } else {
      actualBodyTypeToUse = bodyType;
    }

    const body = actualBodyTypeToUse === "POST" ? req.body : req.query;

    if (options.debug) {
      console.log("withSchema BODY =>", body);
    }

    try {
      const parsedSchema = schema.parse(body);

      await handler(req, res, parsedSchema);
    } catch (e) {
      if (options.throwErrors) {
        throw e;
      }

      res.status(503).json({
        success: false,
        e: options.debug ? e : "schema_failed",
      });
    }
  };

  return middleHandler;
};
