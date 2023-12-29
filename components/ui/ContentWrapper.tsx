import { ReactNode } from 'react'

type IContentWrapper = {
  children: ReactNode
}

export const ContentWrapper = (props: IContentWrapper) => {
  return (
    <div className="flex h-screen bg-black">
      <div className="w-screen h-screen flex flex-col justify-center items-center text-white">
        {props.children}
      </div>
    </div>
  )
}
