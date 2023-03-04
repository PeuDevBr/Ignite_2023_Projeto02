import { differenceInSeconds } from 'date-fns'
import { createContext, ReactNode, useState, useReducer, useEffect } from 'react'
import { ActionTypes, addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction, markFinishedCycleIdAsNullAciton } from '../reducers/cycles/actions'
import { Cycle, CyclesReducer } from '../reducers/cycles/reducer'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  markFinishedCycleIdAsNull: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CylclesContextProviderProps {
  children: ReactNode
}

export function CylclesContextProvider({
  children,
}: CylclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(CyclesReducer, {
    cycles: [],
    activeCycleId: null,
  }, 
  () => {
    const storedStateJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0')

    if(storedStateJSON) {
      return JSON.parse(storedStateJSON)
    }

    return {
      cycles: [],
     activeCycleId: null,
    }
  })


  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  /* Percorrendo a lista de ciclos e retornando o ciclo com o cyclo.id igual ao id do ciclo ativo */

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if(activeCycle) {
      return differenceInSeconds(
        new Date(),
        new Date (activeCycle.startDate),
      )
    }

    return 0
  })
  /* armazena quantos segundos já se passaram desde o início do ciclo */


  useEffect(() => {

    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)

  }, [cyclesState])


  /* const [activeCycleId, setActiveCycleId] = useState<string | null>(null) */


  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())

    document.title = `Ignite Timer`
  }

  function markFinishedCycleIdAsNull() {
    dispatch(markFinishedCycleIdAsNullAciton())
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(
      new Date().getTime(),
    ) /* retorna o time value em milessegundos */

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))
    setAmountSecondsPassed(0)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        amountSecondsPassed,
        setSecondsPassed,
        markCurrentCycleAsFinished,
        markFinishedCycleIdAsNull,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
