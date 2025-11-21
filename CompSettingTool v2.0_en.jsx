// AE Script: Batch Comp Property Modifier
// Function: Modify duration, frame rate and size of selected compositions via inputs and buttons
(function(thisObj) { 
    var isDockablePanel = (thisObj instanceof Panel);
    var mainWindow;

    if (isDockablePanel) {
        mainWindow = thisObj;
        mainWindow.text = "CompSettingTool v2.0 By丨舟午YueMoon丨";
    } else {
        mainWindow = new Window("palette", "CompSettingTool", undefined, {resizeable: true});
    }

    mainWindow.orientation = "column";
    mainWindow.spacing = 10;
    mainWindow.margins = 15;

    // 1. Duration input group
    var durationGroup = mainWindow.add("group");
    durationGroup.orientation = "row";
    durationGroup.alignment = ["left", "center"];
    durationGroup.add("statictext", undefined, "Duration:");
    var durationInput = durationGroup.add("edittext", undefined, "0:00:00:00");
    durationInput.size = [100, 25];
    durationInput.helpTip = "Format: Hours:Minutes:Seconds:Frames (e.g., 0:00:05:00 = 5 seconds)";

    var durationButton = mainWindow.add("button", undefined, "Apply Duration to Selected Comps");
    durationButton.size = [260, 30];
    durationButton.alignment = ["left", "center"];

    // 2. Frame Rate input group
    var frameRateGroup = mainWindow.add("group");
    frameRateGroup.orientation = "row";
    frameRateGroup.alignment = ["left", "center"];
    frameRateGroup.add("statictext", undefined, "Frame Rate:");
    var frameRateInput = frameRateGroup.add("edittext", undefined, "25");
    frameRateInput.size = [100, 25];
    frameRateInput.helpTip = "Positive integer (e.g., 30, 60)";

    var frameRateButton = mainWindow.add("button", undefined, "Apply Frame Rate to Selected Comps");
    frameRateButton.size = [260, 30];
    frameRateButton.alignment = ["left", "center"];

    // 3. Comp Size input group
    var compSizeGroup = mainWindow.add("group");
    compSizeGroup.orientation = "row";
    compSizeGroup.alignment = ["left", "center"];
    compSizeGroup.add("statictext", undefined, "Comp Size:");
    var compSizeInput = compSizeGroup.add("edittext", undefined, "1920 * 1080");
    compSizeInput.size = [100, 25];
    compSizeInput.helpTip = "Format: Width*Height (e.g., 1280 * 720)";

    var compSizeButton = mainWindow.add("button", undefined, "Apply Size to Selected Comps");
    compSizeButton.size = [260, 30];
    compSizeButton.alignment = ["left", "center"];
    
    // 开源声明
    var FinalText = mainWindow.add("statictext", undefined, "——————————————————————");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];
    var FinalText = mainWindow.add("statictext", undefined, "Please note:Total FREE project, Prohibited to resell.");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];
    var FinalText = mainWindow.add("statictext", undefined, "More free stuff in my blog: yuemoon.vip");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];


    // 解析时长字符串
    function parseDuration(durationStr, frameRate) {
        var parts = durationStr.split(":");
        if (parts.length !== 4) throw new Error("Invalid duration format. Use Hours:Minutes:Seconds:Frames");
        var hours = parseInt(parts[0], 10) || 0; // 处理空值
        var minutes = parseInt(parts[1], 10) || 0;
        var seconds = parseInt(parts[2], 10) || 0;
        var frames = parseInt(parts[3], 10) || 0;
        var totalSeconds = hours * 3600 + minutes * 60 + seconds + frames / frameRate;
        return totalSeconds;
    }

    // 解析合成尺寸
    function parseCompSize(sizeStr) {
        var parts = sizeStr.split("*");
        if (parts.length !== 2) throw new Error("Invalid comp size format. Use Width*Height");
        var width = parseInt(parts[0].trim(), 10); // 去除空格
        var height = parseInt(parts[1].trim(), 10);
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            throw new Error("Width and height must be positive numbers");
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
     * 递归修改合成及其所有嵌套子合成的时长（兼容旧版AE，用对象模拟Set）
     * @param {CompItem} comp - 要处理的合成
     * @param {number} targetDuration - 目标时长（秒）
     * @param {Object} processedComps - 已处理的合成ID对象（key: comp.id, value: true）
     * @param {Object} stats - 统计信息（合成数、图层数）
     */
    function recursiveModifyCompAndLayers(comp, targetDuration, processedComps, stats) {
        // 避免循环引用导致死循环（用对象属性判断是否已处理）
        if (processedComps[comp.id]) return;
        
        // 标记当前合成已处理（用合成ID作为对象key）
        processedComps[comp.id] = true;
        stats.totalComps++;

        // 1. 修改当前合成的时长
        comp.duration = targetDuration;

        // 2. 处理当前合成内的所有图层
        for (var j = 1; j <= comp.layers.length; j++) {
            var layer = comp.layers[j];
            stats.totalLayers++;

            // 2.1 修改当前图层的结束点（无论是否是子合成图层）
            layer.outPoint = targetDuration;

            // 2.2 如果是子合成图层，递归处理其源合成
            if (layer.source instanceof CompItem) {
                var subComp = layer.source;
                // 递归处理子合成（子合成的子合成也会被处理）
                recursiveModifyCompAndLayers(subComp, targetDuration, processedComps, stats);
            }
        }
    }

    // 核心修改：同时调整合成、普通图层、所有嵌套子合成的时长
    durationButton.onClick = function() {
        app.beginUndoGroup("Modify Comp, Layers and Nested SubComps Durations");
        try {
            var durationStr = durationInput.text.replace(/^\s+|\s+$/g, ""); // 兼容旧版本的去空格
            var selectedComps = getSelectedCompositions();
            
            if (selectedComps.length === 0) {
                alert("Please select at least one composition in the Project panel");
                return;
            }

            // 统计信息：总合成数（含嵌套）、总图层数（含嵌套）
            var stats = {
                totalComps: 0,
                totalLayers: 0
            };
            // 用普通对象模拟Set（兼容旧版AE，避免Set构造函数错误）
            var processedComps = {};

            // 处理每个选中的合成
            for (var i = 0; i < selectedComps.length; i++) {
                var mainComp = selectedComps[i];
                // 解析目标时长（使用主合成的帧率来计算帧数）
                var targetDuration = parseDuration(durationStr, mainComp.frameRate);
                // 递归处理主合成及其所有嵌套子合成
                recursiveModifyCompAndLayers(mainComp, targetDuration, processedComps, stats);
            }
            
            alert(
                "Success!\n" +
                "Modified total " + stats.totalComps + " composition(s) (including nested sub-comps),\n" +
                "Updated total " + stats.totalLayers + " layer(s) (including layers in sub-comps),\n" +
                "All durations are aligned to target time: " + durationStr + "."
            );
        } catch (e) {
            alert("Error: " + e.message);
        }
        app.endUndoGroup();
    };

    // 应用帧率按钮
    frameRateButton.onClick = function() {
        app.beginUndoGroup("Modify Comp Frame Rate");
        try {
            var frameRate = parseInt(frameRateInput.text, 10);
            if (isNaN(frameRate) || frameRate <= 0) throw new Error("Frame rate must be a positive integer");
            var comps = getSelectedCompositions();
            if (comps.length === 0) {
                alert("Please select at least one composition in the Project panel");
                return;
            }
            for (var i = 0; i < comps.length; i++) {
                comps[i].frameRate = frameRate;
            }
            alert("Successfully modified frame rate for " + comps.length + " composition(s)");
        } catch (e) {
            alert("Error: " + e.message);
        }
        app.endUndoGroup();
    };

    // 应用尺寸按钮
    compSizeButton.onClick = function() {
        app.beginUndoGroup("Modify Comp Size");
        try {
            var sizeStr = compSizeInput.text;
            var comps = getSelectedCompositions();
            if (comps.length === 0) {
                alert("Please select at least one composition in the Project panel");
                return;
            }
            var size = parseCompSize(sizeStr);
            for (var i = 0; i < comps.length; i++) {
                var comp = comps[i];
                comp.width = size[0];
                comp.height = size[1];
            }
            alert("Successfully modified size for " + comps.length + " composition(s)");
        } catch (e) {
            alert("Error: " + e.message);
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