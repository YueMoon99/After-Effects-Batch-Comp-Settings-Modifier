# AE 合成设置批量修改工具 / AE Batch Comp Settings Modifier.

# Scroll down for the English version.

一款轻量开源的 After Effects 脚本，可批量修改合成属性（时长、帧率、尺寸），支持嵌套子合成同步处理。

## 🌟 功能特性
批量修改所选合成、图层及所有嵌套子合成的时长（无限层级）
批量调整多个合成的帧率
批量设置合成分辨率（宽 × 高）
支持撤销（每个操作生成独立撤销组）
兼容 AE 旧版本（无 ES6 语法依赖）
简洁 UI，输入提示清晰
开源免费，支持商业 / 个人使用（禁止转售）

## 📥 安装步骤
从 Releases 页面下载最新版本
将 CompSettingTool v2.0_zh.jsx 复制到 AE 脚本文件夹：
Windows: X:\Program Files\Adobe\Adobe After Effects [版本号]\Support Files\Scripts\ScriptUI Panels\
Mac: 应用程序/Adobe After Effects [版本号]/Scripts/ScriptUI Panels/
重启 After Effects
在 AE 中打开：窗口 > CompSettingTool v2.0_zh.jsx

## 🚀 使用说明
### 1. 修改时长
在项目面板中选中一个或多个需要修改的合成。
输入目标时长，格式严格遵循 时:分:秒:帧（示例：0:00:10:00 表示 25 帧速率下的 10 秒）。
点击按钮（应用时长到所选合成）。
所有选中的合成、合成内的所有图层，以及嵌套的子合成（无限层级）都会自动同步为目标时长。
### 2. 修改帧率
在项目面板中选中需要调整帧率的合成。
输入目标帧率（需为正整数，示例：30 表示 30 帧 / 秒，60 表示 60 帧 / 秒）。
点击按钮（应用帧率到所选合成）。
所有选中合成的帧率将立即更新为设定值。
### 3. 修改合成尺寸
在项目面板中选中需要修改尺寸的合成。
输入目标分辨率，格式为 宽度*高度（示例：1280*720 对应 720P，3840*2160 对应 4K）。
点击按钮（应用尺寸到所选合成）。
所有选中合成的宽度和高度将同步设置为输入值。

## ⚠️ 注意事项
时长格式：严格遵循 时:分:秒:帧 格式（示例：0:01:30:15 表示 1 分 30 秒 15 帧），格式错误会触发报错提示。
提前备份：批量操作前建议备份项目文件，尤其是大型或重要项目，防止意外数据损失。
AE 版本兼容：已在 Adobe After Effects 2020 - 2025 版本中测试兼容；低于 2020 的旧版本请自行验证可用性。

## 📄 开源协议
本项目采用 MIT 许可证开源，附加限制条件：禁止未经作者明确授权，转售本脚本或用于商业获利。

## 👨‍💻 作者信息
博客：yuemoon.vip
GitHub：@YueMoon99
Bug反馈或更多脚本制作建议：我的博客与我联系



# ————————English Intro——————————



# AE Batch Comp Settings Modifier
A lightweight and open-source After Effects script that enables batch modification of composition properties (duration, frame rate, resolution) with support for synchronous processing of nested sub-compositions.

## 🌟 Features
Batch modify the duration of selected comps, layers, and all nested sub-compositions (unlimited depth)
Batch adjust the frame rate of multiple compositions
Batch set composition resolution (width × height)
Undo-friendly (each operation creates an independent undo group)
Compatible with older AE versions (no ES6 syntax dependencies)
Clean UI with clear input hints
Open-source and free for commercial/personal use (resale prohibited)

## 📥 Installation Steps
Download the latest version from the Releases page
Copy CompSettingTool v2.0_zh.jsx to your AE Scripts folder:
Windows: X:\Program Files\Adobe\Adobe After Effects [Version]\Support Files\Scripts\ScriptUI Panels\
Mac: Applications/Adobe After Effects [Version]/Scripts/ScriptUI Panels/
Restart After Effects
Open in AE: Window > CompSettingTool v2.0_zh.jsx

## 🚀 Usage Instructions
### 1. Modify Duration
Select one or more compositions to modify in the Project Panel.
Enter the target duration in the strict format Hours:Minutes:Seconds:Frames (e.g., 0:00:10:00 = 10 seconds at 25fps).
Click the button (Apply Duration to Selected Comps).
All selected compositions, their internal layers, and nested sub-compositions (unlimited depth) will be automatically synced to the target duration.
### 2. Modify Frame Rate
Select the compositions to adjust in the Project Panel.
Enter the target frame rate (must be a positive integer; e.g., 30 = 30fps, 60 = 60fps).
Click the button (Apply Frame Rate to Selected Comps).
The frame rate of all selected compositions will be updated immediately to the set value.
### 3. Modify Composition Size
Select the compositions to resize in the Project Panel.
Enter the target resolution in the format Width*Height (e.g., 1280*720 for 720P, 3840*2160 for 4K).
Click the button (Apply Size to Selected Comps).
The width and height of all selected compositions will be synced to the input values.

## ⚠️ Notes
Duration Format: Strictly follow the Hours:Minutes:Seconds:Frames format (e.g., 0:01:30:15 = 1 minute, 30 seconds, 15 frames). Invalid formats will trigger an error message.
Backup First: It’s recommended to back up your project file before batch operations, especially for large or important projects, to prevent accidental data loss.
AE Version Compatibility: Tested and compatible with Adobe After Effects 2020 - 2025. For versions older than 2020, please verify usability on your own.

## 📄 LicenseThis project is open-source under the MIT License with an additional restriction: Resale or commercial exploitation of this script without explicit permission from the author is prohibited.

## 👨‍💻 Author Information
Blog: yuemoon.vip
GitHub: @YueMoon99
Bug Reports or Script Feature Requests: Contact me via my blog.
