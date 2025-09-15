# Sitemap Generation

This directory contains scripts for generating sitemaps for the deepshaswat.com
website.

## Sitemap Generation Script

The `generate-sitemaps.ts` script generates sitemap files for the
deepshaswat.com website, specifically for published articles and newsletters.

### What it generates

The script creates a single sitemap file (`sitemap-posts.xml`) that includes:

- All published articles
- All published newsletters
- Proper last modified dates based on publish dates
- SEO-optimized change frequency and priority settings

### How to Use

Run the script using the following command:

```bash
yarn generate-sitemaps
```

This will:

1. Fetch all published articles and newsletters from the database
2. Generate a sitemap file (`sitemap-posts.xml`) containing all posts
3. Place the file in the `public` directory, where it can be served statically

### How it Works

The script:

1. Connects to your database to fetch published posts using
   `fetchPublishedPosts`
2. Separates articles and newsletters into different collections
3. Combines them into a single sitemap with proper XML formatting
4. Sets appropriate metadata for each URL:
   - `loc`: The full URL to the post
   - `lastmod`: The publish date (or current date if not available)
   - `changefreq`: Set to "weekly" for regular content updates
   - `priority`: Set to 0.8 to indicate high importance

### Configuration

The script uses the following configuration:

- **Base URL**: Determined by `NEXT_PUBLIC_APP_URL` environment variable or
  defaults to `https://deepshaswat.com`
- **Output Directory**: `public/` directory in the project root
- **Post URL Format**: Uses the `postUrl` field from each post

### Error Handling

The script includes robust error handling:

- Continues processing even if some posts fail to load
- Logs errors for debugging
- Gracefully handles missing data fields
- Exits with proper status codes

## Next.js Integration

Your Next.js application includes automatic sitemap generation in
`apps/web/app/sitemap.ts` for static routes. This script complements that by
generating dynamic content sitemaps.

## SEO Best Practices

- Submit your sitemap URL (`https://deepshaswat.com/sitemap-posts.xml`) to
  Google Search Console
- Run the script whenever you publish new content or want to update the sitemap
- Monitor crawl errors in Google Search Console to ensure your sitemaps are
  being processed correctly
- Consider setting up automated sitemap generation on content publish for better
  SEO
