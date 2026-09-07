import { filterArticles } from './filter.js';

const els = {
  query: document.getElementById('query'),
  sites: document.getElementById('sites'),
  list: document.getElementById('list'),
  count: document.getElementById('count'),
  empty: document.getElementById('empty'),
};

const state = { query: '', site: '' };

let articles = [];

const formatDate = (date) => date.replaceAll('-', '/').slice(5);

const render = () => {
  const shown = filterArticles(articles, state);

  els.count.textContent = `${shown.length} / ${articles.length} 件`;
  els.empty.hidden = shown.length > 0;
  els.list.replaceChildren(
    ...shown.map((article) => {
      const item = document.createElement('li');
      item.className = 'item';

      const link = document.createElement('a');
      link.className = 'link';
      link.href = article.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = article.title;

      const bar = document.createElement('p');
      bar.className = 'meta';
      bar.textContent = `${formatDate(article.date)} · ${article.site}`;

      item.append(link, bar);

      if (article.note) {
        const note = document.createElement('p');
        note.className = 'note';
        note.textContent = article.note;
        item.append(note);
      }

      return item;
    }),
  );
};

const chip = (label, isActive, onClick) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'chip';
  button.textContent = label;
  button.setAttribute('aria-pressed', String(isActive));
  button.addEventListener('click', onClick);
  return button;
};

const renderChips = () => {
  const sites = [...new Set(articles.map((article) => article.site))].sort();

  els.sites.replaceChildren(
    chip('すべて', !state.site, () => {
      state.site = '';
      renderChips();
      render();
    }),
    ...sites.map((site) =>
      chip(site, state.site === site, () => {
        state.site = state.site === site ? '' : site;
        renderChips();
        render();
      }),
    ),
  );
};

els.query.addEventListener('input', (event) => {
  state.query = event.target.value;
  render();
});

const response = await fetch('./articles.json');
articles = await response.json();
renderChips();
render();
