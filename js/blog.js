document.addEventListener('DOMContentLoaded', () => {
  const blogListContainer = document.getElementById('blog-list'); // ブログ一覧ページ用のID
  const latestPostsContainer = document.getElementById('latest-posts'); // トップページ用のID
  const blogPostContainer = document.getElementById('blog-post'); // 記事詳細ページ用のID

  const API_KEY = '2XX7HAfdbEskjOaYZugmwdjf3CAw9o87xTM6';
  const SERVICE_DOMAIN = 'mirapoke-site';
  const BASE_URL = 'https://' + SERVICE_DOMAIN + '.microcms.io/api/v1/blogs';

  // 日付をフォーマットする関数
  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  }

  // エラーメッセージを表示するヘルパー関数
  function displayError(container, message) {
    if (container) {
      container.innerHTML = `<p style="color: red; text-align: center;">${message}</p>`;
    }
  }

  // 記事カードを生成する関数
  function createBlogCardHtml(article) {
    const date = formatDate(article.publishedAt || article.createdAt);
    const imageSrc = article.eyecatch ? article.eyecatch.url + '?w=400&h=250&fit=crop' : 'https://via.placeholder.com/400x250?text=No+Image';
    const categoryHtml = article.category ? `<div class="blog-card-category">${article.category.name}</div>` : '';
    
    return `
      <div class="blog-card">
        <a href="blog-post.html?id=${article.id}">
          <div class="blog-card-image">
            <img src="${imageSrc}" alt="アイキャッチ画像">
          </div>
          <div class="blog-card-content">
            <p class="blog-card-date">${date}</p>
            <h3 class="blog-card-title">${article.title}</h3>
            ${categoryHtml}
          </div>
        </a>
      </div>
    `;
  }

  // トップページ：最新記事3件を取得して表示
  if (latestPostsContainer) {
    console.log('トップページ：最新ブログデータの取得を開始します...');
    fetch(BASE_URL + '?limit=3&orders=-publishedAt', {
      headers: {
        'X-MICROCMS-API-KEY': API_KEY
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('トップページ：データ取得成功:', data);
      const articles = data.contents;
      
      if (articles.length === 0) {
        latestPostsContainer.innerHTML = '<p>現在、新しい日記はありません。</p>';
        return;
      }

      let html = '<div style="display:flex; gap:20px; flex-wrap:wrap; justify-content:center;">';
      articles.forEach(article => {
        html += createBlogCardHtml(article);
      });
      html += '</div>';
      
      latestPostsContainer.innerHTML = html;
    })
    .catch(error => {
      console.error('トップページ：ブログ記事の取得に失敗しました:', error);
      displayError(document.getElementById('blog'), '記事の読み込みに失敗しました。' + error.message);
    });
  }

  // ブログ一覧ページ：全記事を取得して表示
  if (blogListContainer) {
    console.log('ブログ一覧ページ：全ブログデータの取得を開始します...');
    fetch(BASE_URL + '?orders=-publishedAt', {
      headers: {
        'X-MICROCMS-API-KEY': API_KEY
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('ブログ一覧ページ：データ取得成功:', data);
      const articles = data.contents;
      
      if (articles.length === 0) {
        blogListContainer.innerHTML = '<p>現在、新しい日記はありません。</p>';
        return;
      }

      let html = '';
      articles.forEach(article => {
        html += createBlogCardHtml(article);
      });
      
      blogListContainer.innerHTML = html;
    })
    .catch(error => {
      console.error('ブログ一覧ページ：ブログ記事の取得に失敗しました:', error);
      displayError(blogListContainer, '記事の読み込みに失敗しました。' + error.message);
    });
  }

  // ブログ記事詳細ページ：個別記事を取得して表示
  if (blogPostContainer) {
    console.log('ブログ詳細ページ：記事詳細データの取得を開始します...');
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
      displayError(blogPostContainer, '記事が見つかりませんでした。');
      return;
    }

    fetch(`${BASE_URL}/${postId}`, {
      headers: {
        'X-MICROCMS-API-KEY': API_KEY
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
    })
    .then(post => {
      console.log('ブログ詳細ページ：データ取得成功:', post);
      document.title = `${post.title} - みらぽけ日記`;

      const date = formatDate(post.publishedAt || post.createdAt);
      const categoryHtml = post.category ? `<div class="blog-post-category">${post.category.name}</div>` : '';

      const html = `
        <h1 class="blog-post-title">${post.title}</h1>
        <p class="blog-post-date">${date}</p>
        ${categoryHtml}
        <div class="blog-post-body">
          ${post.content}
        </div>
      `;

      blogPostContainer.innerHTML = html;
    })
    .catch(error => {
      console.error('ブログ詳細ページ：記事詳細の取得に失敗しました:', error);
      displayError(blogPostContainer, '記事の読み込みに失敗しました。' + error.message);
    });
  }
});