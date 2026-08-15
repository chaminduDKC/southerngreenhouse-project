const fs = require('fs');
const path = require('path');

const pagesDir = 'C:\\Users\\Chamindu\\.gemini\\antigravity\\scratch\\southern-greenhouse\\apps\\client\\src\\renderer\\src\\pages';

function addLoader2Import(content) {
    if (content.includes('Loader2')) return content;
    // Find lucide-react import
    if (content.includes("'lucide-react'")) {
        return content.replace(/import\s+{([^}]*)}\s+from\s+'lucide-react'/, (match, p1) => {
            return `import { ${p1.trim()}, Loader2 } from 'lucide-react'`;
        });
    } else {
        return `import { Loader2 } from 'lucide-react'\n` + content;
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Replace 'Saving...' or 'Saving…' inside ternary with spinner
            // e.g. {isPending ? 'Saving...' : 'Save'} -> {isPending ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving...</> : 'Save'}
            const regex = /(\?.*?)['"](Saving(?:\.\.\.|…))['"]/g;
            if (regex.test(content)) {
                content = content.replace(regex, `$1<><Loader2 size={16} className="animate-spin mr-2 inline" /> $2</>`);
                modified = true;
            }

            // For SalaryPage calculating
            const calcRegex = /(\?.*?)['"](Calculating\.\.\.)['"]/g;
            if (calcRegex.test(content)) {
                content = content.replace(calcRegex, `$1<><Loader2 size={16} className="animate-spin mr-2 inline" /> $2</>`);
                modified = true;
            }
            
            // For general buttons that might not have a ternary but have disabled
            // Actually, many forms just use ternary strings. Let's see if we missed any.

            if (modified) {
                content = addLoader2Import(content);
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${file}`);
            }
        }
    }
}

processDirectory(pagesDir);
console.log('Done');
