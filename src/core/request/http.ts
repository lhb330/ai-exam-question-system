import axios from 'axios'
import { setupInterceptors } from './interceptors'
import type { ApiResponse,PageResult } from '@/types'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000
})

setupInterceptors(http)

export async function request<T>(config: Parameters<typeof http.request>[0]): Promise<T> {
  const response = await http.request<ApiResponse<T>>(config)
  return response.data.data
}

export async function requestPage<T>(config: Parameters<typeof http.request>[0]): Promise<PageResult<T>> {
  const response = await http.request<PageResult<T>>(config)
  // 返回的是 分页对象（包含 data、total、pageNum）
  return response.data
}

export default http
