// AE Script: Batch Comp Property Modifier
// Function: Modify duration, frame rate and size of selected compositions via inputs and buttons
(function(thisObj) { 
    var isDockablePanel = (thisObj instanceof Panel);
    var mainWindow;

    if (isDockablePanel) {
        mainWindow = thisObj;
        mainWindow.text = "合成属性批量修改工具 v2.0 By丨舟午YueMoon丨";
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
    durationGroup.add("statictext", undefined, "时长：");
    var durationInput = durationGroup.add("edittext", undefined, "0:00:00:00");
    durationInput.size = [100, 25];
    durationInput.helpTip = "格式：时:分:秒:帧（例如 0:00:05:00 表示5秒）";
    var durationButton = mainWindow.add("button", undefined, "应用时长到选中合成");
    durationButton.size = [260, 30];
    durationButton.alignment = ["left", "center"];

    // 2. Frame Rate input group
    var frameRateGroup = mainWindow.add("group");
    frameRateGroup.orientation = "row";
    frameRateGroup.alignment = ["left", "center"];
    frameRateGroup.add("statictext", undefined, "帧率：");
    var frameRateInput = frameRateGroup.add("edittext", undefined, "25");
    frameRateInput.size = [100, 25];
    frameRateInput.helpTip = "正整数（例如 30、60）";
    var frameRateButton = mainWindow.add("button", undefined, "应用帧率到选中合成");
    frameRateButton.size = [260, 30];
    frameRateButton.alignment = ["left", "center"];

    // 3. Comp Size input group
    var compSizeGroup = mainWindow.add("group");
    compSizeGroup.orientation = "row";
    compSizeGroup.alignment = ["left", "center"];
    compSizeGroup.add("statictext", undefined, "合成大小：");
    var compSizeInput = compSizeGroup.add("edittext", undefined, "1920 * 1080");
    compSizeInput.size = [100, 25];
    compSizeInput.helpTip = "格式：宽度*高度（例如 1280 * 720）";

    var compSizeButton = mainWindow.add("button", undefined, "应用大小到选中合成");
    compSizeButton.size = [260, 30];
    compSizeButton.alignment = ["left", "center"];
    
    // === 声明 ===
    var FinalText = mainWindow.add("statictext", undefined, "——————————————————————");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];
    var FinalText = mainWindow.add("statictext", undefined, "请注意：完全免费，请勿倒卖");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];
    var FinalText = mainWindow.add("statictext", undefined, "更多免费脚本可在我的主页“原创开源计划”中查找");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];
    var FinalText = mainWindow.add("statictext", undefined, "主页：yuemoon.vip");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];


    // 解析时长字符串
    function parseDuration(durationStr, frameRate) {
        var parts = durationStr.split(":");
        if (parts.length !== 4) throw new Error("帧率必须为正整数");
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
        if (parts.length !== 2) throw new Error("合成大小格式错误，应为 宽度*高度");
        var width = parseInt(parts[0].trim(), 10); // 去除空格
        var height = parseInt(parts[1].trim(), 10);
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            throw new Error("宽度和高度必须为正整数");
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
        app.beginUndoGroup("修改合成、图层和嵌套子合成的持续时间");
        try {
            var durationStr = durationInput.text.replace(/^\s+|\s+$/g, ""); // 兼容旧版本的去空格
            var selectedComps = getSelectedCompositions();
            
            if (selectedComps.length === 0) {
                alert("请在项目窗口中选择至少一个合成");
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
                "成功！\n" +
                "总共修改了 " + stats.totalComps + " 个合成（包括子合成），\n" +
                 stats.totalLayers + "个图层（包括子合成内的图层），\n" +
                "所有时长都已设定为： " + durationStr + "。"
            );
        } catch (e) {
            alert("错误:  " + e.message);
        }
        app.endUndoGroup();
    };

    // 应用帧率按钮
    frameRateButton.onClick = function() {
        app.beginUndoGroup("修改合成帧率");
        try {
            var frameRate = parseInt(frameRateInput.text, 10);
            if (isNaN(frameRate) || frameRate <= 0) throw new Error("帧率必须为正整数");
            var comps = getSelectedCompositions();
            if (comps.length === 0) {
                alert("请在项目窗口中选择至少一个合成");
                return;
            }
            for (var i = 0; i < comps.length; i++) {
                comps[i].frameRate = frameRate;
            }
            alert("成功修改" + comps.length + "个合成的帧率");
        } catch (e) {
            alert("错误: " + e.message);
        }
        app.endUndoGroup();
    };

    // 应用尺寸按钮
    compSizeButton.onClick = function() {
        app.beginUndoGroup("修改合成大小");
        try {
            var sizeStr = compSizeInput.text;
            var comps = getSelectedCompositions();
            if (comps.length === 0) {
                alert("请在项目窗口中选择至少一个合成");
                return;
            }
            var size = parseCompSize(sizeStr);
            for (var i = 0; i < comps.length; i++) {
                var comp = comps[i];
                comp.width = size[0];
                comp.height = size[1];
            }
            alert("成功修改 " + comps.length + " 个合成的尺寸");
        } catch (e) {
            alert("错误:  " + e.message);
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