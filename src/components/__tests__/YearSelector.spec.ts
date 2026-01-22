import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import YearSelector from '../calculator/YearSelector.vue'
import { useCalculatorStore } from '@/stores/calculator'

describe('YearSelector.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders year options', () => {
    const wrapper = mount(YearSelector)

    // Should show select element with year options
    const select = wrapper.find('select')
    expect(select.exists()).toBe(true)

    const options = wrapper.findAll('option')
    expect(options.length).toBeGreaterThan(0)
    expect(options.some((opt) => opt.text().includes('2017'))).toBe(true)
    expect(options.some((opt) => opt.text().includes('2018'))).toBe(true)
  })

  it('selects default year from store', () => {
    const wrapper = mount(YearSelector)
    const store = useCalculatorStore()

    const select = wrapper.find('select')
    const value = parseInt(select.element.value)

    expect(value).toBe(store.selectedYear)
  })

  it('updates store when year is changed', async () => {
    const wrapper = mount(YearSelector)
    const store = useCalculatorStore()

    const select = wrapper.find('select')

    // Change year to 2017
    await select.setValue('2017')

    expect(store.selectedYear).toBe(2017)

    // Change year to 2018
    await select.setValue('2018')

    expect(store.selectedYear).toBe(2018)
  })

  it('displays PASS value for selected year', async () => {
    const wrapper = mount(YearSelector)

    // PASS value should be displayed
    expect(wrapper.text()).toContain('PASS')

    // Should show different PASS values for different years
    const select = wrapper.find('select')

    await select.setValue('2017')
    const pass2017 = wrapper.text()

    await select.setValue('2018')
    const pass2018 = wrapper.text()

    // PASS values should be different
    expect(pass2017).not.toBe(pass2018)
  })
})
