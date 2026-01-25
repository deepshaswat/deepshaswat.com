# @repo/store - State Management Package

Shared Recoil state atoms and static data exports for the deepshaswat.com monorepo.

## Installation

This package is internal to the monorepo and available via workspace imports.

```typescript
import { postState, postMetadataState } from "@repo/store/atoms/post";
import { aboutData } from "@repo/store/data/about";
```

## Exports

### Atoms

| Export Path | Description |
|-------------|-------------|
| `@repo/store/atoms/post` | Post content and metadata state |
| `@repo/store/atoms/tags` | Tags state |
| `@repo/store/atoms/pagination` | Pagination state |
| `@repo/store/atoms/member` | Member state |
| `@repo/store/atoms/ui` | UI state (errors, etc.) |

### Static Data

| Export Path | Description |
|-------------|-------------|
| `@repo/store/data/about` | About page data |
| `@repo/store/data/projects` | Portfolio projects |
| `@repo/store/data/library` | Resource library |
| `@repo/store/data/uses` | Tech stack data |

## Atoms

### Post Atoms (`atoms/post.ts`)

| Atom | Type | Description |
|------|------|-------------|
| `postState` | `PostState` | Current post content (title, content, featureImage, postUrl, tags) |
| `postMetadataState` | `MetadataState` | SEO metadata (title, description, keywords, og, twitter) |
| `postIdState` | `string \| null` | Current post ID |
| `postDataState` | `PostType \| null` | Full post data object |

### Tags Atoms (`atoms/tags.ts`)

| Atom | Type | Description |
|------|------|-------------|
| `tagsState` | `Tag[]` | All available tags |
| `selectedTagsState` | `Tag[]` | Selected tags for current post |

### Pagination Atoms (`atoms/pagination.ts`)

| Atom | Type | Description |
|------|------|-------------|
| `pageNumberState` | `number` | Admin posts pagination page |
| `blogPageNumberState` | `number` | Blog listing pagination page |

### Member Atoms (`atoms/member.ts`)

| Atom | Type | Description |
|------|------|-------------|
| `memberState` | `Member \| null` | Current member data |
| `totalMembersState` | `number` | Total member count |

### UI Atoms (`atoms/ui.ts`)

| Atom | Type | Description |
|------|------|-------------|
| `selectDate` | `Date \| null` | Selected publish date |
| `selectedTimeIst` | `string` | Selected publish time (IST) |
| `errorDuplicateUrlState` | `boolean` | Duplicate URL error flag |
| `savePostErrorState` | `string \| null` | Post save error message |

## Static Data

### About Data (`data/about.ts`)

| Export | Type | Description |
|--------|------|-------------|
| `aboutData` | `AboutData` | Personal bio and information |

### Projects Data (`data/projects.ts`)

| Export | Type | Description |
|--------|------|-------------|
| `projectsData` | `Project[]` | Portfolio project list |

### Library Data (`data/library.ts`)

| Export | Type | Description |
|--------|------|-------------|
| `libraryData` | `LibraryItem[]` | Books, articles, resources |

### Uses Data (`data/uses.ts`)

| Export | Type | Description |
|--------|------|-------------|
| `usesData` | `UsesCategory[]` | Tools and tech stack |

## Usage Examples

### Using Atoms

```typescript
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { postState, postMetadataState } from "@repo/store/atoms/post";

function PostEditor() {
  // Read and write
  const [post, setPost] = useRecoilState(postState);

  // Read only
  const metadata = useRecoilValue(postMetadataState);

  // Write only
  const setMetadata = useSetRecoilState(postMetadataState);

  const updateTitle = (title: string) => {
    setPost(prev => ({ ...prev, title }));
  };

  return (
    <input
      value={post.title}
      onChange={(e) => updateTitle(e.target.value)}
    />
  );
}
```

### Using Static Data

```typescript
import { projectsData } from "@repo/store/data/projects";

function ProjectsPage() {
  return (
    <div>
      {projectsData.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}
```

## RecoilRoot Setup

Ensure `RecoilRoot` wraps your app:

```typescript
import { RecoilRoot } from "recoil";

function App() {
  return (
    <RecoilRoot>
      <YourApp />
    </RecoilRoot>
  );
}
```
