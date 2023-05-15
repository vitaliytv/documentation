import { parseSnowplowJsTrackerMethod } from './walker'
import { describe, expect, test } from '@jest/globals'

describe('parseSnowplowJsTrackerMethod without window', () => {
  test('should parse trackPageView without custom values', () => {
    const input = `snowplow('trackPageView');`
    const result = parseSnowplowJsTrackerMethod(input)
    expect(result).toEqual({
      method: 'trackPageView',
      args: [],
    })
  })

  test('should parse trackPageView with custom values', () => {
    const input = `snowplow('trackPageView', {
        title: 'my custom page title'
    });`

    const result = parseSnowplowJsTrackerMethod(input)
    expect(result).toEqual({
      method: 'trackPageView',
      args: [{ title: 'my custom page title' }],
    })
  })

  test('should parse enableActivityTracking with custom values', () => {
    const input = `snowplow('enableActivityTracking', {
        minimumVisitLength: 30,
        heartbeatDelay: 10
    });`

    const result = parseSnowplowJsTrackerMethod(input)
    expect(result).toEqual({
      method: 'enableActivityTracking',
      args: [{ minimumVisitLength: 30, heartbeatDelay: 10 }],
    })
  })

  test('should parse trackStructEvent', () => {
    const input = `snowplow('trackStructEvent', {
        category: 'shop',
        action: 'add-to-basket',
        label: 'red shoes',
        property: 'size=9',
        value: 42
    })`

    const result = parseSnowplowJsTrackerMethod(input)
    expect(result).toEqual({
      method: 'trackStructEvent',
      args: [
        {
          category: 'shop',
          action: 'add-to-basket',
          label: 'red shoes',
          property: 'size=9',
          value: 42,
        },
      ],
    })
  })

  test('should parse trackSelfDescribingEvent', () => {
    const input = `snowplow('trackSelfDescribingEvent', {
        schema: 'iglu:com.walker/test/jsonschema/1-0-0',
        data: {
            someString: 'test01',
            someInt: 42,
            someDouble: 3.1415,
            someBoolean: true,
            someArray: [1, 2, 3],
            someObject: {
                someProperty: 'someValue'
            }
        }
    })`

    const result = parseSnowplowJsTrackerMethod(input)
    expect(result).toEqual({
      method: 'trackSelfDescribingEvent',
      args: [
        {
          schema: 'iglu:com.walker/test/jsonschema/1-0-0',
          data: {
            someString: 'test01',
            someInt: 42,
            someDouble: 3.1415,
            someBoolean: true,
            someArray: [1, 2, 3],
            someObject: {
              someProperty: 'someValue',
            },
          },
        },
      ],
    })
  })

})
