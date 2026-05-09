# Timecard BI PoC

> This is a small mobile-friendly PWA-oriented PoC.

スマートフォンでも利用しやすい、勤怠CSVの集計・可視化を行うブラウザ完結型のBI PoCです。

CSVファイルを読み込み、日別の労働時間をグラフと明細テーブルで確認できます。  
サーバーサイドを使わず、HTML / CSS / JavaScript のみで動作します。

## Demo

公開版はこちらです。

https://salixgy.widget.jp/apps/timecard-bi/

Note: 公開版ではサイト共通の footer / app-action parts を読み込んでいます。  
GitHub掲載版では、単体のPoCとして確認しやすいように footer を `index.html` 内へ直接記述しています。

## Features

* 勤怠CSVの読み込み
* サンプルCSVのダウンロード
* 日別労働時間の集計
* 合計労働時間の表示
* 月別フィルタ
* Chart.js による棒グラフ表示
* 明細テーブル表示
* スマートフォン向けの responsive layout
* touch-friendly な操作ボタン
* Web App Manifest 対応
* Service Worker 登録
* PWA を意識した構成

## Mobile / PWA Support

このアプリは、スマートフォンのブラウザから利用することを想定して実装しています。

* mobile browser 向けの viewport 設定
* smartphone screen 向けの responsive layout
* 600px以下でのレイアウト切り替え
* touch-friendly なボタン・フォーム配置
* 明細テーブルの horizontal scroll 対応
* theme-color によるモバイルブラウザUI対応
* Web App Manifest の設定
* Service Worker の登録
* backend server なしでスマートフォン上から利用可能

## Tech Stack

* HTML
* CSS
* JavaScript
* Chart.js
* Web App Manifest
* Service Worker

## File Structure

```text
timecard-bi/
├── index.html
├── style.css
├── app.js
├── sample.csv
├── manifest.json
├── sw.js
└── icons/
```

## CSV Format

以下のようなCSV形式を想定しています。

```csv
date,start,end,break
2026-05-01,09:00,18:00,60
2026-05-02,10:00,17:30,45
```

| column  | description |
| ------- | ----------- |
| `date`  | 勤務日         |
| `start` | 出勤時刻        |
| `end`   | 退勤時刻        |
| `break` | 休憩時間（分）     |

## Implementation Notes

このPoCでは、ブラウザ内でCSVを読み込み、JavaScriptでデータを整形・集計しています。

主な処理は以下です。

* CSVテキストのパース
* 労働時間の分単位計算
* 月別データの抽出
* 合計労働時間の算出
* Chart.js のデータ更新
* 明細テーブルのDOM生成
* ファイル選択によるCSV再読み込み
* 画面幅に応じたレスポンシブUI切り替え

## Design Intent

このアプリは、勤怠データをスマートフォンから素早く確認するための小規模BIツールとして作成しました。

特に以下を意識しています。

* スマートフォンでの閲覧・操作
* タップしやすいUI
* サーバー不要のローカルCSV処理
* 小規模な業務データの即時可視化
* PWA化を見据えたファイル構成

## Current Limitations

現在はPoCのため、以下は簡易実装です。

* CSVパースはシンプルなカンマ区切り前提
* 日跨ぎ勤務には未対応
* 入力値の詳細バリデーションは未実装
* エラー表示UIは簡易的
* データ保存機能は未実装

## Future Improvements

* CSVバリデーションの追加
* エラー表示UIの改善
* 日跨ぎ勤務への対応
* ローカル保存対応
* グラフ表示の改善
* テストコード追加
* PWAとしてのオフライン対応強化
