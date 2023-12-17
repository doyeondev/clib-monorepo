export function findItemsFromArray(arr, vals, key) {
  const items = []
  // const mapped_array = arr.map(function(x) { return x[key]; })

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < vals.length; j++) {
      if (Array.isArray(vals[j]) === true && _.isEqual(arr[i][key].sort(), vals[j].sort())) {
        console.log('val이 Array인 경우')
        items[items.length] = arr[i]
      } else if (arr[i][key] == vals[j]) {
        console.log('val이 Array 아닌 경우')
        items[items.length] = arr[i]
      }
    }
  }
  return items
}

// arr[] <-> val (returns unique "item" from index)
export function findItem(arr, val, key) {
  let index = arr.findIndex((e) => e[key] == val)

  if (index > -1) {
    return arr[index]
  }
}

export function findItemIndex(arr, val, key) {
  let index = arr.findIndex((e) => e[key] == val)

  if (index > -1) {
    return index
  }
}

// arr[] <-> vals (returns all items[])
export function findAllItem(arr, val, key) {
  const items = []
  const mapped_array = arr.map(function (x) {
    return x[key]
  })

  mapped_array.forEach((e, i) => {
    if (e == val) {
      items[items.length] = arr[i] // items.push(arr[i]);
    }
  })
  return items
}

// arr[] <-> vals[] (returns all indexes[])
export function findAllIndex(arr, val, key) {
  const indexes = []
  const mapped_array = arr.map(function (x) {
    return x[key]
  })

  mapped_array.forEach((e, i) => {
    if (e == val) {
      indexes[indexes.length] = i // indexes.push(i);
    }
  })
  return indexes
}

// arr[] <-> vals[] (returns all "index" of matching value)
export function findIndexesFromArray(arr, vals, key) {
  const indexes = []
  // const mapped_array = arr.map(function(x) { return x[key]; })

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < vals.length; j++) {
      if (Array.isArray(vals[j]) === true && _.isEqual(arr[i][key].sort(), vals[j].sort())) {
        console.log('val이 Array인 경우')
        indexes[indexes.length] = i
      } else if (arr[i][key] == vals[j]) {
        console.log('val이 Array 아닌 경우')
        indexes[indexes.length] = i
      }
    }
  }
  return indexes
}

export function getKeyAndValue(arr) {
  let sortedArr = {
    keys: _.map(arr, 'key'),
    values: _.map(arr, 'value'),
    placeholder: _.map(arr, 'placeholder')
  }
  return sortedArr
}

export function replaceArray(myArray, objKey, newValue) {
  // Find index of specific object using findIndex method.
  const index = myArray.findIndex((o) => o.key == objKey)
  // Update object's name property.
  if (index > -1) {
    myArray[index].value = newValue
  }
  return myArray[index]
}

Array.prototype.unique = function () {
  return Array.from(new Set(this))
}

// arr.unique()
