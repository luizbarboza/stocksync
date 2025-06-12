"use client"

import { useState } from "react"
import { Search, Edit, Trash2, Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import type { Product, ProductWithCategory } from "@/lib/types"
import { EditProductDialog } from "./edit-product-dialog"
import { StockAdjustmentDialog } from "./stock-adjustment-dialog"
interface ProductListProps {
  products: ProductWithCategory[]
  onProductUpdated: () => void
}

export function ProductList({ products, onProductUpdated }: ProductListProps) {
  console.log(products);
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStockDialog, setShowStockDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    setLoading(true)
    try {
      const { error } = await supabase.from("products").delete().eq("id", selectedProduct.id)

      if (error) throw error

      onProductUpdated()
      setShowDeleteDialog(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error("Erro ao deletar produto:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) {
      return <Badge variant="destructive">Sem Estoque</Badge>
    } else if (product.quantity <= (product.min_quantity || 0)) {
      return <Badge variant="secondary">Estoque Baixo</Badge>
    } else {
      return <Badge variant="default">Em Estoque</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Produtos ({filteredProducts.length})
        </CardTitle>
        <CardDescription>Gerencie seus produtos e controle o estoque</CardDescription>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-muted-foreground">{product.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm">{product.sku || "N/A"}</code>
                  </TableCell>
                  <TableCell>{product.categories?.name || "Sem categoria"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.quantity}</span>
                      {product.min_quantity && (
                        <span className="text-xs text-muted-foreground">(mín: {product.min_quantity})</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.price
                      ? `R$ ${product.price.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>{getStockStatus(product)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product)
                          setShowStockDialog(true)
                        }}
                      >
                        <Package className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product)
                          setShowEditDialog(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product)
                          setShowDeleteDialog(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
            </p>
          </div>
        )}
      </CardContent>

      {/* Dialog de Edição */}
      {selectedProduct && (
        <EditProductDialog
          product={selectedProduct}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onProductUpdated={onProductUpdated}
        />
      )}

      {/* Dialog de Ajuste de Estoque */}
      {selectedProduct && (
        <StockAdjustmentDialog
          product={selectedProduct}
          open={showStockDialog}
          onOpenChange={setShowStockDialog}
          onStockUpdated={onProductUpdated}
        />
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o produto "{selectedProduct?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={loading}>
              {loading ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
