import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CycleContext } from '../../../../context/CyclesContext'
import { CountdownContainer, Separator } from './styles'
export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CycleContext)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const [tensMinutes, onesMinutes] = String(minutesAmount).padStart(2, '0')
  const [tensSeconds, onesSeconds] = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    console.log('activeCycle', activeCycle)
    console.log('activeCycleId', activeCycleId)
    console.log('totalSeconds', totalSeconds)

    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()

          setSecondsPassed(totalSeconds)
          clearInterval(interval)

          document.title = 'Timer'
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    activeCycleId,
    totalSeconds,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  ])

  useEffect(() => {
    if (activeCycle) {
      document.title = `${tensMinutes}${onesMinutes}:${tensSeconds}${onesSeconds}`
    }
  }, [tensMinutes, onesMinutes, tensSeconds, onesSeconds, activeCycle])

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
