import { saveMediaList, getMediaList } from '../../utils/storage';
import { ADD_MEDIA, SET_MEDIA_LIST, DELETE_MEDIA } from './types';

export const addMedia = (media) => async (dispatch, getState) => {
  dispatch({
    type: ADD_MEDIA,
    payload: media,
  });

  const { list } = getState().media;
  await saveMediaList(list);
};

export const setMediaList = (list) => async (dispatch) => {
  dispatch({
    type: SET_MEDIA_LIST,
    payload: list,
  });
  await saveMediaList(list);
};

export const deleteMedia = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_MEDIA,
    payload: id,
  });

  const { list } = getState().media;
  await saveMediaList(list);
};

export const loadMediaList = () => async (dispatch) => {
  const list = await getMediaList();
  dispatch({
    type: SET_MEDIA_LIST,
    payload: list,
  });
};

