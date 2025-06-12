export interface Product {
  id: string
  name: string
  description?: string
  sku?: string
  category_id?: string
  quantity: number
  min_quantity?: number
  price?: number
  cost?: number
  supplier?: string
  location?: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface StockMovement {
  id: string
  product_id?: string
  type: "IN" | "OUT" | "ADJUSTMENT"
  quantity: number
  reason?: string
  notes?: string
  created_at: string
  product?: Product
}

export interface ProductWithCategory extends Product {
  categories?: Category
}
