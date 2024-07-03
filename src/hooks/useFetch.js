import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApiData } from "../store/homeSlice";

const useFetch = (url) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.home.url[url]);
  const loading = useSelector((state) => state.home.loading);
  const error = useSelector((state) => state.home.error);

  useEffect(() => {
    if (!data) {
      dispatch(fetchApiData(url));
    }
  }, [url, data, dispatch]);

  return { data, error, loading };
};

export default useFetch;
