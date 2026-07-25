# LLMS.md — AI AGENT & LLM MASTER SYSTEM PROMPT & MAP

> **Welcome to the Unwind Codebase.**
> If you are an AI assistant (Claude, Antigravity, GPT-4, etc.) reading or modifying code in this repository, follow the rules below strictly.

---

## 1. System Philosophy & Objectives
Unwind is an all-in-one AI client portal and business engine for freelancers, studios, and agencies. It automates the 6-stage agency lifecycle:
**Lead → AI Quote → Contract (E-Signature) → Invoice (GST) → Deliverable → SLA Maintenance**.

---

## 2. Key Architecture Rules

### Mandatory Architecture
1. **Monorepo**: Turborepo setup containing `apps/web`, `apps/api`, `packages/types`, `packages/validation`, `packages/ai`, `packages/pdf`, `packages/emails`.
2. **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + TanStack Query + Zustand + Zod + `@squircle-js/react` + `lenis`.
3. **Backend**: Fastify + TypeScript running on AWS Lambda (Docker ECR) + MongoDB Atlas (Mongoose) + Firebase RTDB.
4. **NO Sentry**: Sentry is prohibited. Telemetry is handled by CloudWatch + Pino + PostHog.
5. **Multi-Tenant Isolation**: `workspaceId` must be included in every MongoDB model, query, update, and deletion.

---

## 3. Database Collections & Indexing Scheme

| Collection | Key Fields | Indexes |
| :--- | :--- | :--- |
| `users` | `firebaseUid`, `email`, `name` | `firebaseUid: 1`, `email: 1` |
| `workspaces` | `name`, `slug`, `ownerId`, `planTier` | `slug: 1`, `ownerId: 1` |
| `workspaceMembers` | `workspaceId`, `userId`, `role` | `{ workspaceId: 1, userId: 1 }` |
| `clients` | `workspaceId`, `name`, `email`, `company` | `workspaceId: 1`, `email: 1` |
| `leads` | `workspaceId`, `clientId`, `source`, `status` | `workspaceId: 1`, `status: 1` |
| `projects` | `workspaceId`, `clientId`, `title`, `stage` | `{ workspaceId: 1, clientId: 1 }` |
| `quotations` | `workspaceId`, `publicToken`, `items`, `totalAmount` | `publicToken: 1`, `workspaceId: 1` |
| `contracts` | `workspaceId`, `publicToken`, `signatureData` | `publicToken: 1`, `workspaceId: 1` |
| `invoices` | `workspaceId`, `publicToken`, `razorpayOrderId`, `status` | `publicToken: 1`, `razorpayOrderId: 1` |
| `payments` | `workspaceId`, `invoiceId`, `razorpayPaymentId` | `razorpayPaymentId: 1` |
| `maintenanceContracts` | `workspaceId`, `projectId`, `slaTerms`, `renewalDate` | `{ workspaceId: 1, renewalDate: 1 }` |

---

## 4. Multi-Provider AI Layer & Rotation Logic

All AI calls route through `AIRouter`:

```ts
export interface AIProvider {
  generateText(prompt: string): Promise<string>;
  generateStructured<T>(prompt: string, schema: z.ZodType<T>): Promise<T>;
}
```

- **OpenAI**: Complex structured outputs, quotations, contract drafting, risk analysis.
- **Gemini**: Long document context, portfolio analysis, image understanding.
- **Groq**: Fast chat, summaries, classification, quick updates.

### Key Rotation & Fallback Algorithm:
1. Check key health pool (`requests`, `failures`, `rateLimitUntil`).
2. Select primary healthy key for designated provider.
3. If rate-limited or failed, temporarily disable key for 60 seconds and failover to secondary key or secondary provider (OpenAI → Gemini → Groq).

---

## 5. Security & File Upload Pipeline

- **S3 Upload Flow**:
  1. Web app requests presigned upload URL from `GET /api/v1/files/upload-url?filename=x&type=y`.
  2. Fastify backend verifies Firebase Auth token & workspace membership.
  3. Fastify backend generates AWS S3 presigned PUT URL with 15-minute expiration.
  4. Web app uploads binary directly to S3 via standard `fetch(presignedUrl, { method: 'PUT', body: file })`.
- **CloudFront Delivery**:
  1. Public assets served via CloudFront CDN.
  2. Contracts, invoices, and sensitive client deliverables served via CloudFront Signed URLs with short expiration time.

---

## 6. How to Extend Code in this Repository

When editing or adding new features:
1. Ensure types are defined in `packages/types` or `apps/api/src/modules/<domain>/types.ts`.
2. Define request/response Zod validation schemas in `packages/validation`.
3. Wrap all UI cards, buttons, and panels in `<Squircle cornerRadius={...} cornerSmoothing={0.7} />`.
4. Run `npm run build` or `npx next build` when requested by the user to verify clean compilation.
