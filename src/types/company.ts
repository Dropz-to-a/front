export type CompanyOnBoardData = {
  companyName: string
  businessNumber: string
  address: string
  detailAddress: string
  postcode: string
}

export type CompanyInfo = {
  companyName: string
  businessNumber: string
  address: string
  detailAddress: string
  zonecode: string
  // 추가 정보
  values?: string // 기업가치
  mission?: string // 목표/미션
  industry?: string // 분야
  description?: string // 회사 소개
  website?: string // 웹사이트
  employeeCount?: number // 직원 수
  foundedYear?: number // 설립연도
}

export type CompanyInfoUpdate = Partial<CompanyInfo>