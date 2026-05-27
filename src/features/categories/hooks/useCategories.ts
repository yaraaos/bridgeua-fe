import { useEffect, useState } from "react";
import {
  getCategories,
  type Category,
} from "../services/category.service";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setIsLoading(false));
  }, []);

  return { categories, isLoading };
};
