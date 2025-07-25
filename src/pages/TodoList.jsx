import React, { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../utils/api';
import Header from '../components/Header';
import '../styles/TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newTodo, setNewTodo] = useState({ title: '', description: '', dueDate: '' });
  const [editingTodo, setEditingTodo] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', dueDate: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos(user?.id);
      setTodos(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      const data = await createTodo(
        newTodo.title,
        newTodo.description,
        user.id,
        newTodo.dueDate ? newTodo.dueDate : new Date().toISOString().split("T")[0]
      );
      setTodos([...todos, data]);
      setNewTodo({ title: '', description: '', dueDate: '' });
      setShowAddForm(false);
      setSuccess('Todo added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleStartEditing = (todo) => {
    setEditingTodo(todo.id);
    setEditForm({
      title: todo.title,
      description: todo.description || '',
      dueDate: (todo.dueDate || todo.due_date || '').split('T')[0],
    });
  };

  const handleUpdateTodo = async (id) => {
    try {
      const data = await updateTodo(id, editForm);
      setTodos(todos.map((todo) => (todo.id === id ? data : todo)));
      setEditingTodo(null);
      setEditForm({ title: '', description: '', dueDate: '' });
      setSuccess('Todo updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
      setSuccess('Todo deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleComplete = async (todo) => {
    await updateTodo(todo.id, { isCompleted: !todo.isCompleted });
    setTodos(
      todos.map((t) =>
        t.id === todo.id ? { ...t, isCompleted: !t.isCompleted } : t
      )
    );
  };

  // Function to get due date color
  const getDueDateColor = (dueDateString) => {
    if (!dueDateString) return '#666';
    const today = new Date();
    const dueDate = new Date(dueDateString);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return 'red';        // overdue
    if (diffDays > 2) return 'green';     // less than or equal to 2 days
    if (diffDays <= 2) return 'orange';     // more than 2 days
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <div className="main-content">
          <div className="container">
            <div className="loading">Loading your todos...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <div className="main-content">
        <div className="container">
          <div className="todos-header">
            <h1>{`Hello, ${user?.firstName ?? 'user'}`}</h1>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel' : 'Add Todo'}
            </button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {showAddForm && (
            <div className="todo-form">
              <h3>Add New Todo</h3>
              <form onSubmit={handleAddTodo}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Todo title"
                    value={newTodo.title}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    className="form-input"
                    placeholder="Description (optional)"
                    rows="3"
                    value={newTodo.description}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, description: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <input
                    type="date"
                    className="form-input"
                    value={newTodo.dueDate}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, dueDate: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-success">
                    Add Todo
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="todos-grid">
            {todos.length === 0 ? (
              <div className="empty-state">
                <h3>No todos yet!</h3>
                <p>Click "Add Todo" to create your first task.</p>
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`todo-card ${todo.isCompleted ? 'completed' : ''}`}
                  style={{
                    borderLeftColor: `${
                      todo.isCompleted
                        ? '#666' // same as description color for completed tasks
                        : getDueDateColor(todo.dueDate || todo.due_date)
                    } `
                  }}
                >
                  <div className="todo-content">
                    <h3 className="todo-title">{todo?.title}</h3>
                    {todo.description && (
                      <p className="todo-description">{todo?.description}</p>
                    )}
                    {(todo?.dueDate || todo?.due_date) && (
                      <p
                        className="todo-due-date"
                        style={{
                          color: todo?.isCompleted
                            ? '#666'
                            : getDueDateColor(todo?.dueDate || todo?.due_date)
                        }}
                      >
                        Due: {new Date(todo?.dueDate || todo?.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="todo-actions">
                    <button
                      className={`btn ${todo.isCompleted ? 'btn-secondary' : 'btn-success'}`}
                      onClick={() => handleToggleComplete(todo)}
                    >
                      {todo.isCompleted ? 'Undo' : 'Complete'}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleStartEditing(todo)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTodo && (
        <div
          className="edit-modal-overlay"
          onClick={() => {
            setEditingTodo(null);
            setEditForm({ title: '', description: '', dueDate: '' });
          }}
        >
          <div
            className="edit-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Edit Todo</h3>
            <input
              type="text"
              className="form-input"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
            />
            <textarea
              className="form-input"
              rows="3"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
            />
            <input
              type="date"
              className="form-input"
              value={editForm.dueDate}
              onChange={(e) =>
                setEditForm({ ...editForm, dueDate: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
            />
            <div className="form-actions">
              <button
                className="btn btn-success"
                onClick={() => handleUpdateTodo(editingTodo)}
              >
                Update
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditingTodo(null);
                  setEditForm({ title: '', description: '', dueDate: '' });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
