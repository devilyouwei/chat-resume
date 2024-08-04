/** 统一处理 Cookie */

import Cookies from "js-cookie";
import Markdown from "markdown-it";
import highlight from "highlight.js";

export const getToken = () => {
  return Cookies.get("qf-token");
};
export const setToken = (token: string) => {
  Cookies.set("qf-token", token);
};
export const removeToken = () => {
  Cookies.remove("qf-token");
};

// 图片
export const getAssetsImage = (path: string) => {
  return new URL(`../assets/images/${path}`, import.meta.url).href;
};

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// markdown

const mdOptions: Markdown.Options = {
  linkify: true,
  typographer: true,
  breaks: true,
  langPrefix: "language-",
  // 代码高亮
  highlight(str, lang) {
    if (lang && highlight.getLanguage(lang)) {
      return (
        '<pre class="hljs"><code>' +
        highlight.highlight(lang, str, true).value +
        "</code></pre>"
      );
    }
    return "";
  },
};
const md = new Markdown(mdOptions);
export { md };

// 获取网址中的token值
export function getURLParameter(name, url = window.location.href) {
  // const str = (new URL(url)).hash.split('?')[1]
  const str = url.split("?")?.[1];
  const pattern = /([^=&]+)=([^&]*)/g;
  const obj = {};
  let match;

  while ((match = pattern.exec(str)) !== null) {
    obj[match[1]] = match[2];
  }
  return obj[name];
}
