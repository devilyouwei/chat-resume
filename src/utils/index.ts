/** 统一处理 Cookie */

import Cookies from "js-cookie"

export const getToken = () => {
  return Cookies.get('qf-token')
}
export const setToken = (token: string) => {
  Cookies.set('qf-token', token)
}
export const removeToken = () => {
  Cookies.remove('qf-token')
}


// 图片
export const getAssetsImage = (path: string) => {
  return new URL(`../assets/images/${path}`, import.meta.url).href
}

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

// 文件icon
export const ICONS = {
  pdf: 'icons/pdf.png',
  wps: 'icons/word.png',
  doc: 'icons/word.png',
  docx: 'icons/word.png'
  // ppt: 'icons/ppt.png',
  // pptx: 'icons/ppt.png',
  // xls: 'icons/xls.png',
  // xlsx: 'icons/xls.png',
  // et: 'icons/xls.png',
  // csv: 'icons/xls.png',
  // txt: 'icons/txt.png',
  // md: 'icons/md.png',
  // json: 'icons/json.png',
  // jpg: 'icons/image.png',
  // png: 'icons/image.png',
  // jpeg: 'icons/image.png',
  // webp: 'icons/image.png'
}

export const AREA = [
  {
    value: '上海市',
    label: '上海市',
    children: [
      {
        value: '浦东新区',
        label: '浦东新区'
      },
      {
        value: '徐汇区',
        label: '徐汇区'
      },
      {
        value: '长宁区',
        label: '长宁区'
      },
      {
        value: '静安区',
        label: '静安区'
      },
      {
        value: '普陀区',
        label: '普陀区'
      },
      {
        value: '虹口区',
        label: '虹口区'
      },
      {
        value: '杨浦区',
        label: '杨浦区'
      },
      {
        value: '闵行区',
        label: '闵行区'
      },
      {
        value: '宝山区',
        label: '宝山区'
      },
      {
        value: '嘉定区',
        label: '嘉定区'
      },
      {
        value: '金山区',
        label: '金山区'
      },
      {
        value: '松江区',
        label: '松江区'
      },
      {
        value: '青浦区',
        label: '青浦区'
      },
      {
        value: '奉贤区',
        label: '奉贤区'
      },
      {
        value: '崇明区',
        label: '崇明区'
      },
      {
        value: '黄浦区',
        label: '黄浦区'
      }
    ]
  },
  {
    value: '江苏省',
    label: '江苏省',
    children: [
      {
        value: '南京市',
        label: '南京市',
        children: [
          {
            value: '玄武区',
            label: '玄武区'
          },
          {
            value: '秦淮区',
            label: '秦淮区'
          },
          {
            value: '建邺区',
            label: '建邺区'
          },
          {
            value: '鼓楼区',
            label: '鼓楼区'
          },
          {
            value: '浦口区',
            label: '浦口区'
          },
          {
            value: '栖霞区',
            label: '栖霞区'
          },
          {
            value: '雨花台区',
            label: '雨花台区'
          },
          {
            value: '江宁区',
            label: '江宁区'
          },
          {
            value: '六合区',
            label: '六合区'
          },
          {
            value: '溧水区',
            label: '溧水区'
          },
          {
            value: '高淳区',
            label: '高淳区'
          }
        ]
      },
      {
        value: '无锡市',
        label: '无锡市',
        children: [
          {
            value: '锡山区',
            label: '锡山区'
          },
          {
            value: '惠山区',
            label: '惠山区'
          },
          {
            value: '滨湖区',
            label: '滨湖区'
          },
          {
            value: '梁溪区',
            label: '梁溪区'
          },
          {
            value: '新吴区',
            label: '新吴区'
          },
          {
            value: '江阴市',
            label: '江阴市'
          },
          {
            value: '宜兴市',
            label: '宜兴市'
          }
        ]
      },
      {
        value: '常州市',
        label: '常州市',
        children: [
          {
            value: '天宁区',
            label: '天宁区'
          },
          {
            value: '钟楼区',
            label: '钟楼区'
          },
          {
            value: '新北区',
            label: '新北区'
          },
          {
            value: '武进区',
            label: '武进区'
          },
          {
            value: '金坛区',
            label: '金坛区'
          },
          {
            value: '溧阳市',
            label: '溧阳市'
          }
        ]
      },
      {
        value: '苏州市',
        label: '苏州市',
        children: [
          {
            value: '虎丘区',
            label: '虎丘区'
          },
          {
            value: '吴中区',
            label: '吴中区'
          },
          {
            value: '相城区',
            label: '相城区'
          },
          {
            value: '姑苏区',
            label: '姑苏区'
          },
          {
            value: '吴江区',
            label: '吴江区'
          },
          {
            value: '苏州工业园区',
            label: '苏州工业园区'
          },
          {
            value: '常熟市',
            label: '常熟市'
          },
          {
            value: '张家港市',
            label: '张家港市'
          },
          {
            value: '昆山市',
            label: '昆山市'
          },
          {
            value: '太仓市',
            label: '太仓市'
          }
        ]
      },
      {
        value: '徐州市',
        label: '徐州市',
        children: [
          {
            value: '鼓楼区',
            label: '鼓楼区'
          },
          {
            value: '云龙区',
            label: '云龙区'
          },
          {
            value: '贾汪区',
            label: '贾汪区'
          },
          {
            value: '泉山区',
            label: '泉山区'
          },
          {
            value: '铜山区',
            label: '铜山区'
          },
          {
            value: '丰县',
            label: '丰县'
          },
          {
            value: '沛县',
            label: '沛县'
          },
          {
            value: '睢宁县',
            label: '睢宁县'
          },
          {
            value: '徐州经济技术开发区',
            label: '徐州经济技术开发区'
          },
          {
            value: '新沂市',
            label: '新沂市'
          },
          {
            value: '邳州市',
            label: '邳州市'
          }
        ]
      },
      {
        value: '南通市',
        label: '南通市',
        children: [
          {
            value: '通州区',
            label: '通州区'
          },
          {
            value: '崇川区',
            label: '崇川区'
          },
          {
            value: '海门区',
            label: '海门区'
          },
          {
            value: '如东县',
            label: '如东县'
          },
          {
            value: '南通经济技术开发区',
            label: '南通经济技术开发区'
          },
          {
            value: '启东市',
            label: '启东市'
          },
          {
            value: '如皋市',
            label: '如皋市'
          },
          {
            value: '海安市',
            label: '海安市'
          }
        ]
      },
      {
        value: '连云港市',
        label: '连云港市',
        children: [
          {
            value: '连云区',
            label: '连云区'
          },
          {
            value: '海州区',
            label: '海州区'
          },
          {
            value: '赣榆区',
            label: '赣榆区'
          },
          {
            value: '东海县',
            label: '东海县'
          },
          {
            value: '灌云县',
            label: '灌云县'
          },
          {
            value: '灌南县',
            label: '灌南县'
          },
          {
            value: '连云港经济技术开发区',
            label: '连云港经济技术开发区'
          },
          {
            value: '连云港高新技术产业开发区',
            label: '连云港高新技术产业开发区'
          }
        ]
      },
      {
        value: '淮安市',
        label: '淮安市',
        children: [
          {
            value: '淮安区',
            label: '淮安区'
          },
          {
            value: '淮阴区',
            label: '淮阴区'
          },
          {
            value: '清江浦区',
            label: '清江浦区'
          },
          {
            value: '洪泽区',
            label: '洪泽区'
          },
          {
            value: '涟水县',
            label: '涟水县'
          },
          {
            value: '盱眙县',
            label: '盱眙县'
          },
          {
            value: '金湖县',
            label: '金湖县'
          },
          {
            value: '淮安经济技术开发区',
            label: '淮安经济技术开发区'
          }
        ]
      },
      {
        value: '盐城市',
        label: '盐城市',
        children: [
          {
            value: '亭湖区',
            label: '亭湖区'
          },
          {
            value: '盐都区',
            label: '盐都区'
          },
          {
            value: '大丰区',
            label: '大丰区'
          },
          {
            value: '响水县',
            label: '响水县'
          },
          {
            value: '滨海县',
            label: '滨海县'
          },
          {
            value: '阜宁县',
            label: '阜宁县'
          },
          {
            value: '射阳县',
            label: '射阳县'
          },
          {
            value: '建湖县',
            label: '建湖县'
          },
          {
            value: '盐城经济技术开发区',
            label: '盐城经济技术开发区'
          },
          {
            value: '东台市',
            label: '东台市'
          }
        ]
      },
      {
        value: '扬州市',
        label: '扬州市',
        children: [
          {
            value: '广陵区',
            label: '广陵区'
          },
          {
            value: '邗江区',
            label: '邗江区'
          },
          {
            value: '江都区',
            label: '江都区'
          },
          {
            value: '宝应县',
            label: '宝应县'
          },
          {
            value: '扬州经济技术开发区',
            label: '扬州经济技术开发区'
          },
          {
            value: '仪征市',
            label: '仪征市'
          },
          {
            value: '高邮市',
            label: '高邮市'
          }
        ]
      },
      {
        value: '镇江市',
        label: '镇江市',
        children: [
          {
            value: '京口区',
            label: '京口区'
          },
          {
            value: '润州区',
            label: '润州区'
          },
          {
            value: '丹徒区',
            label: '丹徒区'
          },
          {
            value: '镇江新区',
            label: '镇江新区'
          },
          {
            value: '丹阳市',
            label: '丹阳市'
          },
          {
            value: '扬中市',
            label: '扬中市'
          },
          {
            value: '句容市',
            label: '句容市'
          }
        ]
      },
      {
        value: '泰州市',
        label: '泰州市',
        children: [
          {
            value: '海陵区',
            label: '海陵区'
          },
          {
            value: '高港区',
            label: '高港区'
          },
          {
            value: '姜堰区',
            label: '姜堰区'
          },
          {
            value: '泰州医药高新技术产业开发区',
            label: '泰州医药高新技术产业开发区'
          },
          {
            value: '兴化市',
            label: '兴化市'
          },
          {
            value: '靖江市',
            label: '靖江市'
          },
          {
            value: '泰兴市',
            label: '泰兴市'
          }
        ]
      },
      {
        value: '宿迁市',
        label: '宿迁市',
        children: [
          {
            value: '宿城区',
            label: '宿城区'
          },
          {
            value: '宿豫区',
            label: '宿豫区'
          },
          {
            value: '沭阳县',
            label: '沭阳县'
          },
          {
            value: '泗阳县',
            label: '泗阳县'
          },
          {
            value: '泗洪县',
            label: '泗洪县'
          },
          {
            value: '宿迁经济技术开发区',
            label: '宿迁经济技术开发区'
          }
        ]
      }
    ]
  }
]

// markdown
import Markdown from 'markdown-it'
import highlight from 'highlight.js'
import markdownItCharts from 'markdown-it-charts'

const mdOptions: Markdown.Options = {
  linkify: true,
  typographer: true,
  breaks: true,
  langPrefix: 'language-',
  // 代码高亮
  highlight(str, lang) {
    if (lang && highlight.getLanguage(lang)) {
      return (
        '<pre class="hljs"><code>' + highlight.highlight(lang, str, true).value + '</code></pre>'
      )
    }
    return ''
  }
}
const md = new Markdown(mdOptions)
export { md }

// 获取网址中的token值
export function getURLParameter(name, url = window.location.href) {
  // const str = (new URL(url)).hash.split('?')[1]
  const str = url.split('?')?.[1]
  const pattern = /([^=&]+)=([^&]*)/g
  const obj = {}
  let match
  
  while ((match = pattern.exec(str)) !== null) {
    obj[match[1]] = match[2]
  }
  return obj[name]
}



