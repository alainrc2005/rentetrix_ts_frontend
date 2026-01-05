import type { Optional } from 'src/types'

type TPagination = {
  sortBy: string,
  descending: boolean,
  page: number,
  rowsPerPage: number,
  rowsNumber: number
}

function initPagination(sortBy = 'name', descending = false, rowsPerPage = 20): TPagination {
  return {
    sortBy,
    descending,
    page: 1,
    rowsPerPage,
    rowsNumber: 0
  }
}

type TUser = {
  id: Optional<number>,
  name: Optional<string>,
  email: Optional<string>,
  phone: Optional<string>,
  roles: Array<number>,
  active: boolean
}

type TUserProfile = {
  id: Optional<number>,
  name: Optional<string>,
  email: Optional<string>,
  phone: Optional<string>,
  photo: Optional<string>,
}

function initProfile(): TUserProfile {
  return {
    id: undefined,
    name: undefined,
    email: undefined,
    phone: undefined,
    photo: undefined
  }
}

function initUser(): TUser {
  return {
    id: undefined,
    name: undefined,
    email: undefined,
    phone: undefined,
    roles: [],
    active: true
  }
}

type TRole = {
  id: Optional<number>,
  name: Optional<string>,
  description: Optional<string>,
  system: boolean,
  permissions: Array<number>
}

function initRole(): TRole {
  return {
    id: undefined,
    name: undefined,
    description: undefined,
    system: false,
    permissions: []
  }
}

type TPermission = {
  id: number,
  name: string,
  description: string
}

type TOptionValue = {
  value: number | string,
  label: string
}

type TChangePassword = {
  uuid: Optional<string>,
  new_password: Optional<string>,
  renew_password: Optional<string>
}

function initChangePassword(): TChangePassword {
  return {
    uuid: undefined,
    new_password: undefined,
    renew_password: undefined,
  }
}

type TAppLanguage = {
  id: Optional<number>
  key: Optional<string>
  name_es: Optional<string>
  name_en: Optional<string>
  name_fr: Optional<string>
  type: Optional<string>
}

function initAppLanguage() {
  return { id: undefined, key: undefined, name_es: '', name_en: '', name_fr: '', type: undefined }
}

export { initPagination, initProfile, initUser, initRole, initChangePassword, initAppLanguage }
export type { TUser, TUserProfile, TRole, TPermission, TOptionValue, TChangePassword, TAppLanguage, TPagination }
