/**
 * API和资源配置
 * 用于配置移动端访问的服务器地址
 */

// 根据环境选择基础URL
// 开发环境: 使用本地网络IP (通过 npm run dev 启动的服务器)
// 生产环境: 使用实际部署的域名
const isDevelopment = __DEV__;

// 开发环境配置
// 注意: 请将 192.168.x.x 替换为您电脑的实际IP地址
// 可以通过 ipconfig (Windows) 或 ifconfig (Mac/Linux) 查看
const DEV_SERVER_URL = 'http://192.168.3.105:3005'; // 请修改为您的实际IP

// 生产环境配置
const PROD_SERVER_URL = 'https://www.monna.us'; // 生产环境域名

// 导出配置
export const API_CONFIG = {
  // API基础URL
  BASE_URL: isDevelopment ? DEV_SERVER_URL : PROD_SERVER_URL,

  // 静态资源基础URL (用于访问 /public 目录下的文件)
  ASSETS_URL: isDevelopment ? DEV_SERVER_URL : PROD_SERVER_URL,

  // 超时设置
  TIMEOUT: 30000,
};

/**
 * 获取完整的资源URL
 * @param path 相对路径，例如 '/figma-designs/portrait/IMAGE-1.jpg'
 * @returns 完整的URL
 */
export function getAssetUrl(path: string): string {
  // 移除开头的斜杠(如果有)
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_CONFIG.ASSETS_URL}/${cleanPath}`;
}

/**
 * 获取API端点URL
 * @param endpoint API端点，例如 '/api/jobs'
 * @returns 完整的API URL
 */
export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_CONFIG.BASE_URL}/${cleanEndpoint}`;
}
