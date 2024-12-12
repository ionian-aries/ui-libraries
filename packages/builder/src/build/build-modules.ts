import {
  build,
  loadConfigFromFile,
  mergeConfig,
  type UserConfig,
  type Plugin,
  normalizePath,
} from 'vite';
import { kebabCase } from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import { virtualInjectCSSFileId, virtualThemeCSSFileId } from '../constants/virtual-file-names';
import logger from '../utils/logger';
import type { BuildModulesOptions, LcapBuildOptions } from './types';
import { getComponentMetaInfos } from '../utils/lcap';
import type { ComponentMetaInfo } from '../utils/types';
import { getBuildOutputConifg } from '../utils/build-utils';

function getTagName(name: string, framework: string) {
  let key = name;
  if (framework.startsWith('vue')) {
    key = kebabCase(name);
  }

  return key;
}
const genCompEntryName = (name: string, framework: string) => `components/${getTagName(name, framework)}/index`;

export function LcapBuildModulesCSS() {
  const CSS_LANGS_RE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/;
  const cssModuleRE = new RegExp(`\\.module${CSS_LANGS_RE.source}`);
  const isModuleCSSRequest = (request: string): boolean => cssModuleRE.test(request);
  const cssInjectorText = `
  export function injectStyle(css, insertAt = 'top') {
    if (!css || typeof document === 'undefined') return
    const head = document.head || document.querySelector('head')
    const firstChild = head.querySelector(':first-child')
    const style = document.createElement('style')
    style.appendChild(document.createTextNode(css))
    if (insertAt === 'top' && firstChild) {
      head.insertBefore(style, firstChild)
    } else {
      head.appendChild(style)
    }
  }
  `;
  const stylesMap = new Map<string, string>();

  return [{
    name: 'vite-lcap:build-modules-css-pre',
    resolveId(source) {
      if (source === virtualInjectCSSFileId) {
        return virtualInjectCSSFileId;
      }

      if (source === virtualThemeCSSFileId) {
        return virtualThemeCSSFileId;
      }

      return undefined;
    },
    load(id) {
      if (id === virtualInjectCSSFileId) {
        return cssInjectorText;
      }

      if (id === virtualThemeCSSFileId) {
        return '';
      }

      return undefined;
    },
    transform(code, id) {
      if (isModuleCSSRequest(id)) {
        stylesMap.set(id, code);
      }
    },
  }, {
    name: 'vite-lcap:build-modules-css-post',
    enforce: 'post',
    transform(code, id) {
      if (!isModuleCSSRequest(id) || !stylesMap.has(id)) {
        return null;
      }

      const cssCode = stylesMap.get(id) || '';
      const cssString = cssCode.replace(/ *\\9/g, '').replace(/\\(\d+)/g, '0o$1');
      const injections = `\nimport { injectStyle } from '${virtualInjectCSSFileId}';\ninjectStyle(${JSON.stringify(cssString)}, 'bottom');`;

      return {
        code: code + injections,
        map: null,
      };
    },
    generateBundle(_, bundle) { // 构建 lib 移除 assets
      Object.keys(bundle).forEach((file) => {
        if (bundle[file].type === 'asset') {
          delete bundle[file];
        }
      });
    },
  }] as Plugin[];
}

export function getModuleEntries(options: BuildModulesOptions, components: ComponentMetaInfo[]) {
  const entries: { [key: string]: string } = {
    ...(options.entries ? options.entries : {}),
  };

  components.forEach(({ name, tsPath }) => {
    const entryName = genCompEntryName(name, options.framework);
    const basename = path.basename(tsPath);
    if (basename !== 'api.ts') {
      return;
    }

    entries[entryName] = normalizePath(path.relative(options.rootPath, path.resolve(tsPath, '../index')));
  });

  const logicEntry = 'src/logics/index.ts';
  if (fs.existsSync(logicEntry)) {
    entries['logics/index'] = 'src/logics/index.ts';
  }

  return entries;
}

