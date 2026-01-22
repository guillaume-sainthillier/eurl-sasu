import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InputSlider from '../calculator/InputSlider.vue'

describe('InputSlider.vue', () => {
  it('renders with label and value', () => {
    const wrapper = mount(InputSlider, {
      props: {
        label: 'Test Label',
        modelValue: 5000,
        min: 0,
        max: 10000,
        step: 500
      }
    })

    expect(wrapper.text()).toContain('Test Label')
    const numberInput = wrapper.find('input[type="number"]').element as HTMLInputElement
    const rangeInput = wrapper.find('input[type="range"]').element as HTMLInputElement
    expect(numberInput.value).toBe('5000')
    expect(rangeInput.value).toBe('5000')
  })

  it('emits update:modelValue when number input changes', async () => {
    const wrapper = mount(InputSlider, {
      props: {
        label: 'Test',
        modelValue: 5000,
        min: 0,
        max: 10000,
        step: 500
      }
    })

    const numberInput = wrapper.find('input[type="number"]')
    await numberInput.setValue(7500)

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([7500])
  })

  it('emits update:modelValue when slider changes', async () => {
    const wrapper = mount(InputSlider, {
      props: {
        label: 'Test',
        modelValue: 5000,
        min: 0,
        max: 10000,
        step: 500
      }
    })

    const rangeInput = wrapper.find('input[type="range"]')
    await rangeInput.setValue(3000)

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3000])
  })

  it('displays formatted currency value', () => {
    const wrapper = mount(InputSlider, {
      props: {
        label: 'Chiffre d\'affaires',
        modelValue: 50000,
        min: 0,
        max: 200000,
        step: 500
      }
    })

    // Should format with French locale and euro symbol
    expect(wrapper.text()).toContain('€')
    expect(wrapper.text()).toContain('50')
  })

  it('displays suffix when provided', () => {
    const wrapper = mount(InputSlider, {
      props: {
        label: 'Nombre de mois',
        modelValue: 6,
        min: 1,
        max: 12,
        step: 1,
        suffix: 'mois'
      }
    })

    expect(wrapper.text()).toContain('mois')
  })

  it('respects min/max/step constraints', () => {
    const wrapper = mount(InputSlider, {
      props: {
        label: 'Test',
        modelValue: 5000,
        min: 0,
        max: 10000,
        step: 500
      }
    })

    const numberInput = wrapper.find('input[type="number"]').element as HTMLInputElement
    const rangeInput = wrapper.find('input[type="range"]').element as HTMLInputElement

    expect(numberInput.min).toBe('0')
    expect(numberInput.max).toBe('10000')
    expect(numberInput.step).toBe('500')

    expect(rangeInput.min).toBe('0')
    expect(rangeInput.max).toBe('10000')
    expect(rangeInput.step).toBe('500')
  })
})
