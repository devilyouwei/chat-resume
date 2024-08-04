import { ref } from 'vue';
import { defineStore } from 'pinia';
import {
  chatContext,
  ChatMessage, checkKeyword, CheckKeywordParam, checkList, CheckListParam,
  createChat,
  CreateChatParam,
  getCommand,
  getSearchResult,
  matchRelated,
  previewFile, release,
  SearchChatParam,
  SearchParam, sub_abutment, SubChatParam, subCheckInfo,
  subKeyword,
  UploadFile
} from '@/apis';

export const useSearchStore = defineStore('search', () => {

  const searchKeyWord = ref('');
  const fileNameTit = ref('');

  // 父级对话id
  const parentChatId = ref<string>();
  // 历史记录列表
  const chatHistoryList = ref<ChatMessage[]>([]);
  // detailType
  const detailType = ref(0);
  const updateDetailType = (id) => detailType.value = id;
  // detailChatId
  const detailId = ref('');
  const updateDetailId = (id) => detailId.value = id;

  // 上传文件获取checkId
  const checkId = ref<string>();


  // 存储搜索内容
  function updateKeyWord(txt: string) {
    searchKeyWord.value = txt;
  }

  function updateFileNameTit(txt: string) {
    fileNameTit.value = txt;
  }

  // 开启新会话
  async function getChatId(param?: CreateChatParam) {
    const { data } = await createChat(param);
    if (!param) parentChatId.value = data;
    return Promise.resolve(data);
  }

  // 根据搜索内容获取搜索结果
  async function getSearchResultHandler(param: SearchParam) {
    const { data } = await getSearchResult(param);
    return data;
  }

  // submit chat message
  async function submitMessage(param: SubChatParam) {
    await subKeyword(param);
  }

  // 根据搜索结果id 获取 Context
  async function getChatContextHandler(deId?: string) {
    if (!parentChatId.value) return false;
    const id = deId || parentChatId.value;
    const { data } = await chatContext(id);
    chatHistoryList.value = data;
  }

  // 获取chat recommand list
  const recommandList = ref<string[]>();

  async function getRecommandList(id_list) {
    if (!id_list || id_list.length <= 0) return false;
    const { data } = await getCommand({ dialog_type: detailType.value, id_list });
    recommandList.value = data;
    return data;
  }

  // 文件上传
  const fileName = ref(''); // 文件名
  const filePath = ref(''); // 文件路径
  const updateFileName = (file: string) => {
    fileName.value = file;
  };
  const updateFilePath = (path: string) => {
    filePath.value = path;
  };

  async function getFileIdByFile(file: File) {
    const { data } = await UploadFile(file);
    const { file_path, filename } = data;
    fileName.value = filename;
    filePath.value = file_path;
  }

  const checkData = ref<{
    get_relatd: CheckListParam,
    sub_diagnosis_content: object,
    sub_diagnosis_words: object,
  }>();

  const updateCheckData = (d: any) => {
    checkData.value = d;
  };

  function previewFileInfo() {
    return previewFile(fileName.value);
  }

  function matchRelated() {
    const get_relatd = { ...checkData.value?.get_relatd } as CheckListParam;
    return checkList(get_relatd)
  }

  function matchRelatedKeywords() {
    const sub_diagnosis_words = { ...checkData.value?.sub_diagnosis_words } as CheckKeywordParam;
    return checkKeyword(sub_diagnosis_words);
  }

  // 成果详情
  const achieveInfoList = ref<{ [k: string]: any }>({});
  const updateAchieveInfoList = (item: object, id: string) => {
    achieveInfoList.value[id] = item;
  };

  // 需求详情
  const requireInfoList = ref<{ [k: string]: any }>({});
  const updateRequireInfoList = (item: object, id: string) => {
    requireInfoList.value[id] = item;
  };

  // 提交我要对接
  async function subAbutment(data) {
    await sub_abutment(data)
  }

  //
  async function subRelease(id) {
    await release({ id })
  }

  return {
    // state
    parentChatId,  // 父级对话id
    getChatId, // 创建ai chat，获取chatId
    submitMessage, // 提交message
    chatHistoryList,// 上下文历史列表
    detailType, // 详情页面 type
    updateDetailType, // 更新详情页面 type
    detailId, // 详情页面 聊天ID
    updateDetailId, // 更新详情页面 type
    searchKeyWord, // 搜索关键字（搜索结果页右侧列表入参）
    updateKeyWord, // 更新搜索关键字
    recommandList, // chat recommand
    getRecommandList, // chat recommand

    checkId, // 新诊断的 gptId
    fileName, // 上传文件返回唯一的 filename
    filePath, // 上传文件返回唯一的 filename
    updateFilePath,
    updateFileName,
    getFileIdByFile, // 上传file，获取filename
    checkData, // 更新诊断参数
    updateCheckData, // 更新诊断参数
    matchRelated, // 获取诊断相关列表
    matchRelatedKeywords,
    getSearchResult: getSearchResultHandler, // 获取搜索结果页的左侧列表数据
    getChatContext: getChatContextHandler, // ai chat context
    previewFileInfo, // 根据fileName获取文件的信息
    fileNameTit,
    updateFileNameTit,

    //  详情
    achieveInfoList,
    updateAchieveInfoList,
    requireInfoList,
    updateRequireInfoList,
    subAbutment,

    subRelease,
  };

},
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'search',
          storage: localStorage
        }
      ]
    }
  });

