import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET environment variable is required! Set it in your .env file.");
}

export interface JwtPayload {
  userId: string;
  phone: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "30d",
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function getAuthUser(request: Request): JwtPayload | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    return verifyToken(token);
  }

  // Fallback to cookie
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...v] = c.split("=");
        return [key, decodeURIComponent(v.join("="))];
      })
    );
    if (cookies.auth_token) {
      return verifyToken(cookies.auth_token);
    }
  }

  return null;
}
