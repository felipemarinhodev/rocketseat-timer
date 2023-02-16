import { Play } from 'phosphor-react'
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minuteAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string>()
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const {
    register,
    handleSubmit,
    watch,
    // formState
    reset,
  } = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minuteAmount: 0,
    },
  })
  const task = watch('task')
  const isSubmitDisabled = !task

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate),
        )
      }, 1000)
    }

    return () => {
      clearInterval(interval)
      setAmountSecondsPassed(0)
    }
  }, [activeCycle])

  function handleCreateNewCycle(data: newCycleFormData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minuteAmount,
      startDate: new Date(),
    }
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    reset()
  }

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const [tensMinutes, onesMinutes] = String(minutesAmount).padStart(2, '0')
  const [tensSeconds, onesSeconds] = String(secondsAmount).padStart(2, '0')

  // TODO: Create an error space to show the problems
  // if (formState.errors) console.log(formState.errors)

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="projeto 1" />
            <option value="projeto 2" />
            <option value="projeto 3" />
            <option value="lalala" />
          </datalist>

          <label htmlFor="minuteAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minuteAmount"
            placeholder="00"
            step="5"
            {...register('minuteAmount', {
              valueAsNumber: true,
            })}
          />
          <span>minutos</span>
        </FormContainer>
        <CountdownContainer>
          <span>{tensMinutes}</span>
          <span>{onesMinutes}</span>
          <Separator>:</Separator>
          <span>{tensSeconds}</span>
          <span>{onesSeconds}</span>
        </CountdownContainer>

        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
