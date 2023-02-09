import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CyclesContext } from '../../../../contexts/CyclesContext'
import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    amountSecondsPassed,
    setSecondsPassed,
    markCurrentCycleAsFinished,
    markActiveCycleIdAsNull,
  } = useContext(CyclesContext)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  /* Se houver ciclo transformar o número de minutos em segundos, se não houver retorna 0 */

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )
        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()

          markActiveCycleIdAsNull()

          setSecondsPassed(totalSeconds)
          clearInterval(interval)

          document.title = `Ignite Timer`
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    markActiveCycleIdAsNull,
    setSecondsPassed,
  ])

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
  /* reduz to total de segundos a quantidade de segundos que já passaram */

  const minutesAmount = Math.floor(currentSeconds / 60)
  /* retorna o valor inteiro da divisão dos segundos restantes por 60, retornando os minutos restantes */
  const secondsAmount = currentSeconds % 60
  /* retorna o valor restante da divisão após a virgula, retornando os segundos restante */

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `Ignite Countdown - ${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
