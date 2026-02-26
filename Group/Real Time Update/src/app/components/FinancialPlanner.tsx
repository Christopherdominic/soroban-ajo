import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const FinancialPlanner: React.FC = () => {
  // Affordability State
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [affordabilityResult, setAffordabilityResult] = useState<any>(null);

  // Projection State
  const [principal, setPrincipal] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(200);
  const [interestRate, setInterestRate] = useState(5);
  const [years, setYears] = useState(10);
  const [projectionData, setProjectionData] = useState<any[]>([]);

  const handleCheckAffordability = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/goals/affordability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyIncome: Number(income),
          monthlyExpenses: Number(expenses),
          goalTarget: Number(goalAmount),
          goalDeadline: goalDate
        })
      });
      const data = await response.json();
      if (data.success) {
        setAffordabilityResult(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCalculateProjection = async () => {
    // Generate data points for the chart locally for smoother interaction, 
    // or fetch detailed breakdown if backend supports it.
    // Here we simulate the projection based on the formula to show a graph immediately.
    
    const data = [];
    let currentBalance = principal;
    const r = interestRate / 100 / 12;
    const n = years * 12;

    for (let i = 0; i <= n; i++) {
      if (i % 12 === 0) { // Record yearly data points
        data.push({
          year: `Year ${i / 12}`,
          amount: Math.round(currentBalance),
          invested: Math.round(principal + (monthlyContribution * i))
        });
      }
      currentBalance = (currentBalance * (1 + r)) + monthlyContribution;
    }
    setProjectionData(data);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Financial Intelligence Hub</h2>
        <p className="text-muted-foreground">Plan your future with smart calculators and insights.</p>
      </div>

      <Tabs defaultValue="affordability" className="space-y-4">
        <TabsList>
          <TabsTrigger value="affordability">Affordability Checker</TabsTrigger>
          <TabsTrigger value="projection">Growth Projection</TabsTrigger>
        </TabsList>

        <TabsContent value="affordability">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Can I afford this goal?</CardTitle>
                <CardDescription>Analyze your income and expenses to see if your goal is realistic.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckAffordability} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="income">Monthly Income ($)</Label>
                    <Input id="income" type="number" value={income} onChange={e => setIncome(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expenses">Monthly Expenses ($)</Label>
                    <Input id="expenses" type="number" value={expenses} onChange={e => setExpenses(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="target">Goal Target ($)</Label>
                    <Input id="target" type="number" value={goalAmount} onChange={e => setGoalAmount(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Target Date</Label>
                    <Input id="date" type="date" value={goalDate} onChange={e => setGoalDate(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full">Analyze</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analysis Result</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-[300px]">
                {affordabilityResult ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-4"
                  >
                    <div className={`text-4xl font-bold ${
                      affordabilityResult.status === 'Sustainable' ? 'text-green-500' : 
                      affordabilityResult.status === 'Aggressive' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {affordabilityResult.status}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      You need to save <strong>${Math.round(affordabilityResult.requiredMonthlySavings)}</strong>/month.
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Your disposable income is <strong>${affordabilityResult.disposableIncome}</strong>.
                    </div>
                    <Progress 
                      value={Math.min(100, (affordabilityResult.requiredMonthlySavings / affordabilityResult.disposableIncome) * 100)} 
                      className={`h-4 ${
                        affordabilityResult.status === 'Sustainable' ? 'bg-green-100' : 'bg-red-100'
                      }`}
                    />
                  </motion.div>
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center">
                    <Calculator className="h-12 w-12 mb-2 opacity-20" />
                    Enter your details to see the analysis.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projection">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Compound Interest Calculator</CardTitle>
                <CardDescription>See how your savings grow over time.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Initial Deposit: ${principal}</Label>
                  <Slider value={[principal]} min={0} max={10000} step={100} onValueChange={(vals) => setPrincipal(vals[0])} />
                </div>
                <div className="space-y-2">
                  <Label>Monthly Contribution: ${monthlyContribution}</Label>
                  <Slider value={[monthlyContribution]} min={0} max={2000} step={50} onValueChange={(vals) => setMonthlyContribution(vals[0])} />
                </div>
                <div className="space-y-2">
                  <Label>Interest Rate: {interestRate}%</Label>
                  <Slider value={[interestRate]} min={1} max={15} step={0.5} onValueChange={(vals) => setInterestRate(vals[0])} />
                </div>
                <div className="space-y-2">
                  <Label>Time Period: {years} Years</Label>
                  <Slider value={[years]} min={1} max={30} step={1} onValueChange={(vals) => setYears(vals[0])} />
                </div>
                <Button onClick={handleCalculateProjection} className="w-full mt-4">Calculate Projection</Button>
              </CardContent>
            </Card>

            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Projected Growth</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                {projectionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Total Balance" strokeWidth={2} />
                      <Line type="monotone" dataKey="invested" stroke="#82ca9d" name="Principal Invested" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mb-2 opacity-20" />
                    Adjust parameters and calculate to view projection.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
