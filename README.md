# CourseForgo (Next.js + Cloudflare D1 + Drizzle + OpenNext)

## Stack
- Next.js 16 (App Router)
- Auth: `next-auth`
- Database: Cloudflare D1
- ORM: Drizzle
- Deployment target: Cloudflare Workers via `@opennextjs/cloudflare`

## Run Locally
```bash
yarn dev
```

App URL: `http://localhost:3000`

## API Overview

### Base URL
- Local: `http://localhost:3000`

### Auth
- Protected routes require a valid `next-auth` session cookie.
- Unauthorized requests return:
```json
{
  "code": "UNAUTHORIZED",
  "error": "Unauthorized"
}
```

### Standard Error Response
All protected JSON APIs use:
```json
{
  "code": "VALIDATION_FAILED",
  "error": "Validation failed.",
  "details": ["field is required"]
}
```

## Endpoints

### Health

#### `GET /api`
Response `200` (text/plain):
```txt
Hello, World!
```

### Auth Route (NextAuth)

#### `GET /api/auth/[...nextauth]`
#### `POST /api/auth/[...nextauth]`
Handled by NextAuth internals.

### Courses

#### `GET /api/courses` (protected)
Response `200`:
```json
{
  "courses": [
    {
      "id": "nextjs-full-stack-development",
      "title": "Next.js Full Stack Development",
      "description": "Learn Next.js App Router...",
      "originalPrice": 2499,
      "discountedPrice": 1799,
      "thumbnailUrl": "/placeholder.jpg",
      "pdfAssetId": "nextjs-full-stack-development-pdf",
      "isActive": true,
      "createdAt": "2026-02-20T18:00:00.000Z",
      "updatedAt": "2026-02-20T18:00:00.000Z"
    }
  ]
}
```

#### `POST /api/courses` (protected)
Request:
```json
{
  "id": "nextjs-full-stack-development",
  "title": "Next.js Full Stack Development",
  "description": "Learn Next.js App Router...",
  "originalPrice": 2499,
  "discountedPrice": 1799,
  "thumbnailUrl": "/placeholder.jpg",
  "isActive": true,
  "pdfAsset": {
    "id": "nextjs-full-stack-development-pdf",
    "storageKey": "pdfs/nextjs-full-stack-development.pdf",
    "originalName": "nextjs-full-stack-development.pdf",
    "sizeBytes": 3456789,
    "mimeType": "application/pdf",
    "checksum": "sha256:...",
    "pages": 120
  }
}
```
Response `201`:
```json
{
  "course": {
    "id": "nextjs-full-stack-development",
    "title": "Next.js Full Stack Development",
    "description": "Learn Next.js App Router...",
    "originalPrice": 2499,
    "discountedPrice": 1799,
    "thumbnailUrl": "/placeholder.jpg",
    "pdfAssetId": "nextjs-full-stack-development-pdf",
    "isActive": true,
    "createdAt": "2026-02-20T18:00:00.000Z",
    "updatedAt": "2026-02-20T18:00:00.000Z"
  }
}
```

#### `GET /api/courses/:courseId` (protected)
Response `200`:
```json
{
  "course": {
    "id": "nextjs-full-stack-development",
    "title": "Next.js Full Stack Development",
    "description": "Learn Next.js App Router...",
    "originalPrice": 2499,
    "discountedPrice": 1799,
    "thumbnailUrl": "/placeholder.jpg",
    "pdfAssetId": "nextjs-full-stack-development-pdf",
    "isActive": true,
    "createdAt": "2026-02-20T18:00:00.000Z",
    "updatedAt": "2026-02-20T18:00:00.000Z"
  }
}
```

#### `PUT /api/courses/:courseId` (protected)
Request:
```json
{
  "title": "Updated title",
  "discountedPrice": 1599,
  "pdfAsset": {
    "storageKey": "pdfs/new-file.pdf",
    "originalName": "new-file.pdf",
    "sizeBytes": 4567890
  }
}
```
Response `200`:
```json
{
  "course": {
    "id": "nextjs-full-stack-development",
    "title": "Updated title",
    "description": "Learn Next.js App Router...",
    "originalPrice": 2499,
    "discountedPrice": 1599,
    "thumbnailUrl": "/placeholder.jpg",
    "pdfAssetId": "nextjs-full-stack-development-pdf",
    "isActive": true,
    "createdAt": "2026-02-20T18:00:00.000Z",
    "updatedAt": "2026-02-20T18:05:00.000Z"
  }
}
```

