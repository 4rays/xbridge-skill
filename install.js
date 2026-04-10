#!/usr/bin/env node

/**
 * xhammer-skill Installer
 * Supports multiple installation methods:
 * 1. npx skills add 4rays/xhammer-skill
 * 2. /plugin marketplace add / /plugin install
 * 3. Clone and copy
 * 4. Git submodule
 * 5. Fork and customize
 * 6. npx skillkit install 4rays/xhammer-skill
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

function getTargetDirs() {
  const cwd = process.cwd();
  const home = os.homedir();

  return {
    globalAgents: path.join(home, '.agents', 'skills'),
    globalClaude: path.join(home, '.claude', 'skills'),
    localAgents: path.join(cwd, '.agents', 'skills'),
    localClaude: path.join(cwd, '.claude', 'skills'),
    legacyClaude: path.join(cwd, '.claude', 'skills'),
  };
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function copySkills(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    console.log(`Source directory not found: ${sourceDir}`);
    return false;
  }

  ensureDir(targetDir);

  const items = fs.readdirSync(sourceDir);
  let copied = 0;

  for (const item of items) {
    const sourcePath = path.join(sourceDir, item);
    const targetPath = path.join(targetDir, item);

    if (fs.existsSync(targetPath)) {
      console.log(`  ✓ ${item} already installed`);
      continue;
    }

    try {
      if (fs.statSync(sourcePath).isDirectory()) {
        fs.cpSync(sourcePath, targetPath, { recursive: true });
      } else {
        fs.copyFileSync(sourcePath, targetPath);
      }
      console.log(`  ✓ Installed ${item}`);
      copied++;
    } catch (err) {
      console.error(`  ✗ Failed to install ${item}: ${err.message}`);
    }
  }

  return copied > 0;
}

function createSymlink(source, target) {
  try {
    if (fs.existsSync(target)) {
      const stat = fs.lstatSync(target);
      if (stat.isSymbolicLink()) {
        fs.unlinkSync(target);
      } else {
        return;
      }
    }
    fs.symlinkSync(source, target, 'dir');
    console.log(`  ✓ Created symlink: ${target} → ${source}`);
  } catch (err) {
  }
}

function listSkills(skillsDir) {
  if (!fs.existsSync(skillsDir)) {
    return [];
  }
  return fs.readdirSync(skillsDir).filter(f => {
    return fs.statSync(path.join(skillsDir, f)).isDirectory();
  });
}

function install() {
  console.log('📦 xhammer-skill Installer\n');

  const dirs = getTargetDirs();
  const scriptDir = __dirname;
  const skillsDir = path.join(scriptDir, 'skills');

  const isGlobalInstall = !fs.existsSync(path.join(process.cwd(), 'skills'));

  if (isGlobalInstall) {
    console.log('Installing globally...');

    const agentsDir = ensureDir(dirs.globalAgents);
    copySkills(skillsDir, agentsDir);

    const claudeDir = ensureDir(dirs.globalClaude);
    createSymlink(agentsDir, claudeDir);

    console.log(`\n✅ Global installation complete!`);
    console.log(`   Skills installed to: ${agentsDir}`);
  } else {
    console.log('Installing to current project...');

    const agentsDir = ensureDir(dirs.localAgents);
    const copied = copySkills(skillsDir, agentsDir);

    const claudeDir = ensureDir(dirs.localClaude);
    createSymlink(agentsDir, claudeDir);

    if (copied) {
      console.log(`\n✅ Installation complete!`);
      console.log(`   Skills installed to: ${agentsDir}`);
      console.log(`   Claude Code symlink: ${claudeDir}`);
    } else {
      console.log(`\n✓ All skills already up to date`);
    }
  }

  console.log('\n📚 Available skills:');
  const skills = listSkills(skillsDir);
  skills.forEach(skill => {
    console.log(`   • ${skill}`);
  });

  console.log('\n🚀 Usage:');
  console.log('   Just ask Claude: "Build my Xcode project" or "Run tests"');
}

install();