async function viteBuildModules(options: BuildModulesOptions, components: ComponentMetaInfo[]): Promise<Record<string, string[]>> {
  const loadResult = await loadConfigFromFile({ command: 'build', mode: 'production' });
  if (!loadResult || !loadResult.config) {
    throw new Error('未找到 vite 配置文件');
  }

  const { external } = getBuildOutputConifg(options);

  if (options.external && options.external.length > 0) {
    external.push(...options.external);
  }

  const entries = getModuleEntries(options, components);

  const exportsMap: Record<string, string[]> = {};

  Object.keys(entries).forEach((name) => {
    exportsMap[name] = [];
  });

  let buildConfig: UserConfig = {
    define: {
      'process.env': {
        NODE_ENV: 'production',
      },
    },
    build: {
      emptyOutDir: true,
      copyPublicDir: false,
      minify: false,
      sourcemap: false,
      lib: {
        entry: entries,
        formats: ['es'],
      },
      rollupOptions: {
        external,
        output: {
          format: 'es',
          chunkFileNames: '_chunks/dep-[hash].mjs',
        },
      },
      outDir: options.outDir,
    },
  };

  const { config } = loadResult;
  if (config.build && config.build.lib) {
    delete config.build.lib;
  }

  buildConfig = mergeConfig(config, buildConfig);

  if (!buildConfig.plugins) {
    buildConfig.plugins = [];
  } else {
    buildConfig.plugins = buildConfig.plugins.flat().filter((p: any) => (p && (!p.name || !p.name.startsWith('vite:lcap-')))) || [];
  }

  buildConfig.plugins.push(LcapBuildModulesCSS());
  buildConfig.plugins.push({
    name: 'vite:lcap-collect-export',
    renderChunk(_, chunk) {
      if (!exportsMap[chunk.name]) {
        return;
      }

      exportsMap[chunk.name].push(...chunk.exports);
    },
  });

  await build({
    configFile: false,
    envFile: false,
    ...buildConfig,
  });

  return exportsMap;
}

async function generateModulesJSON(options: BuildModulesOptions, exportsMap: Record<string, string[]>, components: ComponentMetaInfo[]) {
  const filePath = path.resolve(options.rootPath, options.outDir, 'modules.json');
  const exportNameMap: { [name: string]: any } = {};
  const apiPathMap: Record<string, string> = {};

  components.forEach((metaInfo) => {
    const apiPath = path.relative(options.rootPath, metaInfo.tsPath);
    apiPathMap[metaInfo.name] = apiPath;

    if (Array.isArray(metaInfo.children)) {
      metaInfo.children.forEach((m) => {
        apiPathMap[m.name] = apiPath;
      });
    }
  });

  Object.keys(exportsMap).forEach((entry) => {
    let exportNames = exportsMap[entry];
    if (!exportNames || exportNames.length === 0) {
      return;
    }

    exportNames = exportNames.filter((name) => name !== 'default');
    if (exportNames.length === 0) {
      const comp = components.find((cp) => (genCompEntryName(cp.name, options.framework) === entry));
      if (comp) {
        exportNameMap[comp.name] = {
          src: entry,
          isDefault: true,
        };
      }
      return;
    }

    exportNames.forEach((name) => {
      exportNameMap[name] = {
        src: entry,
        isDefault: false,
      };
    });
  });

  fs.writeJSONSync(filePath, { exports: exportNameMap, api: apiPathMap }, { spaces: 2 });
}

export async function buildModules(options: LcapBuildOptions) {
  if (!options.modules) {
    return;
  }
  const buildModulesOptions: BuildModulesOptions = {
    rootPath: options.rootPath,
    type: options.type,
    framework: options.framework,
    outDir: 'es',
  };

  if (typeof options.modules === 'object') {
    Object.assign(buildModulesOptions, options.modules);
  }

  logger.start('开始模块构建....');
  const components = getComponentMetaInfos(options.rootPath, true);
  const exportsMap = await viteBuildModules(buildModulesOptions, components);
  await generateModulesJSON(buildModulesOptions, exportsMap, components);
  logger.success('已完成模块构建....');
}
