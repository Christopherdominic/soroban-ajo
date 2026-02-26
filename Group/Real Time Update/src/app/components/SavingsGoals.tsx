import React, { useState, useEffect } from 'react';
import { useGoals } from '../../hooks/useGoals';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Trash2, Plus, Target, Wallet } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface SavingsGoalsProps {
  userId: string;
}

export const SavingsGoals: React.FC<SavingsGoalsProps> = ({ userId }) => {
  const { goals, loading, createGoal, deleteGoal } = useGoals(userId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    category: 'EMERGENCY',
    description: ''
  });

  useEffect(() => {
    goals.forEach(goal => {
      const percent = Number(goal.targetAmount) > 0 
              ? (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100 
              : 0;
      if (percent >= 100 && goal.status !== 'COMPLETED') {
         toast.success(`Congratulations! You reached your goal: ${goal.title}`, {
             description: "You are a Goal Crusher!",
             duration: 5000,
         });
      }
    });
  }, [goals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGoal({
        title: newGoal.title,
        targetAmount: newGoal.targetAmount,
        deadline: newGoal.deadline,
        category: newGoal.category,
        description: newGoal.description,
        isPublic: false
      });
      setIsDialogOpen(false);
      setNewGoal({ title: '', targetAmount: '', deadline: '', category: 'EMERGENCY', description: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const totalTarget = goals.reduce((acc, g) => acc + Number(g.targetAmount), 0);
  const totalSaved = goals.reduce((acc, g) => acc + Number(g.currentAmount), 0);
  const totalProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const chartData = goals.map(g => ({
    name: g.title,
    value: Number(g.currentAmount)
  })).filter(d => d.value > 0);

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Savings Goals</h2>
          <p className="text-muted-foreground">Track your progress and reach your financial milestones.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> New Goal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Savings Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="title">Goal Title</Label>
                <Input 
                  id="title" 
                  value={newGoal.title} 
                  onChange={e => setNewGoal({...newGoal, title: e.target.value})} 
                  placeholder="e.g. New Car" 
                  required 
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="amount">Target Amount ($)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  value={newGoal.targetAmount} 
                  onChange={e => setNewGoal({...newGoal, targetAmount: e.target.value})} 
                  placeholder="5000" 
                  required 
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="deadline">Deadline</Label>
                <Input 
                  id="deadline" 
                  type="date" 
                  value={newGoal.deadline} 
                  onChange={e => setNewGoal({...newGoal, deadline: e.target.value})} 
                  required 
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newGoal.category} 
                  onValueChange={val => setNewGoal({...newGoal, category: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMERGENCY">Emergency Fund</SelectItem>
                    <SelectItem value="VACATION">Vacation</SelectItem>
                    <SelectItem value="EDUCATION">Education</SelectItem>
                    <SelectItem value="HOME">Home Purchase</SelectItem>
                    <SelectItem value="RETIREMENT">Retirement</SelectItem>
                    <SelectItem value="CUSTOM">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit">Create Goal</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>
              You have saved ${totalSaved.toLocaleString()} of your ${totalTarget.toLocaleString()} total goal.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No savings data yet. Start by creating a goal!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest contributions and milestones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for activity feed */}
            <div className="space-y-4">
               {goals.slice(0, 3).map(goal => (
                 <div key={goal.id} className="flex items-center">
                   <div className="ml-4 space-y-1">
                     <p className="text-sm font-medium leading-none">{goal.title}</p>
                     <p className="text-sm text-muted-foreground">
                       Due {new Date(goal.deadline).toLocaleDateString()}
                     </p>
                   </div>
                   <div className="ml-auto font-medium">
                     {Number(goal.currentAmount) / Number(goal.targetAmount) * 100}%
                   </div>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {goals.map((goal) => {
            const percent = Number(goal.targetAmount) > 0 
              ? (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100 
              : 0;
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {goal.title}
                    </CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${Number(goal.currentAmount).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      of ${Number(goal.targetAmount).toLocaleString()} target
                    </p>
                    <Progress value={percent} className="mt-4 h-2" />
                    <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
                      <span>{percent.toFixed(1)}% Complete</span>
                      <Button variant="ghost" size="sm" onClick={() => deleteGoal(goal.id)} className="text-red-500 hover:text-red-700 h-6 w-6 p-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
