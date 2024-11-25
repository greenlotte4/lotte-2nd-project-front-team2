import { SET_OUTSOURCING } from './actionTypes';

const initialState = {
  companyName: '',
  paymentDate: '',
  contractPeriod: '',
  dispatchedPersonnel: '',
  paymentAmount: '',
  contact: ''
};

const outsourcingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_OUTSOURCING:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export default outsourcingReducer;