import { CountdownContainer, Separator } from '../../styles'
export function Countdown() {
  return (
    <CountdownContainer>
      <span>{tensMinutes}</span>
      <span>{onesMinutes}</span>
      <Separator>:</Separator>
      <span>{tensSeconds}</span>
      <span>{onesSeconds}</span>
    </CountdownContainer>
  )
}
