export type Product = {
  id: number;
  name: string;
  price: number;
  specs: Array<{
    id: number;
    value: string;
    specification: {
      id: number;
      name: string;
    };
  }>;
  vendors: Array<{
    id: number;
    stock: number;
    vendor: {
      id: number;
      name: string;
      location: string;
    };
  }>;
};

export type Question = {
  id: number;
  text: string;
  options: Array<{
    id: number;
    text: string;
    products: Array<{
      id: number;
      name: string;
      price: number;
    }>;
  }>;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

async function readJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function getProducts() {
  return readJson<Product[]>("/products");
}

export function getQuestions() {
  return readJson<Question[]>("/questions");
}
