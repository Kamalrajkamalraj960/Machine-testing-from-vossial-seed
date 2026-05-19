const Task = require('../models/Task');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, search, sort } = req.query;
    
    let query = { user: req.user.id };

    // Filtering
    if (status && status !== 'All') {
      query.status = status;
    }

    // Searching
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default to newest first
    if (sort) {
      if (sort === 'dueDateAsc') sortOption = { dueDate: 1 };
      else if (sort === 'dueDateDesc') sortOption = { dueDate: -1 };
      else if (sort === 'createdAtAsc') sortOption = { createdAt: 1 };
      else if (sort === 'createdAtDesc') sortOption = { createdAt: -1 };
      else if (sort === 'status') sortOption = { status: 1 };
    }

    const tasks = await Task.find(query).sort(sortOption);

    // Get Analytics
    const allTasks = await Task.find({ user: req.user.id });
    const analytics = {
      total: allTasks.length,
      completed: allTasks.filter(t => t.status === 'Completed').length,
      pending: allTasks.filter(t => t.status === 'Pending').length,
      inProgress: allTasks.filter(t => t.status === 'In Progress').length,
    };

    res.status(200).json({ tasks, analytics });
  } catch (error) {
    next(error);
  }
};

// @desc    Set task
// @route   POST /api/tasks
// @access  Private
const setTask = async (req, res, next) => {
  try {
    const { title, description, status, dueDate } = req.body;

    if (!title || !description || !dueDate) {
      res.status(400);
      throw new Error('Please add all required fields');
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'Pending',
      dueDate,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Make sure the logged in user matches the task user
    if (task.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Make sure the logged in user matches the task user
    if (task.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  setTask,
  updateTask,
  deleteTask,
};
