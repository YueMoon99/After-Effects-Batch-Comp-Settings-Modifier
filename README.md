# AE 合成设置批量修改工具 / AE Batch Comp Settings Modifier.
## *Scroll down for English introduction.*
<img width="316" height="585" alt="Screenshot 2025-11-25 114902" src="https://github.com/user-attachments/assets/375b5e1e-f536-4edd-b158-9dbd4e8eea16" />
<br>
一款轻量开源的 After Effects 脚本，可批量修改合成属性（时长、帧率、尺寸），支持嵌套子合成同步处理。<br><br>

## 🌟 功能特性
批量修改所选合成、图层及所有嵌套子合成的时长（无限层级）<br>
批量调整多个合成的帧率<br>
批量设置合成分辨率（宽 × 高）<br>
支持撤销（每个操作生成独立撤销组）<br>
兼容 AE 旧版本（无 ES6 语法依赖）<br>
简洁 UI，输入提示清晰<br>
开源免费，支持商业 / 个人使用（禁止转售）<br><br>

## 📥 安装步骤
下载脚本（文件名后缀zh是中文版，en是英文版）<br>
将 CompSettingTool v2.1.jsx 复制到 AE 脚本文件夹：<br>
Windows: X:\Program Files\Adobe\Adobe After Effects [版本号]\Support Files\Scripts\ScriptUI Panels\ <br>
Mac: 应用程序/Adobe After Effects [版本号]/Scripts/ScriptUI Panels/<br>
重启 After Effects<br>
在 AE 中打开：窗口 > CompSettingTool v2.1.jsx<br><br>

## 🚀 使用说明
### 1. 修改时长
输入格式：时:分:秒:帧（例：0:00:05:00 = 5 秒，0:01:30:12 = 1 分 30 秒 12 帧）；<br>
修改选项：<br>
是，修改所有内容 + 子合成穿透：调整合成时长，同时修改所有图层的出点，并递归修改子合成的时长和图层；<br>
是，仅修改出点≥合成出点的图层：调整合成时长，仅修改出点等于超过原合成出点的图层，若这些图层中有子合成，则同时递归处理对应子合成；<br>
否，仅改合成时长：仅调整合成本身时长，不修改任何图层和子合成。<br><br>

### 2. 修改帧率
输入格式：正整数（例：25、30、60，单位：帧 / 秒）；<br>
子合成穿透：勾选后，会递归修改选中合成内所有嵌套子合成的帧率；不勾选则仅修改选中的顶层合成。<br><br>

### 3. 修改合成尺寸
输入格式：宽度*高度（中间需加空格，例：1920 * 1080、1280 * 720）；<br>
子合成穿透：勾选后，会递归修改选中合成内所有嵌套子合成的尺寸；不勾选则仅修改选中的顶层合成。<br><br>

## ⚠️ 注意事项
时长格式：严格遵循 时:分:秒:帧 格式（示例：0:01:30:15 表示 1 分 30 秒 15 帧），格式错误会触发报错提示。<br>
提前备份：批量操作前建议备份项目文件，尤其是大型或重要项目，防止意外数据损失。<br>
AE 版本兼容：已在 Adobe After Effects 2020 - 2025 版本中测试兼容；低于 2020 的旧版本请自行验证可用性。<br>

## 📄 开源协议
本项目采用 MIT 许可证开源，附加限制条件：禁止未经作者明确授权，转售本脚本或用于商业获利。<br>

## 👨‍💻 作者信息
博客：yuemoon.vip<br>
GitHub：@YueMoon99<br>
B站：UID223633562<br>
Bug反馈或更多脚本制作建议：我的博客与我联系<br><br><br>



# ————————English Intro——————————



# AE Batch Comp Settings Modifier
<img width="308" height="585" alt="Screenshot 2025-11-25 114906" src="https://github.com/user-attachments/assets/715bee82-800b-4810-ae8c-01e9c8e673b3" />
<br>
A lightweight and open-source After Effects script that enables batch modification of composition properties (duration, frame rate, resolution) with support for synchronous processing of nested sub-compositions.

## 🌟 Features
Batch modify the duration of selected comps, layers, and all nested sub-compositions (unlimited depth)<br>
Batch adjust the frame rate of multiple compositions<br>
Batch set composition resolution (width × height)<br>
Undo-friendly (each operation creates an independent undo group)<br>
Compatible with older AE versions (no ES6 syntax dependencies)<br>
Clean UI with clear input hints<br>
Open-source and free for commercial/personal use (resale prohibited)<br>

## 📥 Installation Steps
Download the script (file name suffix 'zh' for the Chinese version, 'en' for the English version)<br>
Copy CompSettingTool v2.1.jsx to your AE Scripts folder:<br>
Windows: X:\Program Files\Adobe\Adobe After Effects [Version]\Support Files\Scripts\ScriptUI Panels\ <br>
Mac: Applications/Adobe After Effects [Version]/Scripts/ScriptUI Panels/<br>
Restart After Effects<br>
Open in AE: Window > CompSettingTool v2.1.jsx<br>

## 🚀 Usage Instructions
### 1. Modify Duration
Input Format: Hours:Minutes:Seconds:Frames (Example: 0:00:05:00 = 5 seconds, 0:01:30:12 = 1 minute 30 seconds 12 frames);<br>
Modification Options:<br>
Yes, modify all content + nested composition penetration: Adjust composition duration, modify the out point of all layers, and recursively modify the duration and layers of nested compositions;<br>
Yes, only modify layers with out point ≥ composition out point: Adjust composition duration, only modify layers whose out point exceeds the original composition's out point, and recursively process corresponding nested compositions;<br>
No, only modify composition duration: Only adjust the composition's own duration without modifying any layers or nested compositions.<br><br>
### 2. Modify Frame Rate
Input Format: Positive integer (Example: 25, 30, 60, Unit: fps);<br>
Nested Composition Penetration: When checked, recursively modify the frame rate of all nested compositions in the selected composition; if unchecked, only modify the selected top-level composition.<br><br>
### 3. Modify Composition Size
Input Format: Width*Height (with a space in between, Example: 1920 * 1080, 1280 * 720);<br>
Nested Composition Penetration: When checked, recursively modify the size of all nested compositions in the selected composition; if unchecked, only modify the selected top-level composition.<br><br>

## ⚠️ Notes
Duration Format: Strictly follow the Hours:Minutes:Seconds:Frames format (e.g., 0:01:30:15 = 1 minute, 30 seconds, 15 frames). Invalid formats will trigger an error message.<br>
Backup First: It’s recommended to back up your project file before batch operations, especially for large or important projects, to prevent accidental data loss.<br>
AE Version Compatibility: Tested and compatible with Adobe After Effects 2020 - 2025. For versions older than 2020, please verify usability on your own.<br>

## 📄 License
This project is open-source under the MIT License with an additional restriction: Resale or commercial exploitation of this script without explicit permission from the author is prohibited.

## 👨‍💻 Author Information
Blog: yuemoon.vip<br>
GitHub: @YueMoon99<br>
Contact me if BUG Occured.<br>
Good Luck Building your World!!
