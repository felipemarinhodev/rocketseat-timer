import { FormContainer, MinutesAmountInput, TaskInput } from '../../styles'

export function NewCycleForm() {
  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        list="task-suggestions"
        placeholder="Dê um nome para o seu projeto"
        disabled={!!activeCycle}
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
        disabled={!!activeCycle}
        step="1"
        {...register('minuteAmount', {
          valueAsNumber: true,
        })}
      />
      <span>minutos</span>
    </FormContainer>
  )
}
