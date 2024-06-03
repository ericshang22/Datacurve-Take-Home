// intialize Pyodide with pandas package and scipy package
const readyPyodide = async () => {
  
  // change default output from console.log to a variable
  let pyodide = await loadPyodide({
    stdout: (text) => {paragraph.textContent += text;},
    stderr: (text) => {paragraph.textContent += text;}
  });
  await pyodide.loadPackage('pandas');
  await pyodide.loadPackage('scipy');
  return pyodide
}

const runPythonCode = async (pyodide, code) => {
  // if pyodide is loaded
  if (pyodide) {
    try {
      // output the code's value to outputBuffer variable
      let outputBuffer = '';
      
      pyodide.setStdout({
        batched: (text) => {
          outputBuffer += text + '\n';
        }
      });
  
      pyodide.setStderr({
        batched: (text) => {
          outputBuffer += text + '\n';
        }
      });
      
      // run code 
      await pyodide.runPythonAsync(code);
      return outputBuffer;
    } catch (error) {
      return `Error: ${error}`;
    }
  }
};


export { readyPyodide , runPythonCode };
