import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Activity } from "lucide-react";
import { useStudents } from "@/context/StudentsContext";

import { AnimatedBackground } from "@/components/dashboard/AnimatedBackground";
import { KPICards } from "@/components/dashboard/KPICards";
import { SimulationPanel } from "@/components/dashboard/SimulationPanel";
import { RiskCharts } from "@/components/dashboard/RiskCharts";
import { TopAtRiskStudents } from "@/components/dashboard/TopAtRiskStudents";
import { StudentTable } from "@/components/dashboard/StudentTable";
import { KeyRiskInsights } from "@/components/dashboard/KeyRiskInsights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { students, isLoading, isError } = useStudents();

  // Prevent blank screen crash
  if (isLoading || !students || students.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading students...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading students dataset.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Academic Risk Dashboard
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  ML-powered student retention risk scoring
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium text-green-500">
                System Active
              </span>
            </div>
          </motion.div>

          <Tabs defaultValue="overview" className="space-y-8">
            <div className="flex justify-center sm:justify-start">
              <TabsList className="bg-secondary/50 border border-border/50 p-1">
                <TabsTrigger value="overview" className="px-6 data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md transition-all">Overview</TabsTrigger>
                <TabsTrigger value="insights" className="px-6 data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md transition-all">Model Insights</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-8 animate-in fade-in-50 duration-500">
              {/* KPIs */}
              <KPICards />

              {/* Insights Panel */}
              <KeyRiskInsights />

              {/* Simulation */}
              <SimulationPanel />

              {/* Charts + Top Risk */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2">
                  <RiskCharts />
                </div>
                <div>
                  <TopAtRiskStudents />
                </div>
              </div>

              {/* Table */}
              <StudentTable />
            </TabsContent>

            <TabsContent value="insights" className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="glass-card p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[400px]">
                <Activity className="w-12 h-12 mb-4 text-muted-foreground/50" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Model Insights</h2>
                <p>Advanced predictive analytics and risk factors will be displayed here.</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="text-center py-4 text-xs text-muted-foreground">
            Student Retention Risk Scoring Model · Powered by Machine Learning
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;