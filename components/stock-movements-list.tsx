"use client"

import { TrendingUp, TrendingDown, Package, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { StockMovement } from "@/lib/types"

interface StockMovementsListProps {
  movements: StockMovement[]
}

export function StockMovementsList({ movements }: StockMovementsListProps) {
  const getMovementIcon = (type: string) => {
    switch (type) {
      case "IN":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "OUT":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "ADJUSTMENT":
        return <Package className="h-4 w-4 text-blue-500" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getMovementBadge = (type: string) => {
    switch (type) {
      case "IN":
        return <Badge className="bg-green-100 text-green-800">Entrada</Badge>
      case "OUT":
        return <Badge className="bg-red-100 text-red-800">Saída</Badge>
      case "ADJUSTMENT":
        return <Badge className="bg-blue-100 text-blue-800">Ajuste</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Movimentações Recentes ({movements.length})
        </CardTitle>
        <CardDescription>Histórico das últimas movimentações de estoque</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{movement.product?.name || "Produto não encontrado"}</div>
                      {movement.product?.sku && (
                        <div className="text-sm text-muted-foreground">SKU: {movement.product.sku}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getMovementIcon(movement.type)}
                      {getMovementBadge(movement.type)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {movement.type === "OUT" ? "-" : "+"}
                      {movement.quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      {movement.reason && <div className="font-medium">{movement.reason}</div>}
                      {movement.notes && <div className="text-sm text-muted-foreground">{movement.notes}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(movement.created_at)}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {movements.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma movimentação registrada</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
