# Recitation Counter · 念诵记

A lightweight, account-free Progressive Web App (PWA) for personal daily recitation tracking.

Recitation Counter is designed for simple and private record-keeping across different scriptures and dates. Records with the same scripture and date are automatically accumulated, while entries from different dates remain available as separate history records.

## Features

- Scripture- and date-based recitation tracking
- Same-day count accumulation
- History views and summary statistics
- Local-first data storage
- Data import and export for backup and transfer
- Offline caching
- Home-screen installation as a PWA
- No account required

## Product Design

The product was designed around a simple principle: **daily tracking should require as little friction as possible**.

Users can record recitation counts without creating an account or connecting to a cloud service. Data is stored locally on the device, allowing the core experience to remain lightweight and private.

The current version focuses on:

- Fast daily recording
- Persistent local records
- Simple history review
- Account-free usage
- Mobile-friendly interaction

## Technical Implementation

The project is implemented as a lightweight web application with PWA capabilities.

Key implementation areas include:

- **Local storage** for persistent on-device data
- **Import / export** for manual backup and cross-device transfer
- **Offline caching** for continued use without a network connection
- **PWA installation** for a standalone, app-like experience on supported devices

## Privacy & Data

All recitation records are stored locally on the user's device by default.

The application does not require an account or cloud backend. Users can move their records between devices using the built-in export and import functions.

Automatic multi-device synchronization is not included in the current version.

## Running Locally

### macOS / Desktop

Open `index.html` in a browser for basic use.

For full PWA and offline functionality, serve the project through a local or static web server.

### iPhone / iPad

After deploying the project to a static web host:

1. Open the website in Safari.
2. Tap **Share**.
3. Select **Add to Home Screen**.
4. Launch Recitation Counter from the home screen as a standalone PWA.

## Current Scope

This is a personal project focused on lightweight daily tracking, local-first data storage, and a simple mobile experience.

Possible future improvements include optional cloud synchronization and enhanced cross-device support.

---

**中文简介**

念诵记是一个无需账号的个人念诵计数 PWA。相同“经典名称 + 日期”的记录会自动累加，不同日期则保留为独立明细。

当前版本的数据默认保存在本地设备中，并支持导入 / 导出备份、离线使用和添加到主屏幕。
