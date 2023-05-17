import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import { CallExpression, ObjectExpression, ArrayExpression } from '@babel/types'

type SnowplowResult = {
  method: string
  args: any[]
}

function parseArray(node: ArrayExpression) {
  const ret = []
  for (let el of node.elements) {
    switch (el.type) {
      case 'StringLiteral':
      case 'NumericLiteral':
      case 'BooleanLiteral':
        ret.push(el.value)
        break

      case 'ArrayExpression':
        ret.push(parseArray(el))
        break

      case 'ObjectExpression':
        ret.push(parseObject(el))
    }
  }
  return ret
}

function parseObject(node: ObjectExpression) {
  const ret = {}
  for (let prop of node.properties) {
    if (prop.type === 'ObjectProperty' && prop.key.type === 'Identifier') {
      switch (prop.value.type) {
        case 'StringLiteral':
        case 'NumericLiteral':
        case 'BooleanLiteral':
          ret[prop.key.name] = prop.value.value
          break

        case 'ArrayExpression':
          ret[prop.key.name] = parseArray(prop.value)
          break

        case 'ObjectExpression':
          ret[prop.key.name] = parseObject(prop.value)
      }
    }
  }
  return ret
}

function parseSnowplowCall(node: CallExpression): SnowplowResult {
  let method = ''
  const args = []

  // Method
  if (node.arguments[0].type === 'StringLiteral') {
    method = node.arguments[0].value
  }

  // Args
  for (let arg of node.arguments.slice(1)) {
    if (arg.type === 'ObjectExpression') {
      args.push(parseObject(arg))
    }
  }

  return { method, args }
}

export function parseSnowplowJsTrackerMethod(
  input: string
): SnowplowResult | null {
  let res = {} as SnowplowResult
  const ast = parse(input)

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee
      // snowplow('trackPageView', ...)
      if (callee.type === 'Identifier' && callee.name === 'snowplow') {
        res = parseSnowplowCall(path.node)
      }

      // window.snowplow('trackPageView', ...)
      if (
        callee.type === 'MemberExpression' &&
        callee.property.type === 'Identifier' &&
        callee.property.name === 'snowplow'
      ) {
        res = parseSnowplowCall(path.node)
      }
    },
  })

  return res
}
