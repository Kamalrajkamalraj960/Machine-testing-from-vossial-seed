import React, { useEffect, useState, useCallback } from 'react';
import useTaskStore from '../store/useTaskStore';
import { Plus, Search, Filter, Trash2, Edit2, Clock, Calendar } from 'lucide-react';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const Tasks = () => {
  const { tasks, fetchTasks, deleteTask, isLoading } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAtDesc');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const loadTasks = useCallback(() => {
    fetchTasks({
      search: debouncedSearchTerm,
      status: statusFilter,
      sort: sortBy
    });
  }, [debouncedSearchTerm, statusFilter, sortBy, fetchTasks]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const success = await deleteTask(id);
      if (success) toast.success('Task deleted successfully');
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'In Progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      'Completed': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Manage and organize your workload.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex items-center min-w-[140px]">
            <Filter className="absolute left-3 text-slate-400" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white appearance-none"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-auto px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          >
            <option value="createdAtDesc">Newest First</option>
            <option value="createdAtAsc">Oldest First</option>
            <option value="dueDateAsc">Due Date (Earliest)</option>
            <option value="dueDateDesc">Due Date (Latest)</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 h-48 animate-pulse border border-slate-200 dark:border-slate-700" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
            <Search className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No tasks found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm">
            {searchTerm || statusFilter !== 'All' 
              ? "We couldn't find any tasks matching your current filters. Try adjusting them." 
              : "You don't have any tasks yet. Create one to get started!"}
          </p>
          {(!searchTerm && statusFilter === 'All') && (
            <button
              onClick={openCreateModal}
              className="mt-6 text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Create your first task
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  {getStatusBadge(task.status)}
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-1">{task.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-1 line-clamp-3">{task.description}</p>
                
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center space-x-1.5">
                    <Calendar size={14} />
                    <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock size={14} />
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {isModalOpen && (
        <TaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          task={editingTask} 
        />
      )}
    </div>
  );
};

export default Tasks;
