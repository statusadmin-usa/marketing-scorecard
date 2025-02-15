"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

interface MarketingMixProps {
  totalBudget: number
  channels: string[]
  readOnly?: boolean
}

const COLORS = [
  "#000000",
  "#1a1a1a",
  "#333333",
  "#4d4d4d",
  "#666666",
  "#808080",
  "#999999",
  "#b3b3b3",
  "#cccccc",
  "#e6e6e6",
]

export default function MarketingMixTable({ totalBudget, channels, readOnly = false }: MarketingMixProps) {
  const [allocations, setAllocations] = useState(() =>
    channels.length > 0
      ? channels.reduce(
          (acc, channel) => ({
            ...acc,
            [channel]: { percentage: 0, amount: 0 },
          }),
          {},
        )
      : {},
  )

  const [totalPercentage, setTotalPercentage] = useState(0)

  useEffect(() => {
    const total = Object.values(allocations).reduce((sum, allocation) => sum + (allocation?.percentage || 0), 0)
    setTotalPercentage(total)
  }, [allocations])

  useEffect(() => {
    setAllocations((prev) => {
      const newAllocations = channels.reduce((acc, channel) => {
        acc[channel] = prev[channel] || { percentage: 0, amount: 0 }
        return acc
      }, {})
      return newAllocations
    })
  }, [channels])

  const handlePercentageChange = (channel: string, percentage: number) => {
    if (readOnly) return

    const newPercentage = Math.min(100, Math.max(0, percentage))
    const amount = (newPercentage / 100) * totalBudget

    setAllocations((prev) => ({
      ...prev,
      [channel]: { percentage: newPercentage, amount },
    }))
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US")
  }

  const chartData = Object.entries(allocations)
    .filter(([_, data]) => data && data.percentage > 0)
    .map(([channel, data]) => ({
      name: channel,
      value: data.percentage,
    }))

  if (channels.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Marketing Mix</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please add channels in the Brand Profile section to create your Marketing Mix.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Marketing Mix</CardTitle>
      </CardHeader>
      <CardContent>
        {!readOnly && totalPercentage !== 100 && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Total allocation must equal 100%. Current total: {totalPercentage}%</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((channel) => (
                <TableRow key={channel}>
                  <TableCell>{channel}</TableCell>
                  <TableCell>
                    {readOnly ? (
                      <span>{allocations[channel]?.percentage || 0}%</span>
                    ) : (
                      <Input
                        type="number"
                        value={allocations[channel]?.percentage || 0}
                        onChange={(e) => handlePercentageChange(channel, Number(e.target.value))}
                        className="w-20"
                      />
                    )}
                  </TableCell>
                  <TableCell>${formatNumber(allocations[channel]?.amount || 0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-black text-lg font-bold mb-4">MARKETING MIX</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="#ffffff"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-black space-y-2 mt-4">
              {chartData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <span>{entry.name}</span>
                  <div className="flex items-center">
                    <span className="mr-2">→</span>
                    <span>{entry.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

