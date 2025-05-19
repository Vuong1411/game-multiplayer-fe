import { useState, useEffect } from 'react';
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaUsers, FaUserShield, FaEdit } from 'react-icons/fa';
import { userService, User } from '../../services/userService';
import { AxiosError } from 'axios';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin' as 'admin' | 'user'
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await userService.getUsers();
        setUsers(usersData);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (showModal) {
      if (selectedUser) {
        setFormData({
          username: selectedUser.username,
          email: selectedUser.email,
          password: '',
          role: selectedUser.role
        });
      } else {
        setFormData({
          username: '',
          email: '',
          password: '',
          role: 'admin'
        });
      }
    }
  }, [showModal, selectedUser]);

  const handleSort = (field: keyof User) => {
    if (sortConfig && sortConfig.key === field) {
      setSortConfig({
        key: field,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSortConfig({
        key: field,
        direction: 'asc'
      });
    }
  };

  const getSortIcon = (field: keyof User) => {
    if (sortConfig && sortConfig.key !== field) return <FaSort className="text-gray-400" />;
    return sortConfig && sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const filteredUsers = users
    .filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig) return 0; // Nếu không có cấu hình sắp xếp, giữ nguyên thứ tự

      const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
      const key = sortConfig.key;

      if (key === 'created_at') {
        return multiplier * (new Date(a[key]).getTime() - new Date(b[key]).getTime());
      }
      
      if (key === 'username' || key === 'email' || key === 'role') {
        return multiplier * String(a[key]).localeCompare(String(b[key]));
      }

      return 0;
    });

  const handleRoleChange = async (userId: number, newRole: User['role']) => {
    if (window.confirm(`Bạn có chắc muốn thay đổi vai trò của người dùng này thành ${newRole === 'admin' ? 'Admin' : 'User'}?`)) {
      try {
        await userService.updateUserRole(userId, newRole);
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
      } catch (err) {
        console.error('Error updating user role:', err);
        alert('Không thể cập nhật vai trò người dùng. Vui lòng thử lại sau.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state
    try {
      if (selectedUser) {
        // Chỉ thêm các trường thực sự thay đổi vào updateData
        const updateData: { username?: string; email?: string } = {};
        
        if (formData.username.trim() !== selectedUser.username) {
          updateData.username = formData.username.trim();
        }
        
        if (formData.email.trim() !== selectedUser.email) {
          updateData.email = formData.email.trim();
        }

        // Nếu không có gì thay đổi thì đóng modal
        if (Object.keys(updateData).length === 0) {
          setShowModal(false);
          return;
        }

        try {
          // Sử dụng updateProfile với userId của người dùng được chọn
          const result = await userService.updateProfile(selectedUser.id, updateData);
          
          if (result.success) {
            // Hiển thị thông báo thành công
            alert(result.message || 'Cập nhật thông tin thành công');
            
            // Cập nhật localStorage nếu người dùng đang cập nhật chính họ
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (currentUser.id === selectedUser.id) {
              const updatedUser = { ...currentUser, ...updateData };
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }
          }
          
          setShowModal(false);
          
          // Fetch lại danh sách người dùng để đảm bảo dữ liệu đồng bộ
          const usersData = await userService.getUsers();
          setUsers(usersData);
        } catch (error) {
          console.error('Update error:', error);
          // Hiển thị thông báo lỗi từ server hoặc thông báo mặc định
          if (error instanceof AxiosError && error.response?.data?.message) {
            setError(error.response.data.message);
          } else {
            setError('Không thể cập nhật thông tin người dùng. Vui lòng thử lại sau.');
          }
          return;
        }
      } else {
        // Create new user
        const createData = {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role as 'admin' | 'user'
        };
        await userService.createUser(createData);
        
        // Fetch lại danh sách người dùng sau khi tạo mới
        const usersData = await userService.getUsers();
        setUsers(usersData);
        
        setShowModal(false);
        // Hiển thị thông báo thành công
        alert('Thêm người dùng mới thành công');
      }
    } catch (err: unknown) {
      console.error('Error saving user:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Không thể lưu thông tin người dùng. Vui lòng thử lại sau.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-center text-gray-700 font-semibold">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 mb-4">
              <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Đã xảy ra lỗi</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="w-full mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
            <p className="text-sm text-gray-600">Quản lý và theo dõi tất cả người dùng trong hệ thống</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
            <div className="px-6 py-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 bg-opacity-10 rounded-xl p-3">
                  <FaUsers className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng số người dùng</dt>
                    <dd>
                      <div className="text-2xl font-semibold text-gray-900">{users.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
            <div className="px-6 py-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 bg-opacity-10 rounded-xl p-3">
                  <FaUserShield className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Số lượng Admin</dt>
                    <dd>
                      <div className="text-2xl font-semibold text-gray-900">{users.filter(u => u.role === 'admin').length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="w-full bg-white shadow-sm rounded-xl border border-gray-100 mb-6">
          <div className="px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0 max-w-lg">
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-11 pr-4 py-3 text-sm border-gray-200 rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                onClick={() => {
                  setSelectedUser(null);
                  setShowModal(true);
                }}
              >
                <FaUserShield className="h-4 w-4 mr-2" />
                Thêm Admin
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="flex flex-col w-full">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border border-gray-100 shadow-sm rounded-xl bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => handleSort('username')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Tên người dùng</span>
                          {getSortIcon('username')}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Email</span>
                          {getSortIcon('email')}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => handleSort('role')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Vai trò</span>
                          {getSortIcon('role')}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => handleSort('created_at')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Ngày tạo</span>
                          {getSortIcon('created_at')}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white text-lg font-medium shadow-sm">
                                  {user.username.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                user.role === 'admin'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200`}
                            >
                              <option value="admin">Admin</option>
                              <option value="user">User</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                            >
                              <FaEdit className="mr-1" /> Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <div className="rounded-full bg-gray-100 p-3 mb-4">
                              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-500">
                              {searchTerm ? "Không tìm thấy người dùng nào phù hợp" : "Chưa có người dùng nào"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Edit/Add Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedUser ? 'Chỉnh sửa người dùng' : 'Thêm admin'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                <div>
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
                    Tên người dùng
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-s-md border-gray-300 border-e-0">
                      <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      autoComplete="off"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                      placeholder="johndoe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
                        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="off"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                {!selectedUser && (
                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                          <path d="M14 7h-1.5V4.5a4.5 4.5 0 1 0-9 0V7H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-5 8a1 1 0 1 1-2 0v-3a1 1 0 1 1 2 0v3Zm1.5-8h-5V4.5a2.5 2.5 0 1 1 5 0V7Z"/>
                        </svg>
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={!selectedUser}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900">
                    Vai trò
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-s-md border-gray-300 border-e-0">
                      <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a6.938 6.938 0 0 1-7.964 0A3.984 3.984 0 0 1 9 11h2a3.984 3.984 0 0 1 2.982 2.982ZM10 9a3 3 0 1 1 3-3 3 3 0 0 1-3 3Z"/>
                      </svg>
                    </span>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    {selectedUser ? 'Lưu thay đổi' : 'Thêm'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 