import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApiData } from "../store/homeSlice";

const useFetch = (url, user_id) => {
  const dispatch = useDispatch();

  // Safely access the data in the Redux state
  const data = useSelector((state) => state.home.url?.[url]);

  const loading = useSelector((state) => state.home.loading);
  const error = useSelector((state) => state.home.error);

  const refetch = useCallback(() => {
    dispatch(fetchApiData({url, user_id}));
  }, [url, dispatch]);

  useEffect(() => {
    if (!data) {
      dispatch(fetchApiData({url, user_id}));
    }
  }, [url, data, dispatch]);

  return { data, loading, error, refetch };
};

export default useFetch;
