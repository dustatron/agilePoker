export type UserData = {
  name: string
  vote: number | null
  id: string
}

export enum LocalStorageKeys { User = "mcPoker-user-name" }
export interface Room {
  id?: string
  name: string
  isVoting: boolean
}
