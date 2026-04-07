import { ref } from 'vue'

export function usePagination() {
  const pageNum = ref(1)
  const pageSize = ref(10)
  return { pageNum, pageSize }
}
