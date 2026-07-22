const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const SITE_DIR = __dirname;
const CONTENT_DIR = path.join(SITE_DIR, 'content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
const DIST_DIR = path.join(SITE_DIR, 'dist');
const SITE_NAME = 'TDCG';
const SITE_TAGLINE = 'Test-Driven Code Generation — writing software with AI without losing control';
const LINKEDIN_URL = 'https://www.linkedin.com/in/leandrodlb/';
const GITHUB_URL = 'https://github.com/leandrodalbo';
const CONTACT_EMAIL = 'leandro.e.dal.bo@gmail.com';

const parseFrontMatter = (raw) => {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: raw };
  }
  const [, frontMatter, body] = match;
  const data = {};
  frontMatter.split('\n').forEach((line) => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) return;
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    data[key] = value;
  });
  return { data, body };
};

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const postsSidebarHtml = (posts, { linkPrefix }) => `
  <h2>Posts</h2>
  <ul class="posts-sidebar-list">
    ${posts
      .map(
        (post) => `
      <li>
        <a href="${linkPrefix}${post.slug}.html">${post.title}</a>
        <p class="post-date">${formatDate(post.date)}</p>
      </li>
    `,
      )
      .join('\n')}
  </ul>
`;

const page = ({
  title,
  description,
  contentHtml,
  leftSidebarHtml,
  rightSidebarHtml,
  isHome = false,
}) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="stylesheet" href="${isHome ? '' : '../'}assets/style.css" />
</head>
<body>
  <header class="site-header">
    <div class="site-header-inner">
      <a class="site-title" href="${isHome ? '.' : '..'}/index.html">${SITE_NAME}</a>
      <nav>
        <a href="${LINKEDIN_URL}">LinkedIn</a>
        <a href="${GITHUB_URL}">GitHub</a>
        <a href="mailto:${CONTACT_EMAIL}">Email</a>
      </nav>
    </div>
  </header>
  <main class="site-main">
    ${
      leftSidebarHtml || rightSidebarHtml
        ? `<div class="page-layout">
            ${leftSidebarHtml ? `<aside class="page-sidebar page-sidebar-left">${leftSidebarHtml}</aside>` : ''}
            <div class="page-content">${contentHtml}</div>
            ${rightSidebarHtml ? `<aside class="page-sidebar page-sidebar-right">${rightSidebarHtml}</aside>` : ''}
          </div>`
        : `<div class="prose">${contentHtml}</div>`
    }
  </main>
  <footer class="site-footer">
    <div class="site-footer-inner">
      <p>&copy; ${new Date().getFullYear()} ${SITE_NAME}. Built with plain HTML, CSS and markdown.</p>
    </div>
  </footer>
</body>
</html>
`;

const build = () => {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(path.join(DIST_DIR, 'posts'), { recursive: true });
  fs.mkdirSync(path.join(DIST_DIR, 'assets'), { recursive: true });

  fs.copyFileSync(
    path.join(SITE_DIR, 'assets', 'style.css'),
    path.join(DIST_DIR, 'assets', 'style.css'),
  );

  const postFiles = fs.existsSync(POSTS_DIR)
    ? fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith('.md'))
    : [];

  const posts = postFiles.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { data, body } = parseFrontMatter(raw);
    return {
      slug,
      title: data.title || slug,
      date: data.date || '1970-01-01',
      description: data.description || '',
      bodyHtml: marked.parse(body),
    };
  });

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const indexRaw = fs.readFileSync(path.join(CONTENT_DIR, 'index.md'), 'utf8');
  const { data: homeData, body: homeBody } = parseFrontMatter(indexRaw);
  const aboutRaw = fs.readFileSync(path.join(CONTENT_DIR, 'about-sidebar.md'), 'utf8');

  fs.writeFileSync(
    path.join(DIST_DIR, 'index.html'),
    page({
      title: homeData.title || SITE_NAME,
      description: homeData.description || SITE_TAGLINE,
      contentHtml: marked.parse(homeBody),
      leftSidebarHtml: marked.parse(aboutRaw),
      rightSidebarHtml: postsSidebarHtml(posts, { linkPrefix: 'posts/' }),
      isHome: true,
    }),
  );

  posts.forEach((post) => {
    const contentHtml = `
      <article class="post">
        <h1>${post.title}</h1>
        <p class="post-date">${formatDate(post.date)}</p>
        ${post.bodyHtml}
      </article>
    `;
    fs.writeFileSync(
      path.join(DIST_DIR, 'posts', `${post.slug}.html`),
      page({
        title: `${post.title} — ${SITE_NAME}`,
        description: post.description,
        contentHtml,
        leftSidebarHtml: marked.parse(aboutRaw),
        rightSidebarHtml: postsSidebarHtml(posts, { linkPrefix: '' }),
      }),
    );
  });

  console.log(`Built ${posts.length} post(s) into ${DIST_DIR}`);
};

build();
