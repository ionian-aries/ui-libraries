/// <reference types="vitest" />
import { defineConfig } from 'vite';
import path, { format } from 'path';
import fs from 'fs-extra';
import * as glob from 'glob';
import { createVuePlugin as vue2 } from '@lcap/vite-plugin-vue2';
import { createGenScopedName, lcapPlugin } from '@lcap/builder';
import autoprefixer from 'autoprefixer';

// 设置测试运行的时区
process.env.TZ = 'Asia/Shanghai';

const SPLITOR = '__';
// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const pkgInfo = fs.readJSONSync('package.json');
  const componentVars = fs.readJSONSync('./src/styles/variables/vars.json');

  const entries = {};
  // const external = Object.keys(pkgInfo.dependencies).concat(Object.keys(pkgInfo.peerDependencies)).map((str) => new RegExp(`^${str}`));
  const external = ['vue', 'vue-router', 'vue-i18n', '@vue/composition-api'].concat(Object.keys(pkgInfo.peerDependencies)).map((str) => new RegExp(`^${str}`));
  glob.sync(['src/components/*/index.{tsx,ts,jsx,js}', 'src/pro-components/*/index.{tsx,ts,jsx,js}']).forEach((filePath) => {
    const arr = filePath.split('/');
    const basename = arr[arr.length - 2];
    entries[`components__${basename}`] = filePath;
  });

  return {
    plugins: [
      vue2({
        jsx: true,
        jsxOptions: {
          vModel: true,
          functional: false,
          injectH: true,
          vOn: true,
          compositionAPI: false,
        },
      }),
      {
        generateBundle(options, bundle) {
          Object.keys(bundle).forEach((fileName) => {
            const map = bundle[fileName];
            if (map.type !== 'chunk') {
              return;
            }

            if (map.viteMetadata.importedCss) {
              const importCodes = [];
              map.viteMetadata.importedCss.forEach((file) => {
                if (file.endsWith('-module.css')) {
                  map.imports.unshift(file);
                  importCodes.push(`import './${path.basename(file)}';`);
                }
                // map.imports.unshift(file);
              });
              if (importCodes.length > 0) {
                map.code = `${importCodes.join('\n')}\n${map.code}`;
              }
            }
          });
        },
      },
    ],
    optimizeDeps: {
      include: ['online-svg-icon-vue2'],
    },
    resolve: {
      extensions: [
        '.js',
        '.ts',
        '.tsx',
        '.jsx',
        '.vue',
        '.mjs',
        '.cjs',
        '.json',
      ],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@element-pro': path.resolve(__dirname, './design/components'),
        '@element-ui-icons': path.resolve(__dirname, './design/icons/index.js'),
        'swiper/swiper-bundle.esm.js': path.resolve(
          __dirname,
          './node_modules/swiper/swiper-bundle.esm.js',
        ),
        '@joskii/jflow-core': path.resolve(
          __dirname,
          './node_modules/@joskii/jflow-core/dist/jflow.es.min.js',
        ),
        '@joskii/jflow-vue2-plugin': path.resolve(
          __dirname,
          './node_modules/@joskii/jflow-vue2-plugin/dist/jflow-vue2-plugin.es.min.js',
        ),
      },
    },
    define: {
      'process.env': {
        VUE_APP_DESIGNER: false,
        NODE_ENV: command === 'build' ? 'production' : 'development',
      },
    },
    css: {
      modules: {
        getJSON: (...args) => {
          console.log(args);
        },
      },
      preprocessorOptions: {
        less: {
          modifyVars: componentVars,
        },
      },
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: ['> 1%', 'last 2 versions', 'ie >= 9'],
            grid: true,
          }),
        ],
      },
    },
    build: {
      cssCodeSplit: true,
      emitAssets: true,
      copyPublicDir: false,
      target: ['es2020', 'edge88', 'firefox78', 'chrome56', 'safari14'],
      lib: {
        entry: entries,
        formats: ['es'],
        fileName: (format, entryName) => {
          const srcPrefix = `src${SPLITOR}`;
          if (entryName.startsWith(srcPrefix)) {
            entryName = entryName.substring(srcPrefix.length);
          }

          if (entryName.startsWith('components__')) {
            return `${entryName.split(SPLITOR).join('/')}/index.js`;
          }

          return `${entryName.split(SPLITOR).join('/')}.js`;
        },
      },
      rollupOptions: {
        external,
        output: {
          format: 'es',
          // preserveModules: true,
          // preserveModulesRoot: 'src',
          // hoistTransitiveImports: false,
          chunkFileNames: '_chunks/dep-[hash].js',
          assetFileNames: (assetsInfo) => {
            if (assetsInfo.name.endsWith('.css')) {
              let entryName = assetsInfo.name;
              const srcPrefix = `src${SPLITOR}`;
              if (entryName.startsWith(srcPrefix)) {
                entryName = entryName.substring(srcPrefix.length);
              }

              if (entryName.endsWith('.module.css')) {
                entryName = entryName.replace('.module.css', '-module.css');
              }
              return `${entryName.split(SPLITOR).join('/')}`;
            }

            return assetsInfo.name;
          },
        },
      },
      outDir: 'es',
      modulePreload: false,
      minify: false,
    },
  };
});
