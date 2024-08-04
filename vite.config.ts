import fs from "fs";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import viteCompression from "vite-plugin-compression";
import progress from "vite-plugin-progress";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import vueJsx from "@vitejs/plugin-vue-jsx";
import VueDevTools from "vite-plugin-vue-devtools";
import topLevelAwait from "vite-plugin-top-level-await";

const optimizeDepsElementPlusIncludes = ["element-plus/es"];

fs.readdirSync("node_modules/element-plus/es/components").map((dirname) => {
  fs.access(
    `node_modules/element-plus/es/components/${dirname}/style/css.mjs`,
    (err) => {
      if (!err) {
        optimizeDepsElementPlusIncludes.push(
          `element-plus/es/components/${dirname}/style/css`
        );
      }
    }
  );
});

export default defineConfig(({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  return {
    plugins: [
      //配置需要使用的插件列表
      vue(),
      vueJsx(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      // visualizer({ open: true }),
      VueDevTools(),
      progress(),
      viteCompression({
        verbose: true,
        disable: false,
        deleteOriginFile: false,
        threshold: 10240,
        algorithm: "gzip",
        ext: ".gz",
      }),
      chunkSplitPlugin({
        strategy: "default",
      }),
      topLevelAwait({
        promiseExportName: "__tla",
        promiseImportName: (i) => `__tla_${i}`,
      }),
    ],
    optimizeDeps: {
      // include: ['pdfjs-dist', ...optimizeDepsElementPlusIncludes],
      include: [...optimizeDepsElementPlusIncludes],
      exclude: ["pdfjs-dist"],
    },
    //静态资源服务的文件夹
    publicDir: "public",
    base: "/",
    assetsInclude: "",
    logLevel: "info",
    clearScreen: false,
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
      conditions: [],
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },
    // css
    css: {
      modules: {},
      postcss: {
        plugins: [
          /*           postcsspxtoviewport({
                      unitToConvert: 'px', // 默认值`px`，需要转换的单位
                      viewportWidth: 1920, // 视窗的宽度,对应设计稿宽度
                      // viewportHeight: 667, // 视窗的高度, 根据375设备的宽度来指定，一般是667，也可不配置
                      unitPrecision: 6, // 指定`px`转换为视窗单位值的小数位数
                      propList:  ['*'],  // 转化为vw的属性列表  propList: ["*",'!font-size'],这表示：所有css属性的属性的单位都进行转化，除了font-size的
                      viewportUnit: 'vw', // 指定需要转换成视窗单位
                      fontViewportUnit: 'vw', // 字体使用的视窗单位
                      selectorBlackList: ['ignore'], // 指定不需要转换为视窗单位的类 selectorBlackList: ['wrap'],它表示形如wrap,my-wrap,wrapper这样的类名的单位，都不会被转换
                      mediaQuery: false, // 允许在媒体查询中转换`px`
                      minPixelValue: 1, // 小于或等于`1px`时不转换为视窗单位
                      replace: true, // 是否直接更换属性值而不添加备用属性
                      landscape: false // 是否处理横屏情况 是否添加根据landscapeWidth生成的媒体查询条件 @media (orientation: landscape)
                      // exclude: [/node_modules/], // 忽略某些文件夹下的文件或特定文件 用正则做目录名匹配
                      // landscapeUnit: "vw", // 横屏时使用的单位
                      // landscapeWidth: 1134 // 横屏时使用的视窗宽度
                    }), */
        ],
      },
      preprocessorOptions: {
        scss: {
          additionalData: `
        @use "@/assets/style/variables.scss" as *;
        `,
        },
      },
    },
    json: {
      namedExports: true,
      stringify: false,
    },
    esbuild: {
      jsxFactory: "h",
      jsxFragment: "Fragment",
      jsxInject: `import Vue from 'vue'`,
    },
    //本地运行配置，以及反向代理配置
    server: {
      host: "localhost",
      https: false,
      cors: true,
      open: true,
      port: 9000,
      strictPort: false,
      force: true,
      hmr: true,
      watch: {
        ignored: ["!**/node_modules/your-package-name/**"],
      },
      proxy: {
        "/api": {
          target: env.VITE_BASE_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^/, ""), // 将请求中/api用空值替换重写，根据实际业务修改
        },
      },
    },
    //打包配置
    build: {
      target: "modules",
      outDir: "dist",
      assetsDir: "assets",
      assetsInlineLimit: 4096,
      cssCodeSplit: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          format: "es",
          manualChunks(id, { getModuleInfo, getModuleIds }) {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
      commonjsOptions: {},
      manifest: false,
      minify: "terser", //terser 构建后文件体积更小
      terserOptions: {},
      write: true,
      emptyOutDir: true,
      chunkSizeWarningLimit: 500,
    },
    ssr: {
      external: [],
      noExternal: [],
    },
  };
});

// export default () =>
//   defineConfig({
//
//   })
