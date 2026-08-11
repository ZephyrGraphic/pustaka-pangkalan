import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, any>;
  error?: {
    code: string;
    details?: any;
  };
}

export function apiSuccess<T>(
  data: T,
  message = "Operation successful",
  statusCode = 200,
  meta?: Record<string, any>
) {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };

  return NextResponse.json(response, { status: statusCode });
}

export function apiError(
  message = "An error occurred",
  statusCode = 400,
  errorCode = "BAD_REQUEST",
  details?: any
) {
  const response: ApiResponse = {
    success: false,
    message,
    error: {
      code: errorCode,
      ...(details ? { details } : {}),
    },
  };

  return NextResponse.json(response, { status: statusCode });
}
