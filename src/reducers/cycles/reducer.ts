import { produce } from 'immer'

import { ActionTypes } from "./actions"

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptDate?: Date
  finishedtDate?: Date
}

interface CyclesStateInterface {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function CyclesReducer(state: CyclesStateInterface, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      /* return {
        ...state,
        cycles: [...state.cycles, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id,
      } */

      return produce(state, draft => {
        draft.cycles.push(action.payload.newCycle);
        draft.activeCycleId = action.payload.newCycle.id;
      })

    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      /* return {
        ...state,
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId) {
            return { ...cycle, interruptDate: new Date() }
          } else {
            return cycle
          }
        }),
        activeCycleId: null,
      } */

      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })

      if(currentCycleIndex < 0 ) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null;
        draft.cycles[currentCycleIndex].interruptDate = new Date()
      })

    }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
      /* return {
        ...state,
        activeCycleId: null,
      } */
      return produce(state, (draft) => {
        draft.activeCycleId = null;
      })

    case ActionTypes.MARK_FINISHED_CYCLE_AS_NULL:{
      /* return {
        ...state,
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId) {
            return { ...cycle, finishedtDate: new Date() }
          } else {
            return cycle
          }
        }),
        activeCycleId: null,
      } */

      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })

      if(currentCycleIndex < 0 ) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null;
        draft.cycles[currentCycleIndex].finishedtDate = new Date()
      })

    }
    default:
      return state
  }
}
