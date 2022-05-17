import { Model } from 'dva';

const model: Model = {
  namespace: 'app',
  state: {},
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *demo(action, { call, put }) {
      // yield call();
      // yield put({ type: '' });
    },
  },
  subscriptions: {},
};

export default model;
