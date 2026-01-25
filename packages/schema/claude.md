# Schema Package - Claude Memory

## What This Package Is

The **schema package** provides shared Zod validation schemas and TypeScript type definitions for form validation across the monorepo.

## What Has Been Done

### Contact Schema (`zod/contact-schema.ts`)

Validates contact form submissions:

- `email` - Valid email format
- `name` - Minimum 6 characters
- `message` - Minimum 20 characters

### Tag Schema (`zod/tag-schema.ts`)

Validates tag creation/editing:

- `name` - Tag name validation
- `slug` - URL-safe slug
- `description` - Optional description

### Date/Time Validation (`zod/date-time-validation.ts`)

Utilities for date and time validation:

- `validateDate()` - Date format validation
- `validateTime()` - Time format validation
- `combineDateTimeIST()` - Combine date and time in IST

## Directory Structure

```
packages/schema/
├── src/
│   └── zod/
│       ├── contact-schema.ts
│       ├── tag-schema.ts
│       └── date-time-validation.ts
└── package.json
```

## Exports

```typescript
// Contact form schema
import { contactSchema } from "@repo/schema/zod/contact-schema";

// Tag schema
import { tagSchema } from "@repo/schema/zod/tag-schema";

// Date/time validation
import {
  validateDate,
  combineDateTimeIST,
} from "@repo/schema/zod/date-time-validation";
```

## Restrictions

- All schemas must use Zod
- Schemas should be reusable across client and server
- Error messages should be user-friendly
- No async validation in base schemas

## What Needs To Be Done

- [ ] Add post schema for content validation
- [ ] Add member schema for subscription validation
- [ ] Add author schema for user validation
- [ ] Implement custom error messages
- [ ] Add schema documentation
- [ ] Create schema composition utilities
- [ ] Add internationalization support for error messages

## Usage Examples

```typescript
import { contactSchema } from "@repo/schema/zod/contact-schema";

// Validate form data
const result = contactSchema.safeParse({
  email: "user@example.com",
  name: "John Doe",
  message: "This is a test message that is long enough.",
});

if (!result.success) {
  console.error(result.error.flatten());
}
```
