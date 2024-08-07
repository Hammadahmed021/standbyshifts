import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApiData } from "../store/homeSlice";

const useFetch = (url) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => {
    console.log(state.home);  // Debugging: Check if the home state exists and is structured correctly
    return state.home.url ? state.home.url[url] : undefined;
  });
  const loading = useSelector((state) => state.home.loading);
  const error = useSelector((state) => state.home.error);

  useEffect(() => {
    if (!data) {
      dispatch(fetchApiData(url));
    }
  }, [url, data, dispatch]);

  return { data, loading, error };
};

export default useFetch;
