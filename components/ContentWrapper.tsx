import { ReactNode } from 'react'

type IContentWrapper = {
  children: ReactNode
}

export const ContentWrapper = (props: IContentWrapper) => {
  return <div>{props.children}</div>
}
