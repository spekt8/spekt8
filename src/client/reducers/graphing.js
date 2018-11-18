const initialState = {
  checked: ['pod', 'service', 'ingress'],
} 

export default (state = initialState, action) => { 
  switch (action.type) { 

    // takes care of handling the legend switches
    case 'HANDLE_LEGEND_TOGGLE': {
      const { checked } = state;
      const currentIndex = checked.indexOf(action.payload);
      const newChecked = [...checked];

      if (currentIndex === -1) {
        newChecked.push(action.payload);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      return {
        ...state,
        checked: newChecked,
      }
    }

    default: 
      return state 
  } 
} 
