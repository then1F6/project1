import { useState } from "react"

export default function useTimeout(
  func: () => void, 
  time: number = 1000
) {
  const [isClicked, setIsClicked] = useState(false)

  const wrappedFunc = (): void => {
    if (isClicked) return

    setIsClicked(true)
    func() 

    setTimeout(() => {
      setIsClicked(false);
    }, time)
  }

  return [wrappedFunc, isClicked] as const
}
