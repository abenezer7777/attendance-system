// "use client"

// import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// interface OverviewProps {
//   data: {
//     name: string
//     total: number
//   }[]
// }

// export function Overview({ data }: OverviewProps) {
//   return (
//     <ResponsiveContainer width="100%" height={350}>
//       <BarChart data={data}>
//         <XAxis
//           dataKey="name"
//           stroke="#888888"
//           fontSize={12}
//           tickLine={false}
//           axisLine={false}
//         />
//         <YAxis
//           stroke="#888888"
//           fontSize={12}
//           tickLine={false}
//           axisLine={false}
//           tickFormatter={(value) => `${value}`}
//         />
//         <Bar
//           dataKey="total"
//           fill="currentColor"
//           radius={[4, 4, 0, 0]}
//           className="fill-primary"
//         />
//       </BarChart>
//     </ResponsiveContainer>
//   )
// }
"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OverviewProps {
  data: {
    name: string;
    total: number;
  }[];
}

const CHART_COLORS = {
  PRESENT: "hsl(var(--chart-1))",
  LATE: "hsl(var(--chart-2))",
  ABSENT: "hsl(var(--chart-3))",
  EARLY_LEAVE: "hsl(var(--chart-4))",
  AUTO_CHECKOUT: "hsl(var(--chart-5))",
};

export function Overview({ data }: OverviewProps) {
  const [view, setView] = useState("today");

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <Tabs defaultValue={view} onValueChange={setView} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Attendance Overview</h3>
              <TabsList className="grid w-[300px] grid-cols-3">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="today" className="space-y-4">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    cursor={{ fill: "hsl(var(--muted))" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="total"
                    radius={[4, 4, 0, 0]}
                    fill="currentColor"
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {data?.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-2xl font-bold">{item.total}</p>
                    </div>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          CHART_COLORS[
                            item.name as keyof typeof CHART_COLORS
                          ] || CHART_COLORS.PRESENT,
                      }}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    cursor={{ fill: "hsl(var(--muted))" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="total"
                    radius={[4, 4, 0, 0]}
                    fill="currentColor"
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="col-span-3 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Weekly Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {data?.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              CHART_COLORS[
                                item.name as keyof typeof CHART_COLORS
                              ] || CHART_COLORS.PRESENT,
                          }}
                        />
                        <span className="text-sm">
                          {item.name}: {item.total}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    cursor={{ fill: "hsl(var(--muted))" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="total"
                    radius={[4, 4, 0, 0]}
                    fill="currentColor"
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {data?.map((item) => (
                  <div key={item.name} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            CHART_COLORS[
                              item.name as keyof typeof CHART_COLORS
                            ] || CHART_COLORS.PRESENT,
                        }}
                      />
                      <h4 className="font-semibold">{item.name}</h4>
                    </div>
                    <p className="text-2xl font-bold">{item.total}</p>
                    <p className="text-sm text-muted-foreground">
                      Monthly total
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}