const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add custom resolver for web platform
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

config.resolver.alias = {
  ...(config.resolver.alias || {}),
};

// Custom resolver to handle native-only modules on web
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle native-only module for web platform
  if (platform === 'web' && moduleName === 'react-native/Libraries/Utilities/codegenNativeCommands') {
    return {
      filePath: require.resolve('./metro-empty-module.js'),
      type: 'sourceFile',
    };
  }
  
  // Use the default resolver for all other cases
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;