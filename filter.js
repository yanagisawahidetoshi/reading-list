// 記事リストの絞り込み。ブラウザとテストの両方から読むので DOM には触らない。
const haystack = (article) =>
  [article.title, article.url, article.note, ...(article.tags ?? [])].join(' ').toLowerCase();

export const filterArticles = (articles, { query = '', site = '', savedOnly = false } = {}) => {
  const needle = query.trim().toLowerCase();

  return articles.filter((article) => {
    if (savedOnly && !article.saved) return false;
    if (site && article.site !== site) return false;
    if (needle && !haystack(article).includes(needle)) return false;
    return true;
  });
};
