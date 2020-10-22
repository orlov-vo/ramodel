const path = require('path');
const fs = require('fs').promises;

async function main() {
  const packageRaw = await fs.readFile(path.resolve(process.cwd(), 'package.json'));
  const packageJson = JSON.parse(packageRaw);

  await Promise.all(
    Object.entries(packageJson.exports).map(async ([subPath, exports]) => {
      if (subPath === '.') return;

      const packageDir = path.resolve(process.cwd(), subPath);
      const normalizePath = relativePath => path.relative(packageDir, path.resolve(process.cwd(), relativePath));

      const content = {
        main: normalizePath(exports.require || exports.default),
        module: normalizePath(exports.import || exports.default),
        types: normalizePath(exports.types),
      };

      const packagePath = path.resolve(packageDir, 'package.json');
      const packageContent = JSON.stringify(content, undefined, 2) + '\n';

      await fs.mkdir(packageDir, { recursive: true });
      await fs.writeFile(packagePath, packageContent, { encoding: 'utf8' });
    }),
  );
}

main();
