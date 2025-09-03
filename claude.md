# AI Governance Navigator

## /init

This is a GenAI-first governance SaaS platform focusing on EU AI Act compliance with real-time LLM/prompt monitoring capabilities.

## Project Structure

- `/product` - Product management, user stories, API specs
- `/engineer` - Full stack implementation, infrastructure
- `/designer` - UI/UX design, frontend components

## Core Objectives

Build an AI governance platform that:
1. Provides automated EU AI Act risk classification
2. Implements real-time prompt/LLM governance
3. Enables cross-functional workflow automation
4. Generates compliance documentation automatically

## Tech Stack

- Frontend: Vite + React + TypeScript + TailwindCSS
- Backend: Node.js + Express/Fastify + TypeScript
- Database: PostgreSQL + Prisma ORM
- Auth: Supabase Auth (SSO/SAML support)
- Deployment: Rancher.io on Azure / Replit for dev

## Market Research (Reference)

- Research is here C:\code\AIGovNav\Reference\AIGovNav - Market Research

## MVP Scope (Stage 0)

1. AI Use-Case Intake & Registry
2. EU AI Act Policy Pack v1
3. RBAC & SSO Integration

## Working Pattern

Each folder represents an autonomous agent:
- Product defines what to build
- Engineer implements the solution
- Designer creates the interface

Start with `/product` to define requirements, then `/engineer` to implement, with `/designer` working in parallel on UI.