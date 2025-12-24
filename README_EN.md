[中文](README.md) | [English](README_EN.md)

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
Windows: ..\Adobe After Effects [Version]\Support Files\Scripts\ScriptUI Panels\ <br>
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
