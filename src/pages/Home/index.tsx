import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

import {
  HomeContainer,
  FormContainer,
  CountdownContainer,
  Separator,
  StartCountdownButton,
  TaskInput,
  MinutesAmountInput,
} from './styles'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa '),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclor precisa ser no mínimo 5 minutos')
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

    reset()
  }

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  /* Percorrendo a lista de ciclos e retornando o ciclo com o cyclo.id igual ao id do ciclo ativo */

  useEffect(() => {
    if (activeCycle) {
      setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate),
        )
      }, 1000)
    }
  }, [activeCycle])

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  /* Se houver ciclo transformar o número de minutos em segundos, se não houver retorna 0 */

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
  /* reduz to total de segundos a quantidade de segundos que já passaram */

  const minutesAmount = Math.floor(currentSeconds / 60)
  /* retorna o valor inteiro da divisão dos segundos restantes por 60, retornando os minutos restantes */
  const secondsAmount = currentSeconds % 60
  /* retorna o valor restante da divisão após a virgula, retornando os segundos restante */

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  const inputTask = watch('task')
  const inputMinutesAmount = watch('minutesAmount')
  const isSubmitDisabled = !inputTask || !inputMinutesAmount

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 01" />
            <option value="Projeto 02" />
            <option value="Projeto 03" />
            <option value="Projeto 04" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5} /* acrescenta/diminui de 5 em 5 */
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
