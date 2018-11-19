import { createStore, combineReducers } from 'redux'; 
import graphing from './graphing'; 

const rootReducer = combineReducers({
	graphing: graphing
});

const store = createStore(rootReducer) ;

export default store; 
