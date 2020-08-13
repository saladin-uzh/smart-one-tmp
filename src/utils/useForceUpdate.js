import { useState } from "react"

export default () => {
  const [u, setU] = useState(1)

  return () => u && setU((u) => ++u)
}
