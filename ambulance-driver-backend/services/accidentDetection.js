const { spawn } = require("child_process");
const path = require("path");

exports.processVideo = (videoPath) => {
  return new Promise((resolve, reject) => {
    // Assume your Python model is called "detect_accident.py"
    const pythonScript = path.resolve(__dirname, "../Python/detect_accident.py");

    const process = spawn("python", [pythonScript, videoPath]);
    
    
    let result = "";
    process.stdout.on("data", (data) => {
      result += data.toString();
    });

    process.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
    });

    process.on("close", (code) => {
      if (code !== 0) {
        console.log(`Python process exited with code ${code}`);
        
        return reject(new Error("Error in video processing."));
      }

      // Parse the result
      try {
        
        resolve(result);
      } catch (err) {
        console.error("Error parsing result:", err);
        reject(err);
      }
    });
  });
};
