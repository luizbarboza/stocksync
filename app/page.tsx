"use client"

import { useEffect, useState } from "react"
import { Package, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import type { Product, ProductWithCategory, StockMovement, StockMovementWithProduct } from "@/lib/types"
import { ProductList } from "@/components/product-list"
import { AddProductDialog } from "@/components/add-product-dialog"
import { StockMovementsList } from "@/components/stock-movements-list"
import { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js"

export default function InventoryDashboard() {
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalValue: 0,
    recentMovements: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Carregar produtos com categorias
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            id,
            name,
            description
          )
        `)
        .order("created_at", { ascending: false }) as PostgrestSingleResponse<ProductWithCategory[]>

      if (productsError) throw productsError

      // Carregar movimentações recentes
      const { data: movementsData, error: movementsError } = await supabase
        .from("stock_movements")
        .select(`
          *,
          products (
            id,
            name,
            sku
          )
        `)
        .order("created_at", { ascending: false })
        .limit(10) as PostgrestSingleResponse<StockMovementWithProduct[]>

      if (movementsError) throw movementsError

      setProducts(productsData || [])
      setMovements(movementsData || [])

      // Calcular estatísticas
      const totalProducts = productsData?.length || 0
      const lowStockProducts = productsData?.filter((p) => p.quantity <= (p.min_quantity || 0)).length || 0
      const totalValue = productsData?.reduce((sum, p) => sum + p.quantity * (p.price || 0), 0) || 0
      const recentMovements =
        movementsData?.filter((m) => {
          const movementDate = new Date(m.created_at)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return movementDate >= weekAgo
        }).length || 0

      setStats({
        totalProducts,
        lowStockProducts,
        totalValue,
        recentMovements,
      })
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductAdded = () => {
    loadData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Carregando dados do estoque...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">StockSync</h1>
          <p className="text-muted-foreground">Gerenciamento de produtos e controle o estoque</p>
        </div>
        <AddProductDialog onProductAdded={handleProductAdded} />
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">produtos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">produtos com estoque baixo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R${" "}
              {stats.totalValue.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">valor total do estoque</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Movimentações</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentMovements}</div>
            <p className="text-xs text-muted-foreground">nos últimos 7 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Produtos com Estoque Baixo */}
      {stats.lowStockProducts > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Produtos com Estoque Baixo
            </CardTitle>
            <CardDescription>Produtos que precisam de reposição</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {products
                .filter((p) => p.quantity <= (p.min_quantity || 0))
                .map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku || "N/A"}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">{product.quantity} unidades</Badge>
                      <p className="text-xs text-muted-foreground mt-1">Mín: {product.min_quantity || 0}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs para Produtos e Movimentações */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="movements">Movimentações</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductList products={products} onProductUpdated={loadData} />
        </TabsContent>

        <TabsContent value="movements">
          <StockMovementsList movements={movements} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
