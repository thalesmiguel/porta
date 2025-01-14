import { mount } from 'enzyme'

import { DragHandle, PolicyChain, SortableItem, SortableList } from 'Policies/components/PolicyChain'

import type { ChainPolicy } from 'Policies/types'

const policies: ChainPolicy[] = [
  { uuid: '1', removable: true, enabled: true, name: 'cors', humanName: 'CORS', summary: 'CORS', description: ['CORS headers'], version: '1.0.0', configuration: {}, $schema: '{}' },
  { uuid: '2', removable: true, enabled: true, name: 'echo', humanName: 'Echo', summary: 'Echo', description: ['Echoes the request'], version: '1.0.0', configuration: {}, $schema: '{}' }
]

jest.mock('react-sortable-hoc')

describe('PolicyChain', () => {
  function setup () {
    const props = {
      visible: true,
      chain: policies,
      actions: {
        openPolicyRegistry: jest.fn(),
        editPolicy: jest.fn(),
        sortPolicyChain: jest.fn()
      }
    }

    const chainWrapper = mount(<PolicyChain {...props} />)

    return {
      policies,
      props,
      chainWrapper
    }
  }
  it('should render self', () => {
    const { chainWrapper } = setup()
    expect(chainWrapper.find('section').hasClass('PolicyChain')).toEqual(true)
  })

  it('should render subcomponents', () => {
    const { chainWrapper } = setup()
    expect(chainWrapper.exists(SortableList)).toEqual(true)
    expect(chainWrapper.find(SortableItem).length).toBe(2)
  })
})

describe('SortableList', () => {
  function setup () {
    const props = {
      items: [...policies, {
        uuid: '3',
        removable: false,
        enabled: false,
        name: 'headers',
        humanName: 'Headers',
        summary: 'Headers summary',
        description: ['Headers description'],
        version: 'builtin',
        configuration: {},
        $schema: '{}'
      }],
      visible: true,
      editPolicy: jest.fn()
    }

    const sortableListWrapper = mount(<SortableList {...props} />)
    const firstSortableItem = sortableListWrapper.find(SortableItem).first()

    return { sortableListWrapper, firstSortableItem, props }
  }

  it('should render self correctly and subcomponents', () => {
    const { sortableListWrapper, firstSortableItem } = setup()
    expect(sortableListWrapper.find('ul').hasClass('list-group')).toEqual(true)

    expect(firstSortableItem.find('li').hasClass('Policy')).toEqual(true)
    expect(firstSortableItem.find('.Policy-version-and-summary').text()).toBe('1.0.0 - CORS')
    expect(firstSortableItem.exists(DragHandle)).toEqual(true)
  })

  it('should show correctly disabled policies', () => {
    const { sortableListWrapper } = setup()
    const lastSortableItem = sortableListWrapper.find(SortableItem).last()

    expect(lastSortableItem.find('li').hasClass('Policy--disabled')).toEqual(true)
  })

  it('should call editPolicy when edit button is clicked', () => {
    const { firstSortableItem, props } = setup()
    expect(props.editPolicy.mock.calls.length).toBe(0)
    firstSortableItem.find('article').simulate('click')
    expect(props.editPolicy.mock.calls.length).toBe(1)
  })
})
