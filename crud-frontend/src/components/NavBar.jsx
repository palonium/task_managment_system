import React from 'react';

function NavBar({ onSearch, onChangePassword, onLogout, onOpen }) {
  
  // Обработка поиска
  const handleSearch = (event) => {
    onSearch(event.target.value);
  };

  return (
    <div className="navbar bg-base-100 px-4">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Task Management System</a>
      </div>
      <div className="flex-none gap-2">

        <div className="form-control">
          <input
            type="text"
            placeholder="Поиск..."
            className="input input-bordered w-24 md:w-auto"
            onChange={handleSearch}
          />
        </div>


        <button className="btn btn-primary" onClick={onOpen}>
          Добавить задачу
        </button>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User avatar"
                src="https://cdn.unifr.ch/images/placeholder/people_1200x1200.png"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow z-[1]">
            <li className="mb-2">
              <button className="btn btn-secondary w-full"
                onClick={onChangePassword}>Сменить пароль</button>
            </li>
            <li>
              <button
                className="btn btn-error w-full"
                onClick={onLogout}>
                Выйти
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavBar;