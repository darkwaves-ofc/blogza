import fs from "fs";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import prettier from "prettier";

dotenv.config();

// Constants
const BLACKBOX_API_URL = "https://api.blackbox.ai/api/chat";
const folderPath = "app/(client)";
const prompt = `Improve the code by using the shadecn ui components and make sure this is working properly with dark theme. and also make sure the code is responsive.`;

// Configuration
const config = {
  maxRetries: 3,
  retryDelay: 1000,
  supportedExtensions: [".js", ".jsx", ".ts", ".tsx"],
  headers: {
    'Content-Type': 'application/json'
  }
};

// Utility to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Extract code from API response
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

// Function to check if code seems incomplete
function isCodeIncomplete(code) {
  // Check for common indicators of incomplete code
  const indicators = [
    'export const metadata',
    'import type { Metadata }',
    'keywords: ['
  ];
  
  return !indicators.every(indicator => code.includes(indicator));
}

// Function to combine new and original code
function combineCode(originalCode, newCode) {
  if (newCode.length < originalCode.length * 0.8) {
    console.log('⚠️ New code appears to be partial. Combining with original code...');
    
    // Extract import statements from original code
    const importRegex = /^import.*?;$/gm;
    const originalImports = originalCode.match(importRegex) || [];
    const newImports = newCode.match(importRegex) || [];
    
    // Combine unique imports
    const uniqueImports = [...new Set([...newImports, ...originalImports])];
    
    // Remove imports from both codes for clean combination
    let cleanOriginalCode = originalCode.replace(importRegex, '').trim();
    let cleanNewCode = newCode.replace(importRegex, '').trim();
    
    // Combine the code with imports at the top
    const combinedCode = `${uniqueImports.join('\n')}\n\n${cleanNewCode}\n\n${cleanOriginalCode}`;
    
    console.log('✅ Successfully combined new and original code');
    return combinedCode;
  }
  
  return newCode;
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

// Prepare data for Blackbox API
function prepareDataForAPI(code) {
  return {
    messages: [
      {
        content: `${prompt}\n\n${code}`,
        role: 'user'
      }
    ],
    model: 'deepseek-ai/DeepSeek-V3',
    max_tokens: '4000'
  };
}

// Function to analyze code completeness and quality
function analyzeCode(code) {
  return {
    // Check for essential metadata structure
    hasMetadataType: code.includes('import type { Metadata }'),
    hasMetadataExport: code.includes('export const metadata: Metadata'),
    hasTemplate: code.includes('template:') && code.includes('default:'),
    hasDescription: code.includes('description:'),
    hasKeywords: code.includes('keywords:') && code.includes('['),
    
    // Get code metrics
    codeLength: code.length,
    importCount: (code.match(/^import .+?;$/gm) || []).length,
    
    // Check for code structure completeness
    hasClosingBrackets: (code.match(/\{/g) || []).length === (code.match(/\}/g) || []).length,
    hasExportStatement: Boolean(code.match(/^export /m))
  };
}

// Function to extract different parts of the code
function extractCodeParts(code) {
  return {
    imports: code.match(/^import .+?;$/gm) || [],
    metadata: code.match(/export const metadata: Metadata = {[\s\S]+?};/m)?.[0] || '',
    otherCode: code.replace(/^import .+?;$/gm, '')
                   .replace(/export const metadata: Metadata = {[\s\S]+?};/m, '')
                   .trim()
  };
}

// Enhanced code combination function
function smartCodeCombiner(originalCode, newCode) {
  // Analyze both code versions
  const originalAnalysis = analyzeCode(originalCode);
  const newAnalysis = analyzeCode(newCode);
  
  // Extract parts from both codes
  const originalParts = extractCodeParts(originalCode);
  const newParts = extractCodeParts(newCode);
  
  // Decision making logic
  const shouldCombine = (
    // If new code is significantly shorter
    newAnalysis.codeLength < originalAnalysis.codeLength * 0.8 ||
    // Or if new code is missing essential parts
    (!newAnalysis.hasMetadataType && originalAnalysis.hasMetadataType) ||
    (!newAnalysis.hasMetadataExport && originalAnalysis.hasMetadataExport) ||
    (!newAnalysis.hasKeywords && originalAnalysis.hasKeywords)
  );
  
  if (!shouldCombine) {
    console.log('✅ New code appears complete. Using it as is.');
    return newCode;
  }
  
  console.log('⚠️ Detected partial code response. Performing smart combination...');
  
  // Combine imports uniquely
  const uniqueImports = [...new Set([...newParts.imports, ...originalParts.imports])];
  
  // Choose the most complete metadata
  const metadata = newParts.metadata || originalParts.metadata;
  
  // Combine other code, preferring new code when available
  const otherCode = newParts.otherCode || originalParts.otherCode;
  
  // Assemble final code
  const combinedCode = [
    // Imports at the top
    ...uniqueImports,
    '',
    // Metadata section
    metadata,
    '',
    // Other code
    otherCode
  ].join('\n');
  
  console.log('✅ Successfully performed smart code combination');
  return combinedCode;
}

// Update the improveCodeWithAPI function to use the new combiner
async function improveCodeWithAPI(code, retryCount = 0) {
  try {
    const response = await axios.post(
      BLACKBOX_API_URL,
      prepareDataForAPI(code),
      config
    );

    if (!response.data) {
      console.error("❌ No data in API response.");
      return code;
    }

    const extractedCode = extractCodeFromResponse(response.data);
    if (!extractedCode) {
      console.error("❌ Could not extract code from API response.");
      return code;
    }

    // Use the new smart combiner
    return smartCodeCombiner(code, extractedCode);
    
  } catch (error) {
    console.error("Error calling Blackbox API:", error.message);

    if (retryCount < config.maxRetries) {
      console.log(`Retrying in ${config.retryDelay}ms... (Attempt ${retryCount + 1}/${config.maxRetries})`);
      await delay(config.retryDelay);
      return improveCodeWithAPI(code, retryCount + 1);
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

    // Improve code with API
    console.log(`📤 Sending to Blackbox API...`);
    const improvedCode = await improveCodeWithAPI(originalCode);

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