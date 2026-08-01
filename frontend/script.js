// ------------------------
// Monaco Editor
// ------------------------

let editor;

require.config({
    paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs"
    }
});

require(["vs/editor/editor.main"], function () {

    editor = monaco.editor.create(document.getElementById("editor"), {

        value: `print("Hello TechSpark")`,

        language: "python",

        theme: "vs-dark",

        automaticLayout: true,

        fontSize: 16,

        lineNumbers: "on",

        minimap: {
            enabled: false
        },

        autoIndent: "full",

        formatOnType: true,

        formatOnPaste: true,

        tabSize: 4,

        insertSpaces: true

    });

});


// ------------------------
// Change Language
// ------------------------

// ------------------------
// Change Language
// ------------------------

document.getElementById("language").addEventListener("change", function () {

    const lang = this.value;

    monaco.editor.setModelLanguage(
        editor.getModel(),
        lang
    );

    let starterCode = "";

    switch(lang){

        case "python":

            starterCode =
`print("Hello TechSpark")`;

            break;

        case "c":

            starterCode =
`#include <stdio.h>

int main(){

    printf("Hello TechSpark");

    return 0;
}`;

            break;

        case "cpp":

            starterCode =
`#include <iostream>
using namespace std;

int main(){

    cout << "Hello TechSpark";

    return 0;
}`;

            break;

        case "java":

            starterCode =
`public class Main{

    public static void main(String[] args){

        System.out.println("Hello TechSpark");

    }

}`;

            break;

    }

    editor.setValue(starterCode);

    document.getElementById("inputSection").style.display = "none";

    document.getElementById("input").value = "";

    document.getElementById("output").innerText =
        "Program output will appear here...";

});

// ------------------------
// Detect Program Input
// ------------------------

function requiresInput(code, language){

    code = code.toLowerCase();

    switch(language){

        case "python":
            return code.includes("input(");

        case "c":
            return code.includes("scanf(");

        case "cpp":
            return code.includes("cin");

        case "java":
            return code.includes("scanner") || code.includes("nextint(") || code.includes("nextline(");

        default:
            return false;

    }

}


// ------------------------
// Run Code
// ------------------------

async function runCode(){

    const code = editor.getValue();

    const language = document.getElementById("language").value;

    const inputSection = document.getElementById("inputSection");

    if(requiresInput(code, language)){

        inputSection.style.display = "block";

    }

    else{

        inputSection.style.display = "none";

    }

    const input = document.getElementById("input").value;

    document.getElementById("output").innerText = "Running...";

    try{

        const response = await fetch("http://127.0.0.1:5000/deploy",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({

                language: language,

                code: code,

                input: input

            })

        });

        const data = await response.json();

        if(data.success){

            document.getElementById("output").innerText = data.output;

        }

        else{

            document.getElementById("output").innerText = data.error;

        }

    }

    catch(error){

        document.getElementById("output").innerText = "Connection Error : " + error;

    }

}


// ------------------------
// Clear Editor
// ------------------------

function clearEditor(){

    editor.setValue("");

    document.getElementById("input").value = "";

    document.getElementById("output").innerText =
        "Program output will appear here...";

    document.getElementById("inputSection").style.display = "none";

}