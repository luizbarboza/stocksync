"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Minus, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/lib/types"

interface StockAdjustmentDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onStockUpdated: () => void
}

export function StockAdjustmentDialog({ product, open, onOpenChange, onStockUpdated }: StockAdjustmentDialogProps) {
  const [loading, setLoading] = useState(false)
  const [adjustmentType, setAdjustmentType] = useState<"IN" | "OUT" | "ADJUSTMENT">("IN")
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let newQuantity = product.quantity

      if (adjustmentType === "IN") {
        newQuantity += quantity
      } else if (adjustmentType === "OUT") {
        newQuantity = Math.max(0, newQuantity - quantity)
      } else {
        newQuantity = quantity
      }

      // Atualizar quantidade do produto
      const { error: updateError } = await supabase
        .from("products")
        .update({ quantity: newQuantity })
        .eq("id", product.id)

      if (updateError) throw updateError

      // Registrar movimentação
      const { error: movementError } = await supabase.from("stock_movements").insert([
        {
          product_id: product.id,
          type: adjustmentType,
          quantity: adjustmentType === "ADJUSTMENT" ? quantity : quantity,
          reason: reason || null,
          notes: notes || null,
        },
      ])

      if (movementError) throw movementError

      onStockUpdated()
      onOpenChange(false)
      setQuantity(1)
      setReason("")
      setNotes("")
    } catch (error) {
      console.error("Erro ao ajustar estoque:", error)
    } finally {
      setLoading(false)
    }
  }

  const getNewQuantity = () => {
    if (adjustmentType === "IN") {
      return product.quantity + quantity
    } else if (adjustmentType === "OUT") {
      return Math.max(0, product.quantity - quantity)
    } else {
      return quantity
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Ajustar Estoque
          </DialogTitle>
          <DialogDescription>
            Produto: <strong>{product.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span>Quantidade Atual:</span>
            <Badge variant="outline" className="text-lg">
              {product.quantity} unidades
            </Badge>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Movimentação</Label>
              <Select
                value={adjustmentType}
                onValueChange={(value: "IN" | "OUT" | "ADJUSTMENT") => setAdjustmentType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-green-500" />
                      Entrada
                    </div>
                  </SelectItem>
                  <SelectItem value="OUT">
                    <div className="flex items-center gap-2">
                      <Minus className="h-4 w-4 text-red-500" />
                      Saída
                    </div>
                  </SelectItem>
                  <SelectItem value="ADJUSTMENT">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-500" />
                      Ajuste Manual
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">{adjustmentType === "ADJUSTMENT" ? "Nova Quantidade" : "Quantidade"}</Label>
              <Input
                id="quantity"
                type="number"
                min={adjustmentType === "ADJUSTMENT" ? "0" : "1"}
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span>Nova Quantidade:</span>
              <Badge variant="default" className="text-lg">
                {getNewQuantity()} unidades
              </Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Compra, Venda, Correção..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Confirmar Ajuste"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
