const obj1 = {
  authors: { author: { id: '22953', name: [Object], email: '', description: '' } },
}

const obj2 = {}

const obj3 = {
  authors: {
    author: [
      { id: '22953', name: [Object], email: '', description: '' },
      { id: '22953', name: [Object], email: '', description: '' },
    ],
  },
}

function wrapAsArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? item : [item]
}

function resolve(obj: any) {
  return obj.authors ? wrapAsArray(obj.authors.author) : []
}

console.log(resolve(obj1))
console.log(resolve(obj2))
console.log(resolve(obj3))
