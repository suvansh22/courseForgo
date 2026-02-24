export type HttpError = {
  status: number;
  code?: string;
  message: string;
  details?: string[];
};

const parseJson = (text: string) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export async function fetchJson<T>(
  input: RequestInfo,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    credentials: "include",
  });

  const text = await response.text();
  const data = parseJson(text);

  if (!response.ok) {
    const error: HttpError = {
      status: response.status,
      code: data?.code,
      message: data?.error ?? response.statusText ?? "Request failed.",
      details: data?.details,
    };
    throw error;
  }

  return data as T;
}
