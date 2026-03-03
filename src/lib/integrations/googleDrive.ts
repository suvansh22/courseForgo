import crypto from "node:crypto";

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3";

type ServiceAccountCredentials = {
  clientEmail: string;
  privateKey: string;
};

const base64UrlEncode = (input: string) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const getServiceAccountCredentials = (): ServiceAccountCredentials => {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!clientEmail || !privateKeyRaw) {
    throw new Error(
      "Missing GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.",
    );
  }

  return {
    clientEmail,
    privateKey: privateKeyRaw.replace(/\\n/g, "\n"),
  };
};

const signJwt = ({
  clientEmail,
  privateKey,
}: ServiceAccountCredentials): string => {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: clientEmail,
    scope: DRIVE_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createSign("RSA-SHA256")
    .update(unsignedToken)
    .sign(privateKey, "base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${unsignedToken}.${signature}`;
};

const getAccessToken = async (): Promise<string> => {
  const jwt = signJwt(getServiceAccountCredentials());

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to get Google OAuth token: ${response.status} ${text}`,
    );
  }

  const json = (await response.json()) as { access_token?: string };
  if (!json.access_token) {
    throw new Error("Google OAuth response missing access_token.");
  }

  return json.access_token;
};

export const grantDriveReadAccess = async ({
  assetId,
  email,
}: {
  assetId: string;
  email: string;
}) => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${DRIVE_API_BASE}/files/${encodeURIComponent(assetId)}/permissions?supportsAllDrives=true&sendNotificationEmail=true`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "user",
        role: "reader",
        emailAddress: email,
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to grant Drive read permission: ${response.status} ${text}`,
    );
  }

  return (await response.json()) as { id?: string };
};

type DownloadLinkResult = {
  assetId: string;
  fileName: string | null;
  mimeType: string | null;
  downloadLink: string | null;
  webViewLink: string | null;
};

export const generateDriveDownloadLink = async ({
  assetId,
  email,
  ensureReadAccess = true,
}: {
  assetId: string;
  email: string;
  ensureReadAccess?: boolean;
}): Promise<DownloadLinkResult> => {
  const accessToken = await getAccessToken();

  if (ensureReadAccess) {
    await grantDriveReadAccess({ assetId, email });
  }

  const fields = "id,name,mimeType,webViewLink,webContentLink";
  const response = await fetch(
    `${DRIVE_API_BASE}/files/${encodeURIComponent(assetId)}?supportsAllDrives=true&fields=${encodeURIComponent(fields)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to fetch Drive file metadata: ${response.status} ${text}`,
    );
  }

  const file = (await response.json()) as {
    id: string;
    name?: string;
    mimeType?: string;
    webViewLink?: string;
    webContentLink?: string;
  };
  const isGoogleNative = String(file.mimeType || "").startsWith(
    "application/vnd.google-apps.",
  );
  const fallbackDownloadLink = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(assetId)}`;

  return {
    assetId: file.id,
    fileName: file.name ?? null,
    mimeType: file.mimeType ?? null,
    downloadLink: isGoogleNative
      ? null
      : (file.webContentLink ?? fallbackDownloadLink),
    webViewLink: file.webViewLink ?? null,
  };
};
