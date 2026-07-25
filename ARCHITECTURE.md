# UNWIND ARCHITECTURE & ENGINEERING SPECIFICATION

## Overview
Unwind is an all-in-one AI client portal and business management engine for freelancers, studios, and agencies. It replaces fragmented tools (CRM, invoicing, e-signatures, client portals, dev tracking, SLA maintenance) with a single unified, multi-tenant workspace.

---

## 1. System Topology & Infrastructure Blueprint

```text
                               ┌──────────────────────────┐
                               │   Next.js 14 Web App     │
                               │      (Vercel Edge)       │
                               └────────────┬─────────────┘
                                            │
                                 Firebase Auth JWT Token
                                            │
                                            ▼
                               ┌──────────────────────────┐
                               │ Fastify AWS Lambda API   │
                               │ (Function URL + Docker)  │
                               └────────────┬─────────────┘
                                            │
       ┌──────────────────┬─────────────────┼──────────────────┬──────────────────┐
       ▼                  ▼                 ▼                  ▼                  ▼
  MongoDB Atlas     Firebase RTDB        AWS S3          Razorpay API         AI Router
 (Multi-Tenant)      (Realtime Chat)    (CloudFront)    (Subs & Invoices)   (OpenAI/Gemini/Groq)
```

---

## 2. Monorepo Structure & Package Responsibilities

```text
unwind/
├── .agents/
│   └── AGENTS.md                  # Workspace AI rules & instructions
├── apps/
│   ├── web/                       # Next.js 14 App Router Frontend
│   └── api/                       # Fastify Node.js AWS Lambda Backend
├── packages/
│   ├── types/                     # Shared TypeScript interfaces & types
│   ├── validation/                # Shared Zod validation schemas
│   ├── ui/                        # Shared Design Tokens & Squircle utilities
│   ├── emails/                    # Resend React Email templates
│   ├── pdf/                       # @react-pdf/renderer document templates
│   ├── ai/                        # Multi-provider AI router & key manager
│   └── eslint-config/             # Shared ESLint configurations
├── ARCHITECTURE.md                # System Architecture & Engineering Spec
├── LLMS.md                        # LLM Reference & Directory Map
└── turbo.json                     # Turborepo Build Pipeline Config
```

---

## 3. Technology Stack Specification

| Subsystem | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router) | Multi-page routing, SSR, static generation, React 18 |
| **Frontend State** | Zustand + TanStack Query v5 | Client state & server state caching |
| **Styling** | Tailwind CSS v3 + Squircle JS | Custom theme tokens, smooth squircle corners |
| **Backend Engine** | Fastify + TypeScript | High-performance API server compiled for AWS Lambda |
| **Containerization** | Docker + Amazon ECR | Portable serverless runtime container |
| **Database** | MongoDB Atlas + Mongoose | Flexible JSON document storage with multi-tenant isolation |
| **Realtime Engine** | Firebase Realtime Database | Instant project chat, presence, typing indicators, live updates |
| **Object Storage** | Amazon S3 + CloudFront | Client files, PDF invoices, signed contract storage |
| **AI Processing** | OpenAI + Gemini + Groq | Quotation drafting, contract clauses, risk analysis, summarization |
| **Payment Gateway** | Razorpay SDK | Subscriptions & agency client invoice payments |
| **Transactional Email**| Resend + React Email | E-signature links, quote notifications, invoices, receipts |
| **Task Scheduler** | EventBridge Scheduler | Invoice reminders, contract expiration, SLA checks, subscription resets |

---

## 4. Security, Multi-Tenancy & Authorization

### Multi-Tenant Isolation
- Every document stored in MongoDB belongs to a specific workspace and includes:
  `workspaceId: ObjectId`, `createdBy: ObjectId`, `createdAt: Date`, `updatedAt: Date`.
- Fastify authentication middleware validates the Firebase ID token and injects `request.user` and `request.workspace`.

### Workspace Roles & Permissions
- `OWNER`: Full administrative, financial, billing, and member access.
- `ADMIN`: Team management, quote approval, project administration.
- `MEMBER`: Work execution, project tasks, deliverable uploads.
- `CLIENT`: Read-only access to client portal, milestone approvals, invoice payment, and contract e-signing.

---

## 5. Deployment & CI/CD Pipeline

```text
GitHub Push (main branch)
       │
       ▼
GitHub Actions Workflow
       ├── Build Docker Image (`apps/api/Dockerfile`)
       ├── Push Image to Amazon ECR
       ├── Update AWS Lambda Function Code
       ├── Update Lambda Environment Variables (Secrets)
       └── Deploy Next.js Web App to Vercel
```
