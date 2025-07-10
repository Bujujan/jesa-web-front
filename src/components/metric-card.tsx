// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { TrendingDown, TrendingUp } from "lucide-react"

// interface MetricCardProps {
//   title: string
//   value: string
//   change: string
//   trend: "up" | "down"
// }

// export function MetricCard({ title, value, change, trend }: MetricCardProps) {
//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold">{value}</div>
//         <div className="flex items-center text-xs">
//           {trend === "up" ? (
//             <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
//           ) : (
//             <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
//           )}
//           <span className={trend === "up" ? "text-green-500" : "text-red-500"}>{change}</span>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
