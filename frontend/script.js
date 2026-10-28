
const API_URL = "http://localhost:5000/deploy";

const languageSelect = document.getElementById("language");
const inputSection = document.getElementById("inputSection");
const programInput = document.getElementById("input");
const output = document.getElementById("output");
const runButton = document.getElementById("runButton");
const clearButton = document.getElementById("clearButton");
const editorContainer = document.getElementById("editorContainer");

let editor = null;

const starterCode = {
    python: 'print("Hello TechSpark")',
    c: `#include <stdio.h>

int main() {
    printf("Hello TechSpark\\n");
    return 0;
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello TechSpark" << endl;
    return 0;
}`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello TechSpark");
    }
}`
};

const monacoLanguages = {
    python: "python",
    c: "c",
    cpp: "cpp",
    java: "java"
};

function requiresInput(code, language) {
    switch (language) {
        case "python":
            return /\binput\s*\(/.test(code);
        case "c":
            return /\bscanf\s*\(/.test(code) ||
                   /\bgetchar\s*\(/.test(code) ||
                   /\bfgets\s*\(/.test(code);
        case "cpp":
            return /cin\s*>>|getline\s*\(/.test(code);
        case "java":
            return /\bScanner\b/.test(code) ||
                   /\.(next|nextLine|nextInt|nextDouble|nextFloat|nextBoolean)\s*\(/.test(code);
        default:
            return false;
    }
}

function updateInputVisibility() {
    if (!editor) return;

    inputSection.hidden = !requiresInput(
        editor.getValue(),
        languageSelect.value
    );
}

function changeLanguage() {
    if (!editor) return;

    const language = languageSelect.value;

    editor.setValue(starterCode[language]);
    monaco.editor.setModelLanguage(
        editor.getModel(),
        monacoLanguages[language]
    );

    programInput.value = "";
    output.textContent = "Program output will appear here...";
    updateInputVisibility();
    editor.focus();
}

languageSelect.addEventListener("change", changeLanguage);

require.config({
    paths: {
        vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs"
    }
});

require(["vs/editor/editor.main"], function () {
    editor = monaco.editor.create(editorContainer, {
        value: starterCode.python,
        language: "python",
        theme: "vs-dark",
        automaticLayout: true,
        lineNumbers: "on",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        tabSize: 4,
        insertSpaces: true,
        autoIndent: "full",
        formatOnType: true,
        fontSize: 14,
        wordWrap: "on",
        padding: { top: 10, bottom: 10 }
    });

    editor.onDidChangeModelContent(updateInputVisibility);

    updateInputVisibility();
});

async function runCode() {
    if (!editor) {
        output.textContent = "The code editor is still loading. Please wait.";
        return;
    }

    const language = languageSelect.value;
    const code = editor.getValue();
    const input = programInput.value;

    updateInputVisibility();
    output.textContent = "Running...";
    runButton.disabled = true;
    runButton.textContent = "Running...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ language, code, input })
        });

        const data = await response.json();

        if (!response.ok) {
            output.textContent =
                data.error || `Request failed: HTTP ${response.status}`;
        } else if (data.success) {
            output.textContent =
                data.output || "(Program finished with no output)";
        } else {
            output.textContent =
                data.error || "Program execution failed.";
        }
    } catch (error) {
        output.textContent =
            "Connection error. Make sure the TechSpark backend is running at " +
            API_URL + ". Details: " + error.message;
    } finally {
        runButton.disabled = false;
        runButton.textContent = "Run Code";
    }
}

function clearEditor() {
    if (!editor) return;

    editor.setValue("");
    programInput.value = "";
    output.textContent = "Program output will appear here...";
    updateInputVisibility();
    editor.focus();
}

runButton.addEventListener("click", runCode);
clearButton.addEventListener("click", clearEditor);

window.addEventListener("resize", () => {
    if (editor) editor.layout();
});
