// allow the JS file to be used in App.tsx by declaring types
declare module './pyodideUtils' {
    export async function runPythonCode(pyodide:any, code: string): Promise<string>;
    export async function readyPyodide(): Promise<any>; 
  }

export {}