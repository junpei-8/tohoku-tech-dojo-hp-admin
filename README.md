# 東北 TECH 道場 ホームページ管理画面

- URL： https://tohoku-tech-dojo-hp-admin.web.app

## Rust（WASM）

＊ Makefile にコマンドはまとめたい

### セットアップ

```
rustup target add wasm32-unknown-unknown
```

### ビルド

```
wasm-pack build --release --target no-modules
```
