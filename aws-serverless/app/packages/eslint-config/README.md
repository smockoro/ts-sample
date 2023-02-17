# eslintrcファイルの共通化

公式を参考に作成。

https://eslint.org/docs/latest/extend/shareable-configs

## わかったこと

共通定義をnpmのパッケージとして作成して共通化する。

パッケージの仕方は2択有る。

1. 一般的な公開しているパッケージと同様、パッケージ作成してnpmパッケージに公開する。
2. npmのworkspace機能を利用して、同一リポジトリ内にnpmパッケージが有るようにして、シンボリックリンクで取るようにする。

いずれもnpmパッケージにするが、この時パッケージ名は一定のルールに従う必要がある。

また、作成する定義ファイルも`.js`にしたほうが良さそう。

## npmパッケージで公開

`package.json`でパッケージ名を指定。
また、パッケージ名と同様のディレクトリ名にして置く。

後述の作成方法で公開するパッケージ内容を作成する。

パッケージとしてgithub packages等に公開する。

共通定義を利用する側は、`node_modules`に入れるために、`package.json`の`devDependencies`等に公開したパッケージの情報を記載する。

ほいで`npm install`して、`.eslintrc.js`で`extends`で指定する。

## workspace内のパッケージで公開

npmのworkspace機能を利用して、同一リポジトリ内で別workspaceで共通定義を管理する。

共通定義利用側は`package.json`内の`workspaces`と`devDependencies`にパッケージ情報を記載して`npm install`する。

各別のworkspaceの`.eslintrc.js`の`extends`で指定する。

## 作るパッケージのルール

まずパッケージ名は、以下にする必要がある。

- `eslint-config-`を接頭辞に持つパッケージ名
- `@scope/eslint-config`の形にパッケージ名をする。（`@scope`は自分の思う影響範囲スコープ）

また定義ファイルは`index.js`にしておくのが良さそう。

これを踏まえると、パッケージ内の構成は以下の感じになる。

```bash

./eslint-config-myconfig
 |
 |- package.json  # package名は、eslint-config-myconfig or @scope/eslint-configのいずれか。
 `- index.js      # .eslintrc.jsに記載する内容を入れる。ここが共通定義本体
```

共通定義を更に階層化して提供することもできる。

これはまだやっていない。
