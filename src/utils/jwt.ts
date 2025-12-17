/* eslint-disable @typescript-eslint/no-explicit-any */

export type JobitJwtPayload = {
    sub?: string        // accountId
    username?: string   // 닉네임/아이디
    type?: string       // accountType
    role?: string       // roleCode (ex: ROLE_USER / ROLE_COMPANY)
    onboarded?: boolean | number | string // 온보딩 완료 여부
    iat?: number
    exp?: number
}

const base64UrlToJson = (input: string) => {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')

    return decodeURIComponent(
        atob(padded)
            .split('')
            .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('')
    )
}

export const decodeJwt = <T = any>(token: string): T | null => {
    try {
        const [, payload] = token.split('.')
        if (!payload) return null
        return JSON.parse(base64UrlToJson(payload)) as T
    } catch {
        return null
    }
}

export const getUsernameFromToken = (token: string): string | null => {
    const p = decodeJwt<JobitJwtPayload>(token)
    return p?.username ?? null
}

export const getUserTypeFromToken = (token: string): 'user' | 'company' | null => {
    const p = decodeJwt<JobitJwtPayload>(token)
    const role = p?.role ?? ''

    if (role.includes('COMPANY')) return 'company'
    if (role.includes('USER')) return 'user'
    return null
}

// ---------------------------
//  onBoarded 꺼내기
// ---------------------------
const toBool = (v: unknown): boolean | null => {
    if (v === true) return true
    if (v === false) return false

    if (typeof v === 'string') {
        const s = v.trim().toLowerCase()
        if (['true'].includes(s)) return true
        if (['false'].includes(s)) return false
    }
    return null
}

export const getOnBoardedFromToken = (token: string): boolean | null => {
    const p = decodeJwt<JobitJwtPayload>(token)
    if (!p) return null
    return toBool(p.onboarded)
}
