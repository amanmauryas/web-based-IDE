"use client";

import { useState, useEffect, useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import Split from "react-split";
import { FiFolder, FiFile, FiTerminal, FiCode, FiSave, FiPlay, FiGithub, FiEye, FiEyeOff, FiPlus, FiTrash2, FiMoreHorizontal } from "react-icons/fi";
import { ThemeToggle } from "./theme-toggle";

// List of programming languages supported
const LANGUAGES = [
  { id: "javascript", name: "JavaScript", extension: "js" },
  { id: "typescript", name: "TypeScript", extension: "ts" },
  { id: "html", name: "HTML", extension: "html" },
  { id: "css", name: "CSS", extension: "css" },
  { id: "python", name: "Python", extension: "py" },
  { id: "java", name: "Java", extension: "java" },
  { id: "csharp", name: "C#", extension: "cs" },
  { id: "cpp", name: "C++", extension: "cpp" },
  { id: "go", name: "Go", extension: "go" },
  { id: "ruby", name: "Ruby", extension: "rb" },
  { id: "rust", name: "Rust", extension: "rs" },
  { id: "php", name: "PHP", extension: "php" },
  { id: "swift", name: "Swift", extension: "swift" },
  { id: "kotlin", name: "Kotlin", extension: "kt" },
];

// Sample files for demo
const SAMPLE_FILES = [
  {
    name: "index.html",
    language: "html",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Welcome to my project</p>
  <script src="script.js"></script>
</body>
</html>`,
  },
  {
    name: "styles.css",
    language: "css",
    content: `body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
}

h1 {
  color: #333;
}

p {
  color: #666;
}`,
  },
  {
    name: "script.js",
    language: "javascript",
    content: `// JavaScript code
console.log('Hello from script.js');

function greet(name) {
  return \`Hello, \${name}!\`;
}

document.addEventListener('DOMContentLoaded', () => {
  console.log(greet('Developer'));
});`,
  },
  {
    name: "main.py",
    language: "python",
    content: `# Python code
def greet(name):
    return f"Hello, {name}!"

if __name__ == "__main__":
    print(greet("Developer"))
    
# Example of a simple class
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
        
    def introduce(self):
        return f"My name is {self.name} and I am {self.age} years old."`,
  },
];

export default function CodeEditor() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [files, setFiles] = useState(SAMPLE_FILES);
  const [activeFile, setActiveFile] = useState(SAMPLE_FILES[0]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Welcome to Web IDE Terminal",
    "Type 'help' for a list of commands",
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLIFrameElement>(null);
  const [showPopup, setShowPopup] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;

    const updatedFiles = files.map(file =>
      file.name === activeFile.name ? { ...file, content: value } : file
    );

    setFiles(updatedFiles);
    setActiveFile({ ...activeFile, content: value });
  };

  const handleLanguageChange = (language: typeof LANGUAGES[0]) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
  };

  const handleFileClick = (file: typeof files[0]) => {
    setActiveFile(file);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple terminal command handling
    const newOutput = [...terminalOutput, `$ ${terminalInput}`];

    if (terminalInput.toLowerCase() === 'help') {
      newOutput.push("Available commands: help, clear, ls, echo [text]");
    } else if (terminalInput.toLowerCase() === 'clear') {
      setTerminalOutput([]);
      setTerminalInput("");
      return;
    } else if (terminalInput.toLowerCase() === 'ls') {
      newOutput.push(files.map(f => f.name).join('\n'));
    } else if (terminalInput.toLowerCase().startsWith('echo ')) {
      newOutput.push(terminalInput.substring(5));
    } else if (terminalInput.trim() !== '') {
      newOutput.push(`Command not found: ${terminalInput}`);
    }

    setTerminalOutput(newOutput);
    setTerminalInput("");
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    // Configure editor options
    editor.updateOptions({
      fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
      fontSize: 14,
      lineHeight: 1.5,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
    });
  };

  const runCode = () => {
    // Show the preview panel
    setShowPreview(true);

    // Get the HTML, CSS, and JS files
    const htmlFile = files.find(file => file.name.endsWith('.html'));
    const cssFile = files.find(file => file.name.endsWith('.css'));
    const jsFile = files.find(file => file.name.endsWith('.js') && !file.name.endsWith('.json'));

    if (!htmlFile) {
      setTerminalOutput([...terminalOutput, "$ run", "Error: No HTML file found to run"]);
      return;
    }

    // Create a combined HTML document with inline CSS and JS
    let htmlContent = htmlFile.content;

    // If there's a CSS file, inject it into the HTML
    if (cssFile) {
      const styleTag = `<style>\n${cssFile.content}\n</style>`;
      htmlContent = htmlContent.replace('</head>', `${styleTag}\n</head>`);
    }

    // If there's a JS file, inject it into the HTML
    if (jsFile) {
      const scriptTag = `<script>\n${jsFile.content}\n</script>`;
      htmlContent = htmlContent.replace('</body>', `${scriptTag}\n</body>`);
    }

    // Update the iframe with the new content
    setTimeout(() => {
      if (previewRef.current) {
        const iframe = previewRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(htmlContent);
          iframeDoc.close();
        }
      }
    }, 100);

    setTerminalOutput([...terminalOutput, "$ run", "Running HTML in preview panel..."]);
  };

  // Function to handle adding a new file
  const handleAddFile = () => {
    const newFileName = `new_file.${selectedLanguage.extension}`; // Default name with extension
    const newFile = {
      name: newFileName,
      language: selectedLanguage.id,
      content: "", // Start with empty content
    };
    setFiles([...files, newFile]);
    setActiveFile(newFile); // Set the new file as the active file
  };

  // Function to handle deleting a file
  const handleDeleteFile = (fileToDelete) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${fileToDelete.name}?`);
    if (confirmDelete) {
      const updatedFiles = files.filter(file => file.name !== fileToDelete.name);
      setFiles(updatedFiles);
      // Optionally, set the active file to the first file in the list or null
      if (activeFile.name === fileToDelete.name) {
        setActiveFile(updatedFiles[0] || null);
      }
    }
  };

  // Function to handle renaming a file
  const handleRenameFile = (fileToRename) => {
    const newName = prompt("Enter new file name:", fileToRename.name);
    if (newName && newName !== fileToRename.name) {
      const updatedFiles = files.map(file =>
        file.name === fileToRename.name ? { ...file, name: newName } : file
      );
      setFiles(updatedFiles);
      setActiveFile(updatedFiles.find(file => file.name === newName) || updatedFiles[0]);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <FiCode className="h-6 w-6 text-blue-500 dark:text-blue-400" />
          <h1 className="text-xl font-bold">Web IDE</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative language-selector">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 glow"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              {selectedLanguage.name}
              <span className="text-xs">▼</span>
            </button>

            {showLanguageDropdown && (
              <div className="language-dropdown">
                {LANGUAGES.map((lang) => (
                  <div
                    key={lang.id}
                    className="dropdown-item"
                    onClick={() => handleLanguageChange(lang)}
                  >
                    {lang.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors glow">
            <FiSave className="h-4 w-4" />
            Save
          </button>

          <button
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors glow"
            onClick={runCode}
          >
            <FiPlay className="h-4 w-4" />
            Run
          </button>

          {showPreview && (
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition-colors glow"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
          )}

          <div className="theme-toggle">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Split
          sizes={[20, 80]}
          minSize={100}
          expandToMin={false}
          gutterSize={10}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="horizontal"
          className="split h-full"
        >
          {/* File Explorer */}
          <div className={`p-4 file-explorer ${resolvedTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black'}`}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiFolder className={`h-5 w-5 ${resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
              Files
            </h2>

            {/* Add File Button with Plus Icon */}
            <button
              className={`mb-2 p-2 rounded-md ${resolvedTheme === 'dark' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-200 text-black hover:bg-blue-300'}`}
              onClick={handleAddFile}
            >
              <FiPlus className="h-4 w-4" />
            </button>

            <div className="space-y-1">
              {files.map((file) => (
                <div
                  key={file.name}
                  className={`file-item flex items-center gap-2 p-2 rounded-md cursor-pointer ${activeFile.name === file.name ? 'bg-blue-500 text-white' : resolvedTheme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-800 hover:text-gray-600'}`}
                  onClick={() => handleFileClick(file)}
                >
                  <FiFile className={`h-4 w-4 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                  {file.name}
                  <button
                    className={`ml-auto text-gray-500 hover:text-gray-700 ${resolvedTheme === 'dark' ? 'dark:text-gray-400 dark:hover:text-gray-300' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the file click
                      setShowPopup({ ...showPopup, [file.name]: !showPopup[file.name] });
                    }}
                  >
                    <FiMoreHorizontal className="h-4 w-4" />
                  </button>

                  {showPopup[file.name] && (
                    <div className="absolute bg-white border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-2">
                      <button
                        className="block w-full text-left text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the file click
                          handleRenameFile(file);
                          setShowPopup({ ...showPopup, [file.name]: false });
                        }}
                      >
                        Rename
                      </button>
                      <button
                        className="block w-full text-left text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the file click
                          handleDeleteFile(file);
                          setShowPopup({ ...showPopup, [file.name]: false });
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Editor and Terminal */}
          <div className="flex flex-col h-full">
            {showPreview ? (
              <Split
                sizes={[50, 50]}
                minSize={100}
                expandToMin={false}
                gutterSize={10}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
                direction="vertical"
                className="h-full"
              >
                {/* Code Editor */}
                <div className="editor-container glow">
                  <Editor
                    height="100%"
                    language={activeFile.language}
                    value={activeFile.content}
                    theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs-light'}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    options={{
                      wordWrap: 'on',
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                    }}
                  />
                </div>

                {/* Preview Panel */}
                <div className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-semibold text-sm">Preview</h3>
                    <button
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      onClick={() => setShowPreview(false)}
                    >
                      <FiEyeOff className="h-4 w-4" />
                    </button>
                  </div>
                  <iframe
                    ref={previewRef}
                    className="w-full h-full bg-white"
                    title="Preview"
                    sandbox="allow-scripts allow-same-origin"
                  ></iframe>
                </div>
              </Split>
            ) : (
              <Split
                sizes={[70, 30]}
                minSize={100}
                expandToMin={false}
                gutterSize={10}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
                direction="vertical"
                className="h-full"
              >
                {/* Code Editor */}
                <div className="editor-container glow">
                  <Editor
                    height="100%"
                    language={activeFile.language}
                    value={activeFile.content}
                    theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs-light'}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    options={{
                      wordWrap: 'on',
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                    }}
                  />
                </div>

                {/* Terminal */}
                <div className="bg-gray-900 text-gray-100 terminal">
                  <div className="flex items-center gap-2 mb-2">
                    <FiTerminal className="h-5 w-5 text-green-400" />
                    <h3 className="font-semibold">Terminal</h3>
                  </div>

                  <div className="space-y-1 mb-2">
                    {terminalOutput.map((line, index) => (
                      <div key={index} className="terminal-line">
                        {line.startsWith('$') ? (
                          <>
                            <span className="terminal-prompt">$</span>
                            {line.substring(1)}
                          </>
                        ) : (
                          line
                        )}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleTerminalSubmit} className="flex items-center">
                    <span className="terminal-prompt">$</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      className="flex-1 bg-transparent outline-none"
                      autoFocus
                    />
                  </form>
                </div>
              </Split>
            )}
          </div>
        </Split>
      </div>

      {/* Footer */}
      <footer className={`p-4 border-t ${resolvedTheme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <FiCode className={`h-5 w-5 ${resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
            <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
              Web IDE © {new Date().getFullYear()} Made by <a href="https://amanmauryas.live" className={`hover:text-blue-500 ${resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Aman Maurya</a>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-500 dark:hover:text-blue-400 transition-colors`}>
              More tools
            </a>
            <a href="#" className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-500 dark:hover:text-blue-400 transition-colors`}>
              Support
            </a>
          </div>

          <div className="mt-2 md:mt-0">
            <p className={`text-m ${resolvedTheme === 'dark' ? 'text-yellow' : 'text-yellow-600'}`}>
              <a href="https://buymeacoffee.com/amanmauryas" className="text-yellow-400">Buy me a coffee</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}