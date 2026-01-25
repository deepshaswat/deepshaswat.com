# Store Package - Claude Memory

## What This Package Is

The **store package** manages shared state using Recoil atoms. It provides centralized state for posts, metadata, pagination, and UI state across the admin and web apps. Also exports static data for content pages.

## What Has Been Done

### Atoms (`src/atoms/`)

#### Post State (`post.ts`)

- `postState` - Current post content (title, content, featureImage, postUrl, tags)
- `postMetadataState` - SEO metadata (title, description, keywords, og, twitter)
- `postIdState` - Current post ID
- `postDataState` - Full post data object

#### UI State

- `selectDate` - Selected publish date
- `selectedTimeIst` - Selected publish time (IST)
- `errorDuplicateUrlState` - Duplicate URL error flag
- `savePostErrorState` - Post save error message

#### Tags State

- `tagsState` - All available tags
- `selectedTagsState` - Tags selected for current post

#### Pagination State

- `pageNumberState` - Admin posts pagination
- `blogPageNumberState` - Blog listing pagination

#### Member State

- `memberState` - Current member data
- `totalMembersState` - Total member count

### Static Data (`src/data/`)

#### About (`about.ts`)

- Personal bio and information
- Experience and background

#### Projects (`projects.ts`)

- Portfolio project list
- Project descriptions and links

#### Library (`library.ts`)

- Resource collection
- Books, articles, tools

#### Uses (`uses.ts`)

- Tech stack information
- Tools and software used

## Directory Structure

```
packages/store/
├── src/
│   ├── atoms/
│   │   ├── post.ts
│   │   ├── tags.ts
│   │   ├── pagination.ts
│   │   ├── member.ts
│   │   └── ui.ts
│   ├── data/
│   │   ├── about.ts
│   │   ├── projects.ts
│   │   ├── library.ts
│   │   └── uses.ts
│   └── index.ts
└── package.json
```

## Exports

```typescript
// Atoms
import { postState, postMetadataState } from "@repo/store/atoms/post";
import { tagsState, selectedTagsState } from "@repo/store/atoms/tags";
import { pageNumberState } from "@repo/store/atoms/pagination";

// Static data
import { aboutData } from "@repo/store/data/about";
import { projectsData } from "@repo/store/data/projects";
```

## Restrictions

- Recoil atoms must be used within RecoilRoot provider
- Atoms should have sensible defaults
- No async selectors - use server actions instead
- State should be serializable (no functions)

## What Needs To Be Done

- [ ] Add atom effects for persistence
- [ ] Implement state reset utilities
- [ ] Add derived selectors for computed values
- [ ] Create state debugging tools
- [ ] Add state migration utilities
- [ ] Implement undo/redo functionality
- [ ] Add state compression for large content

## Usage Examples

```typescript
import { useRecoilState, useRecoilValue } from "recoil";
import { postState, postMetadataState } from "@repo/store/atoms/post";

// In a component
function PostEditor() {
  const [post, setPost] = useRecoilState(postState);
  const metadata = useRecoilValue(postMetadataState);

  const updateTitle = (title: string) => {
    setPost((prev) => ({ ...prev, title }));
  };
}
```
