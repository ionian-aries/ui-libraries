/* eslint-disable no-param-reassign */
import fs from 'fs-extra';
import path from 'path';
import type { BuildMode, LcapBuildOptions } from './types';
import logger from '../utils/logger';
import { buildIDE } from './build-ide';
import { buildTheme } from './build-theme';
import buildCSSInfo from './build-css-info';
import { buildNaslExtension } from './build-extension';
import { execSync } from '../utils/exec';
import genNaslUIConfig from './gens/gen-nasl-ui';
import genThemeJsonOld from './gens/gen-theme-json-old';
import genManifestConfig from './gens/gen-manifest-config';
import buildDeclaration from './build-declaration';
import { buildModules } from './build-modules';
import { getConfigComponents } from '../utils';

export function buildThemeOld(rootPath, destDir) {
  const configPath = path.join(rootPath, './lcap-ui.config.js');
  const themeConfigPath = path.join(rootPath, './lcap-ui.theme.json');

  if (!fs.existsSync(configPath) || !fs.existsSync(themeConfigPath)) {
    return;
  }

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const confg = require(configPath);

  genThemeJsonOld({
    rootPath,
    destPath: destDir,
    themePath: confg.themePath,
    themeConfigPath: 'lcap-ui.theme.json',
  });
}

export function buildNaslUI(options: LcapBuildOptions) {
  if (options.type !== 'nasl.ui') {
    return;
  }

  logger.start('开始生成 nasl.ui.json...');
  let naslUIConfig = genNaslUIConfig({
    rootPath: options.rootPath,
    framework: options.framework,
    components: options.components,
    assetsPublicPath: options.assetsPublicPath,
  });

  if (options.dependencies && options.dependencies.length > 0) {
    options.dependencies.forEach(({ rootPath, config }) => {
      const configFn = typeof config === 'function' ? config : (c) => c;
      const list = genNaslUIConfig({
        rootPath,
        framework: options.framework,
        components: getConfigComponents(rootPath),
        assetsPublicPath: options.assetsPublicPath,
        dependency: true,
      });

      naslUIConfig.unshift(...list.map((it) => configFn(it)));
    });
  }

  naslUIConfig = naslUIConfig.sort((c1, c2) => {
    const order1 = c1.order || 20;
    const order2 = c2.order || 20;

    return order1 - order2;
  });

  logger.success('生成 nasl.ui.json 成功！');
  fs.writeJSONSync(path.join(options.destDir, 'nasl.ui.json'), naslUIConfig, { spaces: 2 });
}

export function buildI18N(options: LcapBuildOptions) {
  const {
    rootPath,
    i18n,
  } = options;

  if (!i18n) {
    return;
  }

  const langs = Object.keys(i18n);
  if (!langs || langs.length === 0) {
    logger.warn('未找到i18n 配置文件');
    return;
  }

  const data = {};

  langs.forEach((key) => {
    data[key] = fs.readJSONSync(path.join(rootPath, i18n[key]));
  });

  const destDir = path.join(rootPath, options.destDir);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const destFile = `${destDir}/i18n.json`;
  fs.writeJSONSync(destFile, data, { spaces: 2 });
}

export function buildManifest(options: LcapBuildOptions) {
  const manifest = genManifestConfig(options);
  fs.writeJSONSync(`${options.destDir}/manifest.json`, manifest, { spaces: 2 });
  fs.writeJSONSync(`${options.rootPath}/manifest.json`, manifest, { spaces: 2 });
}

export async function buildNaslUILibrary(options: LcapBuildOptions, mode: BuildMode = 'production') {
  await buildNaslUI(options);
  await buildCSSInfo(options);
  await buildTheme(options, mode === 'watch');
  await buildI18N(options);
  await buildDeclaration(options);

  if (mode === 'production') {
    await buildModules(options);
  }

  await buildManifest(options);

  if (mode !== 'production') {
    return;
  }

  if (options.pnpm) {
    execSync('pnpm pack');
  } else {
    execSync('npm pack');
  }
}

export async function lcapBuild(options: LcapBuildOptions, mode: BuildMode = 'production') {
  if (!options.destDir) {
    options.destDir = 'dist-theme';
  }

  if (mode === 'production') {
    await buildIDE(options);
  }

  if (options.type === 'extension') {
    await buildNaslExtension(options, mode);
    return;
  }

  await buildNaslUILibrary(options, mode);
}
