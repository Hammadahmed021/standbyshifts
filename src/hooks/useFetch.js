import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApiData } from "../store/homeSlice";

const useFetch = (url) => {
  const dispatch = useDispatch();
  
  const data = useSelector((state) => {
    return state.home.url ? state.home.url[url] : undefined;
  });

  const loading = useSelector((state) => state.home.loading);
  const error = useSelector((state) => state.home.error);

  // Function to manually refetch data
  const refetch = useCallback(() => {
    dispatch(fetchApiData(url));
  }, [url, dispatch]);

  

  useEffect(() => {
    if (!data) {
      dispatch(fetchApiData(url));
    }
  }, [url, data, dispatch]);

  return { data, loading, error, refetch };
};

export default useFetch;
