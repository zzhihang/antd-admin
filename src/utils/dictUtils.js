import dict from './dict';

export const getTextByValue = (value, key) => {
  const target = dict[key].filter(item => {
    return item.value == value;
  })
  return target.length ? target[0].text : value;
}