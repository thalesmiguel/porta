import { mount } from 'enzyme'

import { TextField, PasswordField, EmailField } from 'LoginPage/loginForms/FormGroups'

import type { InputProps } from 'Types'

describe('TextField', () => {
  const textFieldInputProps: InputProps = {
    isRequired: true,
    isValid: true,
    name: 'text',
    fieldId: 'text',
    label: 'Text Field',
    value: 'Bob Sponge',
    onChange: jest.fn()
  }

  it('should render TextField form group', () => {
    const wrapper = mount(<TextField inputProps={textFieldInputProps} />)
    expect(wrapper.exists('.pf-c-form__group')).toEqual(true)

    expect(wrapper.find('label').length).toEqual(1)
    expect(wrapper.find('label').text()).toMatch('Text Field')

    expect(wrapper.find('input').length).toEqual(1)
    expect(wrapper.find('input').props().type).toEqual('text')
    expect(wrapper.find('input').props().value).toEqual('Bob Sponge')

    expect(wrapper.exists('.pf-m-error')).toEqual(false)
  })

  it('should render an error message if not valid', () => {
    const invalidFieldProps = { ...textFieldInputProps, isValid: false } as const
    const wrapper = mount(<TextField inputProps={invalidFieldProps} />)
    expect(wrapper.exists('.pf-m-error')).toEqual(true)
  })
})

describe('PasswordField', () => {
  const passwordFieldInputProps = {
    isRequired: true,
    isValid: true,
    name: 'password',
    fieldId: 'password',
    label: 'Password',
    value: '12345678',
    onChange: jest.fn()
  } as const
  it('should render PasswordField form group', () => {
    const wrapper = mount(<PasswordField inputProps={passwordFieldInputProps} />)
    expect(wrapper.exists('.pf-c-form__group')).toEqual(true)

    expect(wrapper.find('label').length).toEqual(1)
    expect(wrapper.find('label').text()).toMatch('Password')

    expect(wrapper.find('input').length).toEqual(1)
    expect(wrapper.find('input').props().type).toEqual('password')
    expect(wrapper.find('input').props().value).toEqual('12345678')

    expect(wrapper.exists('.pf-m-error')).toEqual(false)
  })

  it('should render an error message if not valid', () => {
    const invalidFieldProps = { ...passwordFieldInputProps, isValid: false } as const
    const wrapper = mount(<PasswordField inputProps={invalidFieldProps} />)
    expect(wrapper.exists('.pf-m-error')).toEqual(true)
  })
})

describe('EmailField', () => {
  const emailFieldInputProps = {
    isRequired: true,
    isValid: true,
    name: 'email',
    fieldId: 'email',
    label: 'Email',
    value: 'bob@sponge.com',
    onChange: jest.fn()
  } as const
  it('should render EmailField form group', () => {
    const wrapper = mount(<EmailField inputProps={emailFieldInputProps} />)
    expect(wrapper.exists('.pf-c-form__group')).toEqual(true)

    expect(wrapper.find('label').length).toEqual(1)
    expect(wrapper.find('label').text()).toMatch('Email')

    expect(wrapper.find('input').length).toEqual(1)
    expect(wrapper.find('input').props().type).toEqual('email')
    expect(wrapper.find('input').props().value).toEqual('bob@sponge.com')

    expect(wrapper.exists('.pf-m-error')).toEqual(false)
  })

  it('should render an error message if not valid', () => {
    const invalidFieldProps = { ...emailFieldInputProps, isValid: false } as const
    const wrapper = mount(<EmailField inputProps={invalidFieldProps} />)
    expect(wrapper.exists('.pf-m-error')).toEqual(true)
  })
})
