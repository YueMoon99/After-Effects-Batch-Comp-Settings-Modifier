# AE 合成设置批量修改工具 / AE Batch Comp Settings Modifier.
## Scroll down for English introduction.
<img width="320" height="388" alt="QQ20251121-160210" src="https://github.com/user-attachments/assets/e657166e-0bdf-41bb-8f19-f1112457b565" /><br>
一款轻量开源的 After Effects 脚本，可批量修改合成属性（时长、帧率、尺寸），支持嵌套子合成同步处理。
## 🌟 功能特性
批量修改所选合成、图层及所有嵌套子合成的时长（无限层级）<br>
批量调整多个合成的帧率<br>
批量设置合成分辨率（宽 × 高）<br>
支持撤销（每个操作生成独立撤销组）<br>
兼容 AE 旧版本（无 ES6 语法依赖）<br>
简洁 UI，输入提示清晰<br>
开源免费，支持商业 / 个人使用（禁止转售）<br>

## 📥 安装步骤
从 Releases 页面下载最新版本<br>
将 CompSettingTool v2.0_zh.jsx 复制到 AE 脚本文件夹：<br>
Windows: X:\Program Files\Adobe\Adobe After Effects [版本号]\Support Files\Scripts\ScriptUI Panels\ <br>
Mac: 应用程序/Adobe After Effects [版本号]/Scripts/ScriptUI Panels/<br>
重启 After Effects<br>
在 AE 中打开：窗口 > CompSettingTool v2.0_zh.jsx<br>

## 🚀 使用说明
### 1. 修改时长
在项目面板中选中一个或多个需要修改的合成。<br>
输入目标时长，格式严格遵循 时:分:秒:帧（示例：0:00:10:00 表示 25 帧速率下的 10 秒）。<br>
点击按钮（应用时长到所选合成）。<br>
所有选中的合成、合成内的所有图层，以及嵌套的子合成（无限层级）都会自动同步为目标时长。<br><br>
### 2. 修改帧率
在项目面板中选中需要调整帧率的合成。<br>
输入目标帧率（需为正整数，示例：30 表示 30 帧 / 秒，60 表示 60 帧 / 秒）。<br>
点击按钮（应用帧率到所选合成）。<br>
所有选中合成的帧率将立即更新为设定值。<br><br>
### 3. 修改合成尺寸
在项目面板中选中需要修改尺寸的合成。<br>
输入目标分辨率，格式为 宽度*高度（示例：1280*720 对应 720P，3840*2160 对应 4K）。<br>
点击按钮（应用尺寸到所选合成）。<br>
所有选中合成的宽度和高度将同步设置为输入值。<br><br>

## ⚠️ 注意事项
时长格式：严格遵循 时:分:秒:帧 格式（示例：0:01:30:15 表示 1 分 30 秒 15 帧），格式错误会触发报错提示。<br>
提前备份：批量操作前建议备份项目文件，尤其是大型或重要项目，防止意外数据损失。<br>
AE 版本兼容：已在 Adobe After Effects 2020 - 2025 版本中测试兼容；低于 2020 的旧版本请自行验证可用性。<br>

## 📄 开源协议
本项目采用 MIT 许可证开源，附加限制条件：禁止未经作者明确授权，转售本脚本或用于商业获利。<br>

## 👨‍💻 作者信息
博客：yuemoon.vip<br>
GitHub：@YueMoon99<br>
Bug反馈或更多脚本制作建议：我的博客与我联系<br><br><br>



# ————————English Intro——————————



# AE Batch Comp Settings Modifier
A lightweight and open-source After Effects script that enables batch modification of composition properties (duration, frame rate, resolution) with support for synchronous processing of nested sub-compositions.
<img width="289" height="374" alt="QQ20251121-160154" src="https://github.com/user-attachments/assets/45ee4490-0744-4e88-af0d-68e84c07c71b" /><br>

## 🌟 Features
Batch modify the duration of selected comps, layers, and all nested sub-compositions (unlimited depth)<br>
Batch adjust the frame rate of multiple compositions<br>
Batch set composition resolution (width × height)<br>
Undo-friendly (each operation creates an independent undo group)<br>
Compatible with older AE versions (no ES6 syntax dependencies)<br>
Clean UI with clear input hints<br>
Open-source and free for commercial/personal use (resale prohibited)<br>

## 📥 Installation Steps
Download the latest version from the Releases page<br>
Copy CompSettingTool v2.0_zh.jsx to your AE Scripts folder:<br>
Windows: X:\Program Files\Adobe\Adobe After Effects [Version]\Support Files\Scripts\ScriptUI Panels\ <br>
Mac: Applications/Adobe After Effects [Version]/Scripts/ScriptUI Panels/<br>
Restart After Effects<br>
Open in AE: Window > CompSettingTool v2.0_zh.jsx<br>

## 🚀 Usage Instructions
### 1. Modify Duration
Select one or more compositions to modify in the Project Panel.<br>
Enter the target duration in the strict format Hours:Minutes:Seconds:Frames (e.g., 0:00:10:00 = 10 seconds at 25fps).<br>
Click the button (Apply Duration to Selected Comps).<br>
All selected compositions, their internal layers, and nested sub-compositions (unlimited depth) will be automatically synced to the target duration.<br><br>
### 2. Modify Frame Rate
Select the compositions to adjust in the Project Panel.<br>
Enter the target frame rate (must be a positive integer; e.g., 30 = 30fps, 60 = 60fps).<br>
Click the button (Apply Frame Rate to Selected Comps).<br>
The frame rate of all selected compositions will be updated immediately to the set value.<br><br>
### 3. Modify Composition Size
Select the compositions to resize in the Project Panel.<br>
Enter the target resolution in the format Width*Height (e.g., 1280*720 for 720P, 3840*2160 for 4K).<br>
Click the button (Apply Size to Selected Comps).<br>
The width and height of all selected compositions will be synced to the input values.<br><br>

## ⚠️ Notes
Duration Format: Strictly follow the Hours:Minutes:Seconds:Frames format (e.g., 0:01:30:15 = 1 minute, 30 seconds, 15 frames). Invalid formats will trigger an error message.<br>
Backup First: It’s recommended to back up your project file before batch operations, especially for large or important projects, to prevent accidental data loss.<br>
AE Version Compatibility: Tested and compatible with Adobe After Effects 2020 - 2025. For versions older than 2020, please verify usability on your own.<br>

## 📄 License
This project is open-source under the MIT License with an additional restriction: Resale or commercial exploitation of this script without explicit permission from the author is prohibited.

## 👨‍💻 Author Information
Blog: yuemoon.vip<br>
GitHub: @YueMoon99<br>
Bug Reports or Script Feature Requests: Contact me via my blog.<br>
