---
name: OpenAPI Zod compatibility
description: Generated OpenAPI validators must remain compatible with the workspace's Zod 3 runtime.
---

Avoid relying on generated Zod 4-only scalar helpers in this workspace. The OpenAPI generator can emit helpers such as `zod.email()` and `zod.int()` even though the installed Zod runtime does not provide them.

**Why:** Code generation can appear successful but the chained library typecheck fails because Zod 3 does not expose those APIs.

**How to apply:** After changing the OpenAPI spec, run the normal codegen command and inspect generated validators when adding formatted strings or integer scalars. Until the runtime is upgraded, use compatible scalar schemas and perform any extra boundary validation in the route handler.

Date formats need the same boundary care: generated `zod.coerce.date()` accepts date-times and normalizes impossible calendar values. When a date-only string must be preserved exactly, validate the raw `YYYY-MM-DD` value and calendar round-trip before using it.