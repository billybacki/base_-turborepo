export type IResponse<TData> = {
  code: number
  data: TData
  message: string
  msg?: string
}
