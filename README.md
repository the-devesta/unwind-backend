# Unwind Backend — Fastify AWS Lambda Engine & AI Router

High-performance API server and multi-provider AI Engine for Unwind running on AWS Lambda container runtime (Amazon ECR).

## Stack
- **Framework**: Fastify + TypeScript
- **Runtime**: AWS Lambda Container Image (Docker)
- **Database**: MongoDB Atlas (Mongoose)
- **Realtime**: Firebase Realtime Database
- **AI Router**: OpenAI + Google Gemini + Groq multi-provider fallback & key manager
- **Storage**: Amazon S3 + CloudFront (presigned upload URLs)
- **Payments**: Razorpay SDK
- **Transactional Email**: Resend SDK

## Commands
```bash
npm install
npm run dev
npm run build
```
