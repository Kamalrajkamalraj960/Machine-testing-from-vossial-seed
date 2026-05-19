import React, { useEffect } from 'react';
import useTaskStore from '../store/useTaskStore';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ListTodo, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { analytics, fetchTasks, isLoading } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = [
    {
      title: 'Total Tasks',
      value: analytics.total,
      icon: <ListTodo size={24} className="text-blue-600 dark:text-blue-400" />,
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      border: 'border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Completed',
      value: analytics.completed,
      icon: <CheckCircle2 size={24} className="text-green-600 dark:text-green-400" />,
      bg: 'bg-green-100 dark:bg-green-900/30',
      border: 'border-green-200 dark:border-green-800'
    },
    {
      title: 'In Progress',
      value: analytics.inProgress,
      icon: <Clock size={24} className="text-amber-600 dark:text-amber-400" />,
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      border: 'border-amber-200 dark:border-amber-800'
    },
    {
      title: 'Pending',
      value: analytics.pending,
      icon: <AlertCircle size={24} className="text-red-600 dark:text-red-400" />,
      bg: 'bg-red-100 dark:bg-red-900/30',
      border: 'border-red-200 dark:border-red-800'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-64 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 h-32 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's a summary of your task statistics.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:shadow-md transition-shadow cursor-default`}
          >
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center`}>
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Quick Actions or Recent Tasks can go here */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
         <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Welcome to Taskify!</h2>
         <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Manage your tasks efficiently with our modern, intuitive dashboard. Navigate to the <strong>Tasks</strong> tab on the left to start creating, editing, and organizing your daily workflow.
         </p>
      </div>
    </div>
  );
};

export default Dashboard;
