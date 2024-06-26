import React, { useEffect } from "react";
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { v4 as uuid } from "uuid";
import { DragDropContext } from "react-beautiful-dnd";
import List from "./components/List";
import Alert from "./components/Alert";
import { useGlobalContext } from "./components/Context";
import Colors from "./components/Colors";
import DarkModeToggle from "./components/DarkModeToggle";

const App = () => {
  const {
    inputRef,
    tasks = [],
    setTasks,
    alert = { show: false, msg: "" }, 
    showAlert,
    isEditing,
    setIsEditing,
    editId,
    setEditId,
    name,
    setName,
    filter,
    setFilter,
    isColorsOpen,
    setIsColorsOpen,
  } = useGlobalContext() || {}; // Ensure context values are not null

  const addTask = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "Invalid Task Name!");
    } else if (name && isEditing) {
      setTasks(
        tasks.map((task) => {
          return task.id === editId ? { ...task, name: name } : task;
        })
      );
      setIsEditing(false);
      setEditId(null);
      setName("");
      showAlert(true, "Task Edited.");
    } else {
      const newTask = {
        id: uuid().slice(0, 8),
        name: name,
        completed: false,
        color: "#009688",
      };
      setTasks([...tasks, newTask]);
      showAlert(true, "Task Added.");
      setName("");
    }
  };

  const filterTasks = (e) => {
    setFilter(e.target.dataset["filter"]);
  };

  const deleteAll = () => {
    setTasks([]);
    showAlert(true, "Your list is clear!");
  };

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus();
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [inputRef, tasks]);

  const handleDragEnd = (param) => {
    const srcI = param.source.index;
    const desI = param.destination?.index;
    if (desI !== undefined) {
      const reOrdered = [...tasks];
      reOrdered.splice(desI, 0, reOrdered.splice(srcI, 1)[0]);
      setTasks(reOrdered);
    }
  };

  const hideColorsContainer = (e) => {
    if (e.target.classList.contains("btn-colors")) return;
    setIsColorsOpen(false);
  };

  return (
    <>
      <div className='container' onClick={hideColorsContainer}>
        {isColorsOpen && <Colors />}
        {alert.show && <Alert msg={alert.msg} />}
        <form className='head' onSubmit={addTask}>
          <input
            type='text'
            ref={inputRef}
            placeholder='New Task'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type='submit'>{isEditing ? "Edit" : "Add"}</button>
        </form>
        <div className='filter'>
          <button
            data-filter='all'
            className={filter === "all" ? "active" : ""}
            onClick={filterTasks}
          >
            All
          </button>
          <button
            data-filter='completed'
            className={filter === "completed" ? "active" : ""}
            onClick={filterTasks}
          >
            Completed
          </button>
          <button
            data-filter='uncompleted'
            className={filter === "uncompleted" ? "active" : ""}
            onClick={filterTasks}
          >
            Uncompleted
          </button>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          {tasks.length > 0 ? (
            <List />
          ) : (
            <p className='no-tasks'>Your list is clear!</p>
          )}
        </DragDropContext>

        {tasks.length > 2 && (
          <button
            className='btn-delete-all'
            onClick={deleteAll}
            title='Delete All Tasks (Completed and Uncompleted)!'
          >
            Clear All
          </button>
        )}
        <DarkModeToggle />
      </div>
      <div className="footer">
        <a href='https://github.com/Sekhar2004' target='_blank' rel="noopener noreferrer"><FaGithub className='github' /></a>
        <a href='https://linkedin.com/in/sekhar-reddy-jeeru' target='_blank' rel="noopener noreferrer"><FaLinkedin className='github' /></a>
      </div>
    </>
  );
};

export default App;
