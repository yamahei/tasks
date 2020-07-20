# tasks

自分用にチーム全員の稼働管理ができるツールを作りました。

## 動かし方

インストール
```bash
$ bundle install
```

DB作成
```bash
$ psql -c "CREATE DATABASE tasks"
$ psql tasks < "ddl/ddl_v00.sql"
```

テスト※まだ書いてない→[lib/test.rb]を参照
```bash
$ #bundle exec rspec spec/lib/biz_spec.rb
```

起動
```bash
bundle exec ruby app.rb
```

## 現状とか今後

[doc/phase00.md]を参照
