# @repo/schema - Validation Schema Package

Shared Zod validation schemas and TypeScript type definitions for the deepshaswat.com monorepo.

## Installation

This package is internal to the monorepo and available via workspace imports.

```typescript
import { contactSchema } from "@repo/schema/zod/contact-schema";
import { tagSchema } from "@repo/schema/zod/tag-schema";
```

## Exports

| Export Path | Description |
|-------------|-------------|
| `@repo/schema/zod/contact-schema` | Contact form validation |
| `@repo/schema/zod/tag-schema` | Tag validation |
| `@repo/schema/zod/date-time-validation` | Date/time utilities |

## Schemas

### Contact Schema (`zod/contact-schema.ts`)

| Field | Type | Validation |
|-------|------|------------|
| `email` | string | Valid email format |
| `name` | string | Minimum 6 characters |
| `message` | string | Minimum 20 characters |

```typescript
import { contactSchema } from "@repo/schema/zod/contact-schema";

const result = contactSchema.safeParse({
  email: "user@example.com",
  name: "John Doe",
  message: "This is a test message that is long enough.",
});
```

### Tag Schema (`zod/tag-schema.ts`)

| Field | Type | Validation |
|-------|------|------------|
| `name` | string | Required |
| `slug` | string | URL-safe format |
| `description` | string | Optional |

```typescript
import { tagSchema } from "@repo/schema/zod/tag-schema";

const result = tagSchema.safeParse({
  name: "Technology",
  slug: "technology",
  description: "Tech-related posts",
});
```

### Date/Time Validation (`zod/date-time-validation.ts`)

| Function | Parameters | Description |
|----------|------------|-------------|
| `validateDate` | `dateString` | Validate date format |
| `validateTime` | `timeString` | Validate time format |
| `combineDateTimeIST` | `date, time` | Combine date and time in IST |

```typescript
import { validateDate, combineDateTimeIST } from "@repo/schema/zod/date-time-validation";

const isValidDate = validateDate("2024-01-15");
const combinedDateTime = combineDateTimeIST("2024-01-15", "14:30");
```

## Usage Examples

### Form Validation

```typescript
import { contactSchema } from "@repo/schema/zod/contact-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm({
  resolver: zodResolver(contactSchema),
});
```

### Server-Side Validation

```typescript
import { contactSchema } from "@repo/schema/zod/contact-schema";

export async function submitContact(formData: FormData) {
  const result = contactSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    message: formData.get("message"),
  });

  if (!result.success) {
    return { error: result.error.flatten() };
  }

  // Process valid data
}
```

## Type Inference

```typescript
import { z } from "zod";
import { contactSchema } from "@repo/schema/zod/contact-schema";

type ContactFormData = z.infer<typeof contactSchema>;
// { email: string; name: string; message: string }
```
