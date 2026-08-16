const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const pak = require("../package.json");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");

// Peer deps that the example MUST resolve from its own node_modules so we
// don't accidentally end up with two copies (one from the example, one from
// the parent's devDependencies).
const sharedPeers = Object.keys({
  ...pak.peerDependencies,
});

const escapeForRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const config = getDefaultConfig(projectRoot);

// Watch the parent so edits to ../src hot-reload in the example.
config.watchFolders = [workspaceRoot];

// Block the parent's copies of peer deps — force the example to use its own.
// Block the parent's ENTIRE node_modules — the example must never load a
// second copy of metro, react, or any peer from the workspace root.
config.resolver.blockList = [
  new RegExp(`^${escapeForRegex(path.join(workspaceRoot, "node_modules"))}\\/.*$`),
];
config.resolver.nodeModulesPaths = [path.join(projectRoot, "node_modules")];

config.resolver.extraNodeModules = sharedPeers.reduce((acc, name) => {
  acc[name] = path.join(projectRoot, "node_modules", name);
  return acc;
}, {});

module.exports = config;
