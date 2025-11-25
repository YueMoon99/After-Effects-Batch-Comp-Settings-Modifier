// AE脚本：批量合成属性修改器
// 功能：通过输入和按钮修改选中合成的时长、帧率和尺寸
(function(thisObj) { 
    var isDockablePanel = (thisObj instanceof Panel);
    var mainWindow;

    if (isDockablePanel) {
        mainWindow = thisObj;
        mainWindow.text = "合成属性批量修改工具 v2.1 丨舟午YueMoon丨";
    } else {
        mainWindow = new Window("palette", "合成设置工具", undefined, {resizeable: true});
    }

    mainWindow.orientation = "column";
    mainWindow.spacing = 10;
    mainWindow.margins = 15;

    var FinalText = mainWindow.add("statictext", undefined, "博客：yuemoon.vip   B站：UID223633562");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];
    
    // 1. 时长输入组
    var durationGroup = mainWindow.add("group");
    durationGroup.orientation = "row";
    durationGroup.alignment = ["left", "center"];
    durationGroup.add("statictext", undefined, "时长：");
    var durationInput = durationGroup.add("edittext", undefined, "0:00:00:00");
    durationInput.size = [100, 25];
    durationInput.helpTip = "格式：时:分:秒:帧（例：0:00:05:00 = 5秒）";

    // 时长修改选项单选按钮组（左对齐）
    var durationOptionGroup = mainWindow.add("group");
    durationOptionGroup.orientation = "column";
    durationOptionGroup.alignment = ["left", "top"];
    var questionText = durationOptionGroup.add("statictext", undefined, "是否修改合成内容持续时间？");
    questionText.alignment = ["left", "center"];
    
    var radioGroup = durationOptionGroup.add("group");
    radioGroup.orientation = "column";
    radioGroup.alignment = ["left", "top"];
    var radio1 = radioGroup.add("radiobutton", undefined, "1、是，修改所有图层+子合成穿透");
    var radio2 = radioGroup.add("radiobutton", undefined, "2、是，仅修改出点≥合成出点的图层+子合成");
    var radio3 = radioGroup.add("radiobutton", undefined, "3、否，仅修改选中合成时长");
    radio1.alignment = ["left", "center"];
    radio2.alignment = ["left", "center"];
    radio3.alignment = ["left", "center"];
    radio1.value = true;

    var durationButton = mainWindow.add("button", undefined, "应用时长到选中合成");
    durationButton.size = [260, 30];
    durationButton.alignment = ["left", "center"];

    // 2. 帧率输入组
    var frameRateGroup = mainWindow.add("group");
    frameRateGroup.orientation = "row";
    frameRateGroup.alignment = ["left", "center"];
    frameRateGroup.add("statictext", undefined, "帧率：");
    var frameRateInput = frameRateGroup.add("edittext", undefined, "25");
    frameRateInput.size = [100, 25];
    frameRateInput.helpTip = "正整数（例：30、60）";

    // 帧率子合成穿透复选框
    var frameRatePenetrate = mainWindow.add("checkbox", undefined, "子合成穿透");
    frameRatePenetrate.alignment = ["left", "center"];

    var frameRateButton = mainWindow.add("button", undefined, "应用帧率到选中合成");
    frameRateButton.size = [260, 30];
    frameRateButton.alignment = ["left", "center"];

    // 3. 合成尺寸输入组
    var compSizeGroup = mainWindow.add("group");
    compSizeGroup.orientation = "row";
    compSizeGroup.alignment = ["left", "center"];
    compSizeGroup.add("statictext", undefined, "合成尺寸：");
    var compSizeInput = compSizeGroup.add("edittext", undefined, "1920 * 1080");
    compSizeInput.size = [100, 25];
    compSizeInput.helpTip = "格式：宽度*高度（例：1280 * 720）";

    // 尺寸子合成穿透复选框
    var compSizePenetrate = mainWindow.add("checkbox", undefined, "子合成穿透");
    compSizePenetrate.alignment = ["left", "center"];

    var compSizeButton = mainWindow.add("button", undefined, "应用尺寸到选中合成");
    compSizeButton.size = [260, 30];
    compSizeButton.alignment = ["left", "center"];
    
    // 开源声明
    var FinalText = mainWindow.add("statictext", undefined, "——————————————————————");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];
    var FinalText = mainWindow.add("statictext", undefined, "开源声明：完全开源免费，禁止转售");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];
   
    // 解析时长字符串
    function parseDuration(durationStr, frameRate) {
        var parts = durationStr.split(":");
        if (parts.length !== 4) throw new Error("无效时长格式！请用 时:分:秒:帧");
        var hours = parseInt(parts[0], 10) || 0;
        var minutes = parseInt(parts[1], 10) || 0;
        var seconds = parseInt(parts[2], 10) || 0;
        var frames = parseInt(parts[3], 10) || 0;
        var totalSeconds = hours * 3600 + minutes * 60 + seconds + frames / frameRate;
        return totalSeconds;
    }

    // 解析合成尺寸
    function parseCompSize(sizeStr) {
        var parts = sizeStr.split("*");
        if (parts.length !== 2) throw new Error("无效尺寸格式！请用 宽度*高度");
        
        function trimStr(str) {
            return str.replace(/^\s+|\s+$/g, "");
        }
        
        var width = parseInt(trimStr(parts[0]), 10);
        var height = parseInt(trimStr(parts[1]), 10);
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            throw new Error("宽度和高度必须为正数");
        }
        return [width, height];
    }

    // 获取选中的合成
    function getSelectedCompositions() {
        var comps = [];
        for (var i = 0; i < app.project.selection.length; i++) {
            var item = app.project.selection[i];
            if (item instanceof CompItem) {
                comps.push(item);
            }
        }
        return comps;
    }

    /**
     * 选项1处理：修改所有内容且子合成穿透
     */
    function recursiveModifyCompAndLayers(comp, targetDuration, processedComps, stats) {
        if (processedComps[comp.id]) return;
        processedComps[comp.id] = true;
        stats.totalComps++;

        comp.duration = targetDuration;

        for (var j = 1; j <= comp.layers.length; j++) {
            var layer = comp.layers[j];
            stats.totalLayers++;
            layer.outPoint = targetDuration;

            if (layer.source instanceof CompItem) {
                recursiveModifyCompAndLayers(layer.source, targetDuration, processedComps, stats);
            }
        }
    }

    /**
     * 选项2处理：仅修改出点大于等于合成出点的图层和子合成
     */
    function modifyOnlyOverlappingLayers(comp, targetDuration, processedComps, stats) {
        if (processedComps[comp.id]) return;
        processedComps[comp.id] = true;
        stats.totalComps++;

        var originalCompDuration = comp.duration;
        comp.duration = targetDuration;

        for (var j = 1; j <= comp.layers.length; j++) {
            var layer = comp.layers[j];
            if (layer.outPoint >= originalCompDuration) {
                stats.totalLayers++;
                layer.outPoint = targetDuration;

                if (layer.source instanceof CompItem) {
                    modifyOnlyOverlappingLayers(layer.source, targetDuration, processedComps, stats);
                }
            }
        }
    }

    /**
     * 选项3处理：仅修改合成时长，不处理内容
     */
    function modifyOnlyCompDuration(comp, targetDuration, stats) {
        comp.duration = targetDuration;
        stats.totalComps++;
    }

    /**
     * 递归应用帧率到子合成
     */
    function applyFrameRateRecursive(comp, frameRate, processedComps) {
        if (processedComps[comp.id]) return;
        processedComps[comp.id] = true;
        
        comp.frameRate = frameRate;

        for (var j = 1; j <= comp.layers.length; j++) {
            var layer = comp.layers[j];
            if (layer.source instanceof CompItem) {
                applyFrameRateRecursive(layer.source, frameRate, processedComps);
            }
        }
    }

    /**
     * 递归应用尺寸到子合成
     */
    function applySizeRecursive(comp, width, height, processedComps) {
        if (processedComps[comp.id]) return;
        processedComps[comp.id] = true;
        
        comp.width = width;
        comp.height = height;

        for (var j = 1; j <= comp.layers.length; j++) {
            var layer = comp.layers[j];
            if (layer.source instanceof CompItem) {
                applySizeRecursive(layer.source, width, height, processedComps);
            }
        }
    }

    // 时长按钮点击事件
    durationButton.onClick = function() {
        app.beginUndoGroup("修改合成时长");
        try {
            var durationStr = durationInput.text.replace(/^\s+|\s+$/g, "");
            var selectedComps = getSelectedCompositions();
            
            if (selectedComps.length === 0) {
                alert("请在项目面板至少选择一个合成！");
                return;
            }

            var stats = { totalComps: 0, totalLayers: 0 };
            var processedComps = {};
            var targetDuration;

            for (var i = 0; i < selectedComps.length; i++) {
                var mainComp = selectedComps[i];
                targetDuration = parseDuration(durationStr, mainComp.frameRate);

                if (radio1.value) {
                    recursiveModifyCompAndLayers(mainComp, targetDuration, processedComps, stats);
                } else if (radio2.value) {
                    modifyOnlyOverlappingLayers(mainComp, targetDuration, processedComps, stats);
                } else if (radio3.value) {
                    modifyOnlyCompDuration(mainComp, targetDuration, stats);
                }
            }
            
            alert(
                "操作成功！\n" +
                "共修改 " + stats.totalComps + " 个合成（含嵌套子合成），\n" +
                (radio3.value ? "" : "共更新 " + stats.totalLayers + " 个图层（含子合成图层），\n") +
                "所有时长已对齐至：" + durationStr + "。"
            );
        } catch (e) {
            alert("错误：" + e.message);
        }
        app.endUndoGroup();
    };

    // 帧率按钮点击事件
    frameRateButton.onClick = function() {
        app.beginUndoGroup("修改合成帧率");
        try {
            var frameRate = parseInt(frameRateInput.text, 10);
            if (isNaN(frameRate) || frameRate <= 0) throw new Error("帧率必须为正整数！");
            var comps = getSelectedCompositions();
            if (comps.length === 0) {
                alert("请在项目面板至少选择一个合成！");
                return;
            }

            var processedComps = {};
            var modifiedCount = 0;

            for (var i = 0; i < comps.length; i++) {
                if (frameRatePenetrate.value) {
                    applyFrameRateRecursive(comps[i], frameRate, processedComps);
                } else {
                    comps[i].frameRate = frameRate;
                    processedComps[comps[i].id] = true;
                }
            }

            for (var id in processedComps) modifiedCount++;
            alert("成功修改 " + modifiedCount + " 个合成的帧率！");
        } catch (e) {
            alert("错误：" + e.message);
        }
        app.endUndoGroup();
    };

    // 尺寸按钮点击事件
    compSizeButton.onClick = function() {
        app.beginUndoGroup("修改合成尺寸");
        try {
            var sizeStr = compSizeInput.text;
            var comps = getSelectedCompositions();
            if (comps.length === 0) {
                alert("请在项目面板至少选择一个合成！");
                return;
            }
            var size = parseCompSize(sizeStr);
            var width = size[0];
            var height = size[1];
            var processedComps = {};
            var modifiedCount = 0;

            for (var i = 0; i < comps.length; i++) {
                if (compSizePenetrate.value) {
                    applySizeRecursive(comps[i], width, height, processedComps);
                } else {
                    comps[i].width = width;
                    comps[i].height = height;
                    processedComps[comps[i].id] = true;
                }
            }

            for (var id in processedComps) modifiedCount++;
            alert("成功修改 " + modifiedCount + " 个合成的尺寸！");
        } catch (e) {
            alert("错误：" + e.message);
        }
        app.endUndoGroup();
    };

    // 窗口显示逻辑
    if (isDockablePanel) {
        mainWindow.layout.layout(true);
    } else {
        mainWindow.center();
        mainWindow.show();
    }
})(this);