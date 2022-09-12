const reducer = (state = {}, action) => {
  const { names, location, issue, id } = action;
  switch (action.type) {
    case 'ADD_TICKET':
      return Object.assign( //always takes three arguments:
        {}, // an empty object, so that the passes in obj wont be mutated
        state, // object that will be cloned
        {[id]: { //change that should be made to our new copy
          names: names,
          location: location,
          issue: issue,
          id: id
          }
        }
      );
      case 'DELETE_TICKET':
        let newState = {...state};
        delete newState[id];
        return newState;

    default:
      return state;
    }
};

export default reducer;

/*
ticket list{
  {id : { names: names,
          location: location,
          issue: issue,
          id: id}
        }

  {id : { names: names,
          location: location,
          issue: issue,
          id: id}
        }

  {id : { names: names,
          location: location,
          issue: issue,
          id: id}
        }
}

*/