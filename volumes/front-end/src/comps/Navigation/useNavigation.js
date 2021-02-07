import {useState} from 'react';

export default function useNavigation({defaultList = []}){
  let [list, setList] = useState([].concat(defaultList.slice()));
  return {
    list,
    addItem: (item) => {
      setList(list.slice().concat([item]));
    },
    removeItem: (item) => {
      setList(list.slice().filter(entry => entry === item));
    }
 };
}