export const APP_NAME = 'AI智能出题考试系统'

/**
 * 角色编码常量
 */
export const ROLE_CODE = {
  SYSTEM_ADMIN: 'system_admin',  // 系统管理员
  PRINCIPAL: 'principal',        // 校长/负责人
  TEACHER: 'teacher',            // 教师
  STUDENT: 'student'             // 学生
} as const

/**
 * 年阶
 */
export const STAGE_CODE_CONST = {
  PRIMARY: {code: 'primary', msg: '小学'},  
  JUNIOR: {code: 'junior', msg: '初中' },   
  SENIOR: {code: 'senior', msg: '高中'}
} as const

/**
 * 定义视图的模式
 */
export const VIEW_EDIT_MODE = {
  Edit: 'Edit',
  New: 'New',
  View: 'View'
} as const

/**
 * 通用状态
 */
export const STATUS_CONST = {
  /**
   * 启用
   */
  ENABLED: {code:1, msg: '启用'},
  /**
   * 禁用
   */
  DISABLED: {code:0, msg: '禁用'},
} as const

/**
 * 用户类型（与 SysUser.userType 对应）
 */
export const USER_TYPE_CONST = {
  ADMIN: {code: 0,value: "system_admin", msg: "系统管理员"},
  PRINCIPAL: {code: 1,value: "principal",msg: "校长"},
  TEACHER: {code: 2,value: "teacher", msg: "老师"},
  STUDENT: {code: 3,value: "student", msg: "学生"},
} as const

/**
 * 字典类型
 */
export const DICT_TYPE_CONST = {
  STAGE: {code: 'stage', msg: '学段'},
  ROLE: {code: "role",msg: "系统角色"},
  QUESTION_TYPE: {code: "question_type",msg: "题型"},
  DIFFICULTY: {code: "difficulty",msg: "题型难度"},
  STATUS: {code: "status",msg: "状态"},
}

/**
 * 登录设备
 */
export const LOGIN_DEVICE_CONST = {
  PC : {code: 'PC', msg: 'PC端浏览器'},
  // 以后可以直接扩展
  // APP: { code: 'app', msg: '手机APP' },
  // MINI: { code: 'mini', msg: '小程序' },
  // PC: { code: 'pc', msg: 'PC客户端' },
}

/**
 * 学校类型
 */
export const SCHOOL_TYPE_CONST = {
  HEAD: {code: 1, msg: '总校'},
  BRANCH: {code: 2, msg: '分校'}
}

/**
 * 题型
 */
export const QUESTION_TYPE_CONST = {
  SINGLE_CHOICE: {code: 'single_choice', msg:	'单选题'},
  MULTIPLE_CHOICE: {code: 'multiple_choice', msg:	'多选题'},
  JUDGE: {code: 'judge', msg:	'判断题'},
  FILL_BLANK: {code: 'fill_blank', msg:	'填空题'},
  SHORT_ANSWER: {code: 'short_answer', msg:	'简答题'},
  ESSAY: {code: 'essay', msg:	'论述题'},
  CALCULATION: {code: 'calculation', msg:	'计算题'},
}


/**
 * 题目难度
 */
export const DIFFICULTY_CONST = {
  EASY:    { code: 'easy',    msg: '简单',  color: '#52C41A' },  // 绿色
  MEDIUM:  { code: 'medium',  msg: '中等',  color: '#FAAD14' },  // 橙色
  HARD:    { code: 'hard',    msg: '困难',  color: '#FF4D4F' },  // 红色
  EXPERT:  { code: 'expert',  msg: '极难',  color: '#722ED1' },  // 紫色
}
// 👇 加上这两行，解决 TS 7053 报错
export type DifficultyCode = typeof DIFFICULTY_CONST[keyof typeof DIFFICULTY_CONST]['code'];
export const DIFFICULTY_KEY_MAP: Record<DifficultyCode, (typeof DIFFICULTY_CONST)[keyof typeof DIFFICULTY_CONST]> = {
  easy: DIFFICULTY_CONST.EASY,
  medium: DIFFICULTY_CONST.MEDIUM,
  hard: DIFFICULTY_CONST.HARD,
  expert: DIFFICULTY_CONST.EXPERT,
};