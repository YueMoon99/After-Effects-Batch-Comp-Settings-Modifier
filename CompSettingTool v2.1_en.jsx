// AE Script: Batch Comp Property Modifier
// Function: Modify duration, frame rate and size of selected comps via inputs/buttons
(function(thisObj) { 
    var isDockablePanel = (thisObj instanceof Panel);
    var mainWindow;

    if (isDockablePanel) {
        mainWindow = thisObj;
        mainWindow.text = "BatchCompSettingTool v2.1 | 舟午YueMoon |";
    } else {
        mainWindow = new Window("palette", "CompSettingTool", undefined, {resizeable: true});
    }

    mainWindow.orientation = "column";
    mainWindow.spacing = 10;
    mainWindow.margins = 15;

    var FinalText = mainWindow.add("statictext", undefined, "Blog：yuemoon.vip   Bilibili：UID223633562");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];
    
    // 1. Duration input group
    var durationGroup = mainWindow.add("group");
    durationGroup.orientation = "row";
    durationGroup.alignment = ["left", "center"];
    durationGroup.add("statictext", undefined, "Duration:");
    var durationInput = durationGroup.add("edittext", undefined, "0:00:00:00");
    durationInput.size = [100, 25];
    durationInput.helpTip = "Format: H:M:S:F (e.g., 0:00:05:00 = 5s)";

    // Duration option radio group (left-aligned)
    var durationOptionGroup = mainWindow.add("group");
    durationOptionGroup.orientation = "column";
    durationOptionGroup.alignment = ["left", "top"];
    var questionText = durationOptionGroup.add("statictext", undefined, "Modify comp content duration?");
    questionText.alignment = ["left", "center"];
    
    var radioGroup = durationOptionGroup.add("group");
    radioGroup.orientation = "column";
    radioGroup.alignment = ["left", "top"];
    var radio1 = radioGroup.add("radiobutton", undefined, "1、Yes, modify all + sub-comp penetration");
    var radio2 = radioGroup.add("radiobutton", undefined, "2、Yes, only layers with outPoint ≥ comp outPoint");
    var radio3 = radioGroup.add("radiobutton", undefined, "3、No, only modify comp duration");
    radio1.alignment = ["left", "center"];
    radio2.alignment = ["left", "center"];
    radio3.alignment = ["left", "center"];
    radio1.value = true;

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

    // Frame rate sub-comp penetration checkbox
    var frameRatePenetrate = mainWindow.add("checkbox", undefined, "Sub-comp Penetration");
    frameRatePenetrate.alignment = ["left", "center"];

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

    // Comp size sub-comp penetration checkbox
    var compSizePenetrate = mainWindow.add("checkbox", undefined, "Sub-comp Penetration");
    compSizePenetrate.alignment = ["left", "center"];

    var compSizeButton = mainWindow.add("button", undefined, "Apply Size to Selected Comps");
    compSizeButton.size = [260, 30];
    compSizeButton.alignment = ["left", "center"];
    
    // Open source notice
    var FinalText = mainWindow.add("statictext", undefined, "——————————————————————");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];
    var FinalText = mainWindow.add("statictext", undefined, "Note: Totally FREE project, Resale Prohibited");
    FinalText.size = [350, 15];
    FinalText.alignment = ["left", "center"];

    // Parse duration string
    function parseDuration(durationStr, frameRate) {
        var parts = durationStr.split(":");
        if (parts.length !== 4) throw new Error("Invalid format! Use H:M:S:F");
        var hours = parseInt(parts[0], 10) || 0;
        var minutes = parseInt(parts[1], 10) || 0;
        var seconds = parseInt(parts[2], 10) || 0;
        var frames = parseInt(parts[3], 10) || 0;
        var totalSeconds = hours * 3600 + minutes * 60 + seconds + frames / frameRate;
        return totalSeconds;
    }

    // Parse comp size (fix trim error)
    function parseCompSize(sizeStr) {
        var parts = sizeStr.split("*");
        if (parts.length !== 2) throw new Error("Invalid format! Use Width*Height");
        
        function trimStr(str) {
            return str.replace(/^\s+|\s+$/g, "");
        }
        
        var width = parseInt(trimStr(parts[0]), 10);
        var height = parseInt(trimStr(parts[1]), 10);
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            throw new Error("Width/height must be positive numbers");
        }
        return [width, height];
    }

    // Get selected compositions
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
     * Option 1: Modify all content + sub-comp penetration
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
     * Option 2: Only modify layers with outPoint ≥ comp outPoint + sub-comps
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
     * Option 3: Only modify comp duration, no content change
     */
    function modifyOnlyCompDuration(comp, targetDuration, stats) {
        comp.duration = targetDuration;
        stats.totalComps++;
    }

    /**
     * Recursively apply frame rate to sub-comps
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
     * Recursively apply size to sub-comps
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

    // Duration button click event
    durationButton.onClick = function() {
        app.beginUndoGroup("Modify Comp Durations");
        try {
            var durationStr = durationInput.text.replace(/^\s+|\s+$/g, "");
            var selectedComps = getSelectedCompositions();
            
            if (selectedComps.length === 0) {
                alert("Select at least one comp in Project Panel!");
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
                "Success!\n" +
                "Modified " + stats.totalComps + " comp(s) (including nested sub-comps),\n" +
                (radio3.value ? "" : "Updated " + stats.totalLayers + " layer(s) (including sub-comp layers),\n") +
                "All durations aligned to: " + durationStr + "."
            );
        } catch (e) {
            alert("Error: " + e.message);
        }
        app.endUndoGroup();
    };

    // Frame rate button click event
    frameRateButton.onClick = function() {
        app.beginUndoGroup("Modify Comp Frame Rate");
        try {
            var frameRate = parseInt(frameRateInput.text, 10);
            if (isNaN(frameRate) || frameRate <= 0) throw new Error("Frame rate must be positive integer!");
            var comps = getSelectedCompositions();
            if (comps.length === 0) {
                alert("Select at least one comp in Project Panel!");
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
            alert("Successfully modified frame rate for " + modifiedCount + " comp(s)!");
        } catch (e) {
            alert("Error: " + e.message);
        }
        app.endUndoGroup();
    };

    // Comp size button click event
    compSizeButton.onClick = function() {
        app.beginUndoGroup("Modify Comp Size");
        try {
            var sizeStr = compSizeInput.text;
            var comps = getSelectedCompositions();
            if (comps.length === 0) {
                alert("Select at least one comp in Project Panel!");
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
            alert("Successfully modified size for " + modifiedCount + " comp(s)!");
        } catch (e) {
            alert("Error: " + e.message);
        }
        app.endUndoGroup();
    };

    // Window display logic
    if (isDockablePanel) {
        mainWindow.layout.layout(true);
    } else {
        mainWindow.center();
        mainWindow.show();
    }
})(this);