export interface PageRequest {
    /**
     * 当前页号
     */
    pageNum: number

    /**
     * 页面大小
     */
    pageSize: number

    /**
     * 排序字段
     */
    sortField?: string

    /**
     * 排序顺序（默认升序）
     */
    sortOrder?: string
}