#### `DELETE /api/courses/:courseId` (protected)
Response `200`:
```json
{
  "course": {
    "id": "nextjs-full-stack-development",
    "title": "Updated title",
    "description": "Learn Next.js App Router...",
    "originalPrice": 2499,
    "discountedPrice": 1599,
    "thumbnailUrl": "/placeholder.jpg",
    "pdfAssetId": "nextjs-full-stack-development-pdf",
    "isActive": true,
    "createdAt": "2026-02-20T18:00:00.000Z",
    "updatedAt": "2026-02-20T18:05:00.000Z"
  }
}
```

### Admin Users

#### `GET /api/admin/users` (protected)
Response `200`:
```json
{
  "users": [
    {
      "id": "user_123",
      "email": "user@example.com",
      "createdAt": "2026-02-20T18:00:00.000Z",
      "updatedAt": "2026-02-20T18:00:00.000Z"
    }
  ]
}
```

#### `POST /api/admin/users` (protected)
Request:
```json
{
  "id": "user_123",
  "email": "user@example.com"
}
```
Response `201`:
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "createdAt": "2026-02-20T18:00:00.000Z",
    "updatedAt": "2026-02-20T18:00:00.000Z"
  }
}
```

### Admin Purchases

#### `GET /api/admin/purchases` (protected)
Response `200`:
```json
{
  "purchases": [
    {
      "id": "purchase_123",
      "userId": "user_123",
      "courseId": "nextjs-full-stack-development",
      "purchasedAt": "2026-02-20T18:10:00.000Z"
    }
  ]
}
```

#### `POST /api/admin/purchases` (protected)
Request:
```json
{
  "id": "purchase_123",
  "userId": "user_123",
  "courseId": "nextjs-full-stack-development"
}
```
Response `201`:
```json
{
  "purchase": {
    "id": "purchase_123",
    "userId": "user_123",
    "courseId": "nextjs-full-stack-development",
    "purchasedAt": "2026-02-20T18:10:00.000Z"
  }
}
```

## Error Codes (Frontend Reference)

| HTTP Status | `code` | Meaning |
|---|---|---|
| 400 | `BAD_REQUEST` | Malformed request (e.g. invalid JSON/body mismatch). |
| 400 | `VALIDATION_FAILED` | Request payload failed validation (`details` populated). |
| 401 | `UNAUTHORIZED` | Missing/invalid session. |
| 404 | `NOT_FOUND` | Requested resource does not exist. |
| 409 | `CONFLICT` | Duplicate/conflicting entity (already exists). |
| 503 | `DATABASE_NOT_CONFIGURED` | D1 binding `DB` missing in environment. |
| 500 | `INTERNAL_ERROR` | Unexpected server-side failure. |

## Drizzle + Wrangler Workflow

### 1. Install dependencies
```bash
yarn add drizzle-orm @opennextjs/cloudflare
yarn add -D drizzle-kit wrangler @cloudflare/workers-types
```

### 2. Key project files
- Drizzle schema: `src/lib/db/schema.ts`
- Drizzle config: `drizzle.config.ts`
- D1/Worker config: `wrangler.jsonc`
- DB client: `src/lib/db/d1.ts`

### 3. Create D1 databases
```bash
yarn wrangler login
yarn wrangler d1 create courseforgo-prod
yarn wrangler d1 create courseforgo-preview
```

Then update `wrangler.jsonc`:
- `database_id`
- `preview_database_id`

### 4. Generate migrations
```bash
yarn db:generate
```

### 5. Apply migrations
```bash
yarn wrangler d1 migrations apply courseforgo-prod --local
yarn wrangler d1 migrations apply courseforgo-prod --remote
```

### 6. Generate Cloudflare env types
```bash
yarn wrangler types
```

### 7. Build/preview/deploy with OpenNext
```bash
yarn cf:build
yarn cf:preview
yarn cf:deploy
```

## Scripts
```bash
yarn dev
yarn build
yarn start
yarn lint
yarn db:generate
yarn db:studio
yarn cf:build
yarn cf:preview
yarn cf:deploy
```
