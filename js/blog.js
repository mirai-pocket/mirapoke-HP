// microCMSのクライアント初期化
const client = microcms.createClient({
  serviceDomain: 'mirapoke-site',
  apiKey: '2XX7HAfdbEskjOaYZugmwdjf3CAw9o87xTM6',
});

// 日付をフォーマットする関数
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

// トップページ：最新記事3件を取得して表示
async function displayLatestPosts() {
  const container = document.getElementById('latest-posts');
  if (!container) return;

  try {
    const data = await client.get({
      endpoint: 'blogs',
      queries: { limit: 3, orders: '-publishedAt' }
    });

    if (data.contents.length === 0) {
      container.innerHTML = '<p>現在、新しい日記はありません。</p>';
      return;
    }

    const html = data.contents.map(post => `
      <div class="blog-card">
        <a href="blog-post.html?id=${post.id}">
          <div class="blog-card-image">
            <img src="${post.eyecatch.url}?w=400&h=250&fit=crop" alt="">
          </div>
          <div class="blog-card-content">
            <p class="blog-card-date">${formatDate(post.publishedAt)}</p>
            <h3 class="blog-card-title">${post.title}</h3>
          </div>
        </a>
      </div>
    `).join('');

    container.innerHTML = html;
  } catch (error) {
    console.error('ブログ記事の取得に失敗しました:', error);
    const section = document.getElementById('blog');
    if(section) section.style.display = 'none';
  }
}


// ブログ一覧ページ：全記事を取得して表示
async function displayAllPosts() {
  const container = document.getElementById('blog-list');
  if (!container) return;

  try {
    const data = await client.get({
      endpoint: 'blogs',
      queries: { orders: '-publishedAt' }
    });
    
    if (data.contents.length === 0) {
      container.innerHTML = '<p>現在、新しい日記はありません。</p>';
      return;
    }

    const html = data.contents.map(post => `
      <div class="blog-card">
        <a href="blog-post.html?id=${post.id}">
          <div class="blog-card-image">
            <img src="${post.eyecatch.url}?w=400&h=250&fit=crop" alt="">
          </div>
          <div class="blog-card-content">
            <p class="blog-card-date">${formatDate(post.publishedAt)}</p>
            <h3 class="blog-card-title">${post.title}</h3>
            <div class="blog-card-category">${post.category.name}</div>
          </div>
        </a>
      </div>
    `).join('');

    container.innerHTML = html;
  } catch (error) {
    console.error('ブログ記事の取得に失敗しました:', error);
    container.innerHTML = '<p>記事の読み込みに失敗しました。時間をおいて再度お試しください。</p>';
  }
}

// ブログ記事詳細ページ：個別記事を取得して表示
async function displayPostDetail() {
  const container = document.getElementById('blog-post');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');

  if (!postId) {
    container.innerHTML = '<p>記事が見つかりませんでした。</p>';
    return;
  }

  try {
    const post = await client.get({
      endpoint: 'blogs',
      contentId: postId,
    });
    
    document.title = `${post.title} - みらぽけ日記`;

    const html = `
      <h1 class="blog-post-title">${post.title}</h1>
      <p class="blog-post-date">${formatDate(post.publishedAt)}</p>
      <div class="blog-post-category">${post.category.name}</div>
      <div class="blog-post-body">
        ${post.content}
      </div>
    `;

    container.innerHTML = html;
  } catch (error) {
    console.error('記事詳細の取得に失敗しました:', error);
    container.innerHTML = '<p>記事の読み込みに失敗しました。時間をおいて再度お試しください。</p>';
  }
}

// 実行判定
// どのページにいるかに応じて、適切な関数を呼び出す
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('latest-posts')) {
    displayLatestPosts();
  }
  if (document.getElementById('blog-list')) {
    displayAllPosts();
  }
  if (document.getElementById('blog-post')) {
    displayPostDetail();
  }
});
