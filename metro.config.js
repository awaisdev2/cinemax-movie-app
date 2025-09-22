const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

// Get the default Metro config
const config = getDefaultConfig(__dirname);

// Add support for TypeScript and other file extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'ts', 'tsx', 'cjs'];

// Add support for module resolution
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => {
      if (typeof name !== 'string') return null;
      
      // Handle @/ alias
      if (name.startsWith('@/')) {
        const relativePath = name.substring(2);
        return path.resolve(__dirname, relativePath);
      }
      
      // Fall back to default node module resolution
      return path.join(process.cwd(), `node_modules/${name}`);
    },
  }
);

// Apply NativeWind
module.exports = withNativeWind(config, { 
  input: "./app/global.css",
  projectRoot: __dirname,
});
