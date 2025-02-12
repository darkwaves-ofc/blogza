import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";
import prettier from "prettier";

dotenv.config();

// Constants
const CODY_API_URL = "https://sourcegraph.com/.api/completions/stream";
const CODY_TOKEN = process.env.CODY_TOKEN || "sgp_fd1b4edb60bf82b8_73797b88dffdf9ae40031015f2a6d24e07250623";
const folderPath = "app/(client)";
const prompt =
  "Improve the code by using the shadecn ui components and make sure this is working properly with dark theme. and also make sure the code is responsive.";

// Configuration
const config = {
  maxRetries: 3,
  retryDelay: 1000,
  supportedExtensions: [".js", ".jsx", ".ts", ".tsx"],
};

// Utility to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Extract code from Cody's response
function extractCodeFromResponse(response) {
  if (!response || typeof response !== 'string') {
    return null;
  }

  // Look for code blocks with specific language tags
  const codeBlockRegex = /```(?:jsx|tsx|javascript|typescript)?\n([\s\S]*?)\n```/;
  const match = response.match(codeBlockRegex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  return null;
}

// Get all code files recursively
async function getCodeFiles(dir) {
  const files = [];

  async function traverse(currentDir) {
    const items = await fs.promises.readdir(currentDir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentDir, item.name);

      if (item.isDirectory()) {
        if (!item.name.startsWith(".") && item.name !== "node_modules") {
          await traverse(fullPath);
        }
      } else if (config.supportedExtensions.includes(path.extname(item.name))) {
        files.push(fullPath);
      }
    }
  }

  await traverse(dir);
  return files;
}

// Prepare code for Cody API
function prepareCodeForCody(code) {
  return {
    messages: [
      { role: "system", content: "You are an AI that improves code quality." },
      { role: "user", content: `${prompt}\n\n${code}` },
    ],
    temperature: 0.3,
    maxTokensToSample: 4000,
    stream: false
  };
}

// Send code to Cody with retry logic
async function improveCodeWithCody(code, retryCount = 0) {
  try {
    const response = await fetch(CODY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${CODY_TOKEN}`,
      },
      body: JSON.stringify(prepareCodeForCody(code)),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Response Error (${response.status}):`, errorText);

      if (retryCount < config.maxRetries && [429, 503].includes(response.status)) {
        console.log(`Retrying in ${config.retryDelay}ms... (Attempt ${retryCount + 1}/${config.maxRetries})`);
        await delay(config.retryDelay);
        return improveCodeWithCody(code, retryCount + 1);
      }

      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("🔹 Full API Response:", data);

    if (!data.completion) {
      console.error("❌ No completion in Cody response.");
      return code;
    }

    // Extract code from the completion
    const extractedCode = extractCodeFromResponse(data.completion);
    if (!extractedCode) {
      console.error("❌ Could not extract code from Cody's response.");
      return code;
    }

    return extractedCode;
  } catch (error) {
    console.error("Error calling Cody API:", error.message);

    if (retryCount < config.maxRetries) {
      console.log(`Retrying in ${config.retryDelay}ms... (Attempt ${retryCount + 1}/${config.maxRetries})`);
      await delay(config.retryDelay);
      return improveCodeWithCody(code, retryCount + 1);
    }

    return code;
  }
}

// Format code with Prettier
async function formatCode(code, filepath) {
  try {
    return await prettier.format(code, {
      filepath,
      semi: true,
      singleQuote: true,
      trailingComma: "es5",
      printWidth: 100,
      parser: path.extname(filepath).includes("tsx") ? "typescript" : "babel",
    });
  } catch (error) {
    console.error(`Prettier formatting error:`, error);
    return code;
  }
}

// Process a single file
async function processFile(filepath) {
  console.log(`\n🔄 Processing: ${filepath}`);

  try {
    // Read file
    const originalCode = await fs.promises.readFile(filepath, "utf-8");

    // Improve code with Cody
    console.log(`📤 Sending to Cody API...`);
    const improvedCode = await improveCodeWithCody(originalCode);

    if (improvedCode && improvedCode.trim() !== originalCode.trim()) {
      // Format the improved code
      const formattedCode = await formatCode(improvedCode, filepath);

      // Write the improved and formatted code back to file
      await fs.promises.writeFile(filepath, formattedCode, "utf-8");
      console.log(`✅ Successfully improved and formatted: ${filepath}`);
    } else {
      console.log(`ℹ️ No improvements needed for: ${filepath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filepath}:`, error);
  }
}

// Main process
async function main() {
  console.log("🚀 Starting code improvement process...");

  try {
    const files = await getCodeFiles(folderPath);
    console.log(`\n📁 Found ${files.length} files to process`);

    for (const file of files) {
      await processFile(file);
    }

    console.log("\n✨ Process completed successfully!");
  } catch (error) {
    console.error("❌ Process failed:", error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);