// src/App.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { readyPyodide , runPythonCode } from './pyodideUtils.js';

const App: React.FC = () => {
  const [pythonCode, setPythonCode] = useState('');
  const [output, setOutput] = useState('');
  const [pyodide, setPyodide] = useState(null);
  const [runs, setRuns] = useState<{ code: string, output: string }[]>([]);

  // on start ready pyodide
  useEffect(() => {
    const loadPyodide = async () => {
      const pyodide = await readyPyodide()
      setPyodide(pyodide)
    };

    loadPyodide()
  }, []);

  // runs the code in the text area
  const handleRunCode = async () => {
    const result = await runPythonCode(pyodide, pythonCode);
    setOutput(result);
  };

  // submit code to local database
  const handleSubmitCode = async () => {
    try {
      const response = await axios.post('http://localhost:8000/submit/', { code: pythonCode, output: await runPythonCode(pyodide, pythonCode) });
      setOutput(response.data);
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
  }

  // view all previous code submissions
  const handleViewRuns = async () => {
    try {
      const response = await axios.get('http://localhost:8000/submissions/');
      setRuns(response.data)
    } catch (error) {
  
    }
  }

  // delete all previous submissions
  const handleDelete = async() => {
    try {
      const response = await axios.get('http://localhost:8000/clear/');
      setOutput(response.data)
      setRuns([]);
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
    <h1 className="text-3xl font-bold mb-4">Python Code Runner</h1>
    <textarea
      className="w-full max-w-2xl p-2 mb-4 border border-gray-300 rounded-lg shadow-sm"
      value={pythonCode}
      onChange={(e) => setPythonCode(e.target.value)}
      rows={10}
      cols={50}
    />
    <div className="flex space-x-4 mb-4">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700"
        onClick={handleRunCode}
      >
        Run Python Code
      </button>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-700"
        onClick={handleSubmitCode}
      >
        Submit Python Code
      </button>
      <button
        className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-700"
        onClick={handleViewRuns}
      >
        View Python Code
      </button>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-700"
        onClick={handleDelete}
      >
        Delete All Entries
      </button>
    </div>
    <h2 className="text-2xl font-semibold mb-2">Output:</h2>
    <textarea disabled
      className="w-full max-w-2xl p-2 mb-4 border border-gray-300 rounded-lg shadow-sm "
      value={output}
      rows={10}
      cols={50}
    />
    <h2 className="text-2xl font-semibold mb-2">Previous Code Runs:</h2>
    <ul className="w-full max-w-2xl">
      {runs.map((run, index) => (
        <li key={index} className="mb-4 p-2 bg-white border border-gray-300 rounded-lg shadow-sm">
          <strong>Code:</strong>
          <pre className="whitespace-pre-wrap">{run.code}</pre>
          <strong>Output:</strong>
          <pre className="whitespace-pre-wrap">{run.output}</pre>
        </li>
      ))}
    </ul>
  </div>
  );
};

export default App;
