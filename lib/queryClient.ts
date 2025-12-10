import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 在这里设置默认的查询选项
      staleTime: 1000 * 60 * 5, // 5分钟
      retry: 1, // 失败时重试1次
    },
  },
})