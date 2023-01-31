import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { Countdown } from './components/Countdown'
import { NewCycleForm } from './components/NewCycleForm'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa '),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclor precisa ser no mínimo 5 minutos')
    .max(60, 'O ciclor precisa ser no máximo 60 minutos'),
})

interface NewCycleFormData {
  task: string
  minutesAmount: number
}

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptDate?: Date
  finishedtDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  /* armazena quantos segundos já se passaram desde o início do ciclo */

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(
      new Date().getTime(),
    ) /* retorna o time value em milessegundos */

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)

    reset()
  }

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  /* Percorrendo a lista de ciclos e retornando o ciclo com o cyclo.id igual ao id do ciclo ativo */

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptDate: new Date() }
        } else {
          return cycle
        }
      }),
    )

    setActiveCycleId(null)

    document.title = `Ignite Timer`
  }

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
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedtDate: new Date() }
              } else {
                return cycle
              }
            }),
          )

          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)

          setActiveCycleId(null)

          document.title = `Ignite Timer`
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [activeCycle, totalSeconds, activeCycleId])

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

  const inputTask = watch('task')
  const inputMinutesAmount = watch('minutesAmount')
  const isSubmitDisabled = !inputTask || !inputMinutesAmount

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <Countdown />
        <NewCycleForm />
        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
