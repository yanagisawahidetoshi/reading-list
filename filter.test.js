import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { filterArticles } from './filter.js';

const article = (over = {}) => ({
  url: 'https://example.com/a',
  title: 'サンプル記事',
  site: 'example.com',
  date: '2026-09-01',
  tags: [],
  note: '',
  ...over,
});

describe('filterArticles', () => {
  describe('given no criteria', () => {
    describe('when filtering', () => {
      it('then should return every article in the original order', () => {
        // Given
        const articles = [article({ url: 'a' }), article({ url: 'b' })];

        // When
        const result = filterArticles(articles, {});

        // Then
        assert.deepEqual(
          result.map((a) => a.url),
          ['a', 'b'],
        );
      });
    });
  });

  describe('given articles with different titles', () => {
    describe('when filtering by a query that matches one title', () => {
      it('then should return only the matching article', () => {
        // Given
        const articles = [article({ title: 'Kubernetes入門' }), article({ title: 'Rails入門' })];

        // When
        const result = filterArticles(articles, { query: 'kubernetes' });

        // Then
        assert.equal(result.length, 1);
        assert.equal(result[0].title, 'Kubernetes入門');
      });
    });

    describe('when filtering by a query in a different case', () => {
      it('then should still match case-insensitively', () => {
        // Given
        const articles = [article({ title: 'GitHub Actions' })];

        // When
        const result = filterArticles(articles, { query: 'GITHUB' });

        // Then
        assert.equal(result.length, 1);
      });
    });

    describe('when filtering by a query that matches nothing', () => {
      it('then should return an empty array', () => {
        // Given
        const articles = [article({ title: 'Rails入門' })];

        // When
        const result = filterArticles(articles, { query: 'kubernetes' });

        // Then
        assert.deepEqual(result, []);
      });
    });
  });

  describe('given a query matching fields other than the title', () => {
    describe('when the query appears in the url', () => {
      it('then should return the article', () => {
        // Given
        const articles = [article({ title: '無題', url: 'https://zenn.dev/foo/articles/bar' })];

        // When
        const result = filterArticles(articles, { query: 'zenn' });

        // Then
        assert.equal(result.length, 1);
      });
    });

    describe('when the query appears in a tag', () => {
      it('then should return the article', () => {
        // Given
        const articles = [article({ title: '無題', tags: ['ai', 'review'] })];

        // When
        const result = filterArticles(articles, { query: 'review' });

        // Then
        assert.equal(result.length, 1);
      });
    });

    describe('when the query appears in the note', () => {
      it('then should return the article', () => {
        // Given
        const articles = [article({ title: '無題', note: 'ループエンジニアリングの出口側' })];

        // When
        const result = filterArticles(articles, { query: '出口' });

        // Then
        assert.equal(result.length, 1);
      });
    });
  });

  describe('given articles from several sites', () => {
    describe('when filtering by one site', () => {
      it('then should return only articles from that site', () => {
        // Given
        const articles = [article({ site: 'zenn.dev' }), article({ site: 'qiita.com' })];

        // When
        const result = filterArticles(articles, { site: 'zenn.dev' });

        // Then
        assert.equal(result.length, 1);
        assert.equal(result[0].site, 'zenn.dev');
      });
    });
  });

  describe('given criteria combined together', () => {
    describe('when a query and a site are both applied', () => {
      it('then should return only articles satisfying both', () => {
        // Given
        const articles = [
          article({ url: 'hit', title: 'AIレビュー', site: 'zenn.dev' }),
          article({ url: 'other-site', title: 'AIレビュー', site: 'qiita.com' }),
          article({ url: 'other-title', title: 'Kubernetes入門', site: 'zenn.dev' }),
        ];

        // When
        const result = filterArticles(articles, { query: 'レビュー', site: 'zenn.dev' });

        // Then
        assert.deepEqual(
          result.map((a) => a.url),
          ['hit'],
        );
      });
    });
  });

  describe('given a query padded with whitespace', () => {
    describe('when filtering', () => {
      it('then should ignore the surrounding whitespace', () => {
        // Given
        const articles = [article({ title: 'Kubernetes入門' })];

        // When
        const result = filterArticles(articles, { query: '  kubernetes  ' });

        // Then
        assert.equal(result.length, 1);
      });
    });
  });
});
