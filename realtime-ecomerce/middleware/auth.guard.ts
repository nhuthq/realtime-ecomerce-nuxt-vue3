import { getHeader, createError, H3Event } from "h3";
import { verifyToken } from "../utils/generate-jwt-token";

export async function authGuard(event: H3Event) {
  const authHeader = getHeader(event, "authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verifyTokenData = await verifyToken(token);

    if (verifyTokenData?.message === "invalid_token") {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    } else {
      (event.context as any).user = verifyTokenData;
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
}
