# reading-list

気になった技術記事のURL置き場。<https://yanagisawahidetoshi.github.io/reading-list/>

## 中身

| ファイル         | 役割                                                     |
| ---------------- | -------------------------------------------------------- |
| `articles.json`  | 記事データ。ここが唯一の情報源                           |
| `filter.js`      | 絞り込みロジック（検索・サイト）                          |
| `filter.test.js` | 上記のテスト。`node --test` で実行（依存パッケージなし） |
| `index.html`     | 表示。ビルド不要、`articles.json` をブラウザから直接読む |

## 記事を足す

`articles.json` の配列に1件足すだけ。日付の降順で並べる。

```json
{
  "url": "https://example.com/article",
  "title": "記事のタイトル",
  "site": "example.com",
  "date": "2026-09-07",
  "tags": ["ai"],
  "note": "後で思い出せる一言"
}
```

入れるのは「覚えておいて」と言われた記事だけ。`note` は空文字でよい。

## 確認

```sh
node --test                   # 絞り込みロジックのテスト
python3 -m http.server 8000   # index.html は fetch を使うのでファイル直開きは不可
```
