import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

interface FetchProductsParams {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const fetchProducts = async ({ pageParam = 1, queryKey }: any) => {
  const [_key, params] = queryKey;
  const { data } = await axios.get(`${API_URL}/products`, {
    params: {
      page: pageParam,
      limit: 20,
      search: params.search || undefined,
      category: params.category || 'All',
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
    },
    withCredentials: true,
  });
  return data;
};

export const useProducts = (params: FetchProductsParams) => {
  return useInfiniteQuery({
    queryKey: ['products', params],
    queryFn: fetchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
  });
};










