import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "perpustakaan-digital-desa-jwt-secret-key-2026-super-secure";

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
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  return verifyToken(token);
}
