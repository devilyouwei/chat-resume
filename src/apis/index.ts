import { request } from "@/utils/service";

export interface UserInfo {
  createBy: string; // 'admin'
  createTime: string; // '2023-03-15 09:00:48'
  updateBy: string;
  updateTime: string;
  remark: string; // '管理员'
  userId: number;
  deptId: number;
  userName: string;
  nickName: string;
  email: string;
  phonenumber: string;
  sex: string; // '1',
  avatar: string; // '/profile/avatar/2023/05/10/qocErRsh9B6j49ce85cbcf773256e1647407cda0e8f9_20230510111014A002.png',
  password: string;
  status: string;
  delFlag: string;
  loginIp: string;
  loginDate: string; // '2024-04-29T10:59:57.000+08:00',
  dept?: any;
}

export interface AIItem {
  createBy: string;
  createTime: string;
  id: number;
  isDelete: number;
  remark: [];
  title: string;
  updateBy: string;
  updateTime: string;
  userId: string;
}

export interface SearchParam {
  contentType: 1 | 2 | 3; // 类型 1成果 2需求 3人才
  pageNum: number;
  pageSize: number;
}

export interface SearchChatParam {
  contentIds: (number | string)[];
  contentType: 1 | 2 | 3; // 类型 1成果 2需求 3人才
  dialogId: number;
  question: string;
  userId: string | number;
}

export interface ChatMessage {
  content: string;
  role: "user" | "assistant" | "system";
}

export interface UploadFileInfo {
  file_path: string;
  filename: string; // "d8e0c075e54b49ff9493d0c0f5917e69_20240606165536.pdf",
}

export interface SubChatParam {
  dialog_type: string;
  dialog_info: string;
  dialog_id: string;
  file_name?: string;
  file_path?: string;
  section_info?: string;
}

enum Api {
  CreateChat = "/create_dialog_id", // 创建对话id
  AiChatHistory = "/get_dialog_info", // 聊天历史记录
  SubKeyword = "/sub_dialog_info", // 主对话框提交message
  Upload = "/upload_file", // 上传
  Search = "/get_match_list", // 搜索结果左侧列表
  Recommand = "/dialog_question_template", // 搜索结果右侧对话推荐问题
  CheckList = "/get_related", // 诊断列表
  CheckKeyword = "/sub_diagnosis", // 诊断列表
  Sub_abutment = "/sub_abutment",
  Preview = "/ai/downloadMinio", // 预览
  Release = "/is_release", // 预览
}

// 开启新对话
export interface CreateChatParam {
  head_dialog_id: string;
  dialog_info_id: string;
}

export const createChat = (data?: CreateChatParam) =>
  request.post<ApiResponseData<string>>(Api.CreateChat, data);

// 获取历史记录
export const chatContext = (dialog_id: string) =>
  request.post<ApiResponseData<ChatMessage[]>>(Api.AiChatHistory, {
    dialog_id,
  });

export const subKeyword = (data: SubChatParam) =>
  request.post(Api.SubKeyword, data);

// 首页搜索结果
export const getSearchResult = (data: SearchParam) =>
  request.post<
    ApiResponseData<{
      data: [];
      page: { page: number; size: number; total: number };
    }>
  >(Api.Search, data);

// 搜索结果右侧对话推荐问题
export const getCommand = (data: { dialog_type: number; id_list: number[] }) =>
  request.post<ApiResponseData<string[]>>(Api.Recommand, data);

// 文件上传 Api.Upload
export const UploadFile = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return request.post<ApiResponseData<UploadFileInfo>>(Api.Upload, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export interface CheckListParam {
  diagnosis_type: number; // 1、成果评估 2、需求诊断
  page: number;
  file_name: string;
}

export const checkList = (data: CheckListParam) =>
  request.post<{ achieve: []; require: [] }>(Api.CheckList, data);

export const release = (data: { id: number }) =>
  request.post(Api.Release, data);

// 文件预览 Api.Preview
export const previewFile = (fileName: string) =>
  request.get(
    Api.Preview,
    { fileName },
    {
      // responseType: 'blob'
      responseType: "arraybuffer",
    }
  );

// 诊断相关内容 Api.CheckKeyword
export interface CheckKeywordParam {
  diagnosis_type: number; // 1、成果评估 2、需求诊断
  file_name: string; //
  section_type: number; // 数据节点类型 1、关键词
  section_info: string; // 提交的文字信息
}

export const checkKeyword = (data: CheckKeywordParam) =>
  request.post<ApiResponseData<string[]>>(Api.CheckKeyword, data);
export const sub_abutment = (data: object) =>
  request.post(Api.Sub_abutment, data);

export const fetchToken = () =>
  request.post<ApiResponseData<string>>("/getAppAccessTokenBackendToken", {
    KEY: "f02f6f4b4e1e3524",
    APPID: "ST6f4BM7AJRPaWJsM1lsMo6+xW/fsuy/F9E18qgwRZM=",
    SECRET: "BZATz0qPu7LPFRoQ+kqiHg==",
    USERID: "1111",
  });
