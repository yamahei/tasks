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
$ bundle exec rake db:migrate
```

テスト※TODO: Rakeタスクになってない
```bash
$ bundle exec rspec spec/lib/biz_spec.rb
```

起動
```bash
bundle exec ruby app.rb
```

## 現状とか今後

[document/phase00.md]を参照
