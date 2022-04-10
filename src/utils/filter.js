import Vue from 'vue'
import dict from './dict'

for(let key in dict){
    Vue.filter(`useDict${key}`, value => {
      const target = dict[key].filter(item => {
        return item.value == value;
      })
      return target.length ? target[0].text : value;
    })
}