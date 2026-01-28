(function(thisObj) { 
    var isDockablePanel = (thisObj instanceof Panel);
    var mainWindow;
    if (isDockablePanel) {
        mainWindow = thisObj;
        mainWindow.text = "BatchCompSettingTool v2.2 | 舟午YueMoon |";
    } else {
        mainWindow = new Window("palette", "CompSettingTool", undefined, {resizeable: true});
    }

    mainWindow.orientation = "column";
    mainWindow.alignChildren = "left";
    mainWindow.spacing = 10;
    mainWindow.margins = 15;
    var panelWidth = 280; 
    var buttonWidth = panelWidth - 30;
    var blogText = mainWindow.add("statictext", undefined, "Blog：yuemoon.vip   Bilibili：UID223633562");
    blogText.size = [buttonWidth, 15];

    // --- 1. durationGroup ---
    var durationGroup = mainWindow.add("panel", undefined, "Duration");
    durationGroup.orientation = "column";
    durationGroup.alignChildren = ["left", "center"];
    var durationInput = durationGroup.add("edittext", undefined, "0:00:00:00");
    durationInput.size = [buttonWidth, 25];
    var radio1 = durationGroup.add("radiobutton", undefined, "1. Selected + Sub-comp penetration");
    var radio2 = durationGroup.add("radiobutton", undefined, "2. Layers at end + Penetration");
    var radio3 = durationGroup.add("radiobutton", undefined, "3. Just Selected Comp duration only");
    radio1.value = true;
    var durationButton = durationGroup.add("button", undefined, "Apply Duration to Selected Comps");
    durationButton.size = [buttonWidth, 25];
    durationGroup.preferredSize.width = panelWidth;
    durationGroup.maximumSize.width = panelWidth; 
    durationGroup.margins = 10;


    // --- 2. frameRateGroup ---
    var frameRateGroup = mainWindow.add("panel", undefined, "frameRate");
    frameRateGroup.orientation = "column";
    frameRateGroup.alignChildren = ["left", "center"];
    var frameRateInput = frameRateGroup.add("edittext", undefined, "25");
    frameRateInput.size = [buttonWidth, 25];
    var frameRatePenetrate = frameRateGroup.add("checkbox", undefined, "Sub-comp Penetration");
    var frameRateButton = frameRateGroup.add("button", undefined, "Apply Frame Rate to Selected Comps");
    frameRateButton.size = [buttonWidth, 25];
    frameRateGroup.preferredSize.width = panelWidth;
    frameRateGroup.maximumSize.width = panelWidth; 
    frameRateGroup.margins = 10;


    // --- 3. Comp Size Section ---
    var compSizeGroup = mainWindow.add("panel", undefined, "CompSize");
    compSizeGroup.orientation = "column";
    compSizeGroup.alignChildren = ["left", "center"];
    var compSizeInput = compSizeGroup.add("edittext", undefined, "1920 * 1080");
    compSizeInput.size = [buttonWidth, 25];
    var compSizePenetrate = compSizeGroup.add("checkbox", undefined, "Sub-comp Penetration");
    var compSizeButton = compSizeGroup.add("button", undefined, "Apply Size to Selected Comps");
    compSizeButton.size = [buttonWidth, 25];
    compSizeGroup.preferredSize.width = panelWidth;
    compSizeGroup.maximumSize.width = panelWidth; 
    compSizeGroup.margins = 10;


    // --- 4. Footer ---
    mainWindow.add("statictext", undefined, "——————————————————————");
    mainWindow.add("statictext", undefined, "Note: Totally FREE project, Resale Prohibited");

    function parseDuration(durationStr, frameRate) {
        var parts = durationStr.split(":");
        if (parts.length !== 4) return 0;
        var h = parseInt(parts[0], 10) || 0;
        var m = parseInt(parts[1], 10) || 0;
        var s = parseInt(parts[2], 10) || 0;
        var f = parseInt(parts[3], 10) || 0;
        return (h * 3600) + (m * 60) + s + (f / frameRate);
    }

    function parseCompSize(sizeStr) {
        var parts = sizeStr.split("*");
        if (parts.length !== 2) return null;
        function trimStr(str) { return str.replace(/^\s+|\s+$/g, ""); }
        return [parseInt(trimStr(parts[0]), 10), parseInt(trimStr(parts[1]), 10)];
    }

    function forceRefreshLayer(layer) {
        var originalEnabled = layer.enabled;
        layer.enabled = !originalEnabled;
        layer.enabled = originalEnabled;
        if (layer.canSetCollapseTransformation || layer.source instanceof CompItem) { 
             var originalOut = layer.outPoint;
             layer.outPoint = originalOut + 0.01; 
             layer.outPoint = originalOut;
        }
    }

    function recursiveModifyCompAndLayers(comp, targetDuration, processedComps, stats) {
        if (processedComps[comp.id]) return;
        processedComps[comp.id] = true;
        stats.totalComps++;

        comp.duration = targetDuration;

        for (var j = comp.numLayers; j >= 1; j--) {
            var layer = comp.layers[j];
            stats.totalLayers++;
            if (layer.source instanceof CompItem) {
                recursiveModifyCompAndLayers(layer.source, targetDuration, processedComps, stats);
            }
            layer.outPoint = targetDuration;
            forceRefreshLayer(layer);
        }
    }

    function modifyOnlyOverlappingLayers(comp, targetDuration, processedComps, stats) {
        if (processedComps[comp.id]) return;
        processedComps[comp.id] = true;
        stats.totalComps++;

        var originalCompDuration = comp.duration;
        comp.duration = targetDuration;

        for (var j = comp.numLayers; j >= 1; j--) {
            var layer = comp.layers[j];
            if (layer.outPoint >= originalCompDuration - 0.01) {
                stats.totalLayers++;
                if (layer.source instanceof CompItem) {
                    modifyOnlyOverlappingLayers(layer.source, targetDuration, processedComps, stats);
                }
                layer.outPoint = targetDuration;
                forceRefreshLayer(layer);
            }
        }
    }

    function applyFrameRateRecursive(comp, frameRate, processedComps) {
        if (processedComps[comp.id]) return;
        processedComps[comp.id] = true;
        comp.frameRate = frameRate;
        for (var j = 1; j <= comp.numLayers; j++) {
            var layer = comp.layers[j];
            if (layer.source instanceof CompItem) applyFrameRateRecursive(layer.source, frameRate, processedComps);
        }
    }

    function applySizeRecursive(comp, width, height, processedComps) {
        if (processedComps[comp.id]) return;
        processedComps[comp.id] = true;
        comp.width = width;
        comp.height = height;
        for (var j = 1; j <= comp.numLayers; j++) {
            var layer = comp.layers[j];
            if (layer.source instanceof CompItem) applySizeRecursive(layer.source, width, height, processedComps);
        }
    }

    durationButton.onClick = function() {
        app.beginUndoGroup("Modify Comp Durations");
        try {
            var durationStr = durationInput.text.replace(/^\s+|\s+$/g, "");
            var selectedItems = app.project.selection;
            var selectedComps = [];
            for(var i=0; i<selectedItems.length; i++) if(selectedItems[i] instanceof CompItem) selectedComps.push(selectedItems[i]);

            if (selectedComps.length === 0) { alert("Select comps in Project Panel!"); return; }

            var stats = { totalComps: 0, totalLayers: 0 };
            var processedComps = {};

            for (var k = 0; k < selectedComps.length; k++) {
                var targetDuration = parseDuration(durationStr, selectedComps[k].frameRate);
                if (targetDuration <= 0) continue;

                if (radio1.value) recursiveModifyCompAndLayers(selectedComps[k], targetDuration, processedComps, stats);
                else if (radio2.value) modifyOnlyOverlappingLayers(selectedComps[k], targetDuration, processedComps, stats);
                else if (radio3.value) { selectedComps[k].duration = targetDuration; stats.totalComps++; }
            }
            alert("Success! Comps: " + stats.totalComps + (radio3.value ? "" : " Layers: " + stats.totalLayers));
        } catch (e) { alert(e.toString()); }
        app.endUndoGroup();
    };

    frameRateButton.onClick = function() {
        app.beginUndoGroup("Modify Comp Frame Rate");
        try {
            var fps = parseInt(frameRateInput.text, 10);
            var selectedItems = app.project.selection;
            var processedComps = {};
            for(var i=0; i<selectedItems.length; i++) {
                if(selectedItems[i] instanceof CompItem) {
                    if (frameRatePenetrate.value) applyFrameRateRecursive(selectedItems[i], fps, processedComps);
                    else { selectedItems[i].frameRate = fps; processedComps[selectedItems[i].id] = true; }
                }
            }
            alert("Frame Rate Applied.");
        } catch (e) { alert(e.toString()); }
        app.endUndoGroup();
    };

    compSizeButton.onClick = function() {
        app.beginUndoGroup("Modify Comp Size");
        try {
            var size = parseCompSize(compSizeInput.text);
            var selectedItems = app.project.selection;
            var processedComps = {};
            for(var i=0; i<selectedItems.length; i++) {
                if(selectedItems[i] instanceof CompItem) {
                    if (compSizePenetrate.value) applySizeRecursive(selectedItems[i], size[0], size[1], processedComps);
                    else { selectedItems[i].width = size[0]; selectedItems[i].height = size[1]; processedComps[selectedItems[i].id] = true; }
                }
            }
            alert("Size Applied.");
        } catch (e) { alert(e.toString()); }
        app.endUndoGroup();
    };

    if (isDockablePanel) mainWindow.layout.layout(true);
    else { mainWindow.center(); mainWindow.show(); }
})(this);
