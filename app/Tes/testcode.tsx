'use client'
import React, { useState } from 'react';
interface FormData {
  id: number;
  name: string;
  lastName: string;
  job: string;
}

const AllInOneForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    id: 1,
    name: '',
    lastName: '',
    job: ''
  });

  const [submittedData, setSubmittedData] = useState<FormData[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Check if the submitted name already exists
    const isDuplicate = submittedData.some(data => data.name === formData.name);
  
    // If it's a duplicate, show an alert and return early
    if (isDuplicate) {
      alert('Duplicate entry! Name already exists.');
      return;
    }
  
    if (isEditing && editIndex !== null) {
      const updatedData = [...submittedData];
      updatedData[editIndex] = formData;
      setSubmittedData(updatedData);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setSubmittedData(prevData => [...prevData, { ...formData, id: Date.now() }]);
    }
    setFormData({ id: Date.now(), name: '', lastName: '', job: '' });
  };

  const handleEdit = (index: number) => {
    setIsEditing(true);
    setEditIndex(index);
    setFormData(submittedData[index]);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const updatedData = submittedData.filter((_, i) => i !== index);
      setSubmittedData(updatedData);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-3xl w-full mx-auto p-8 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 dark:text-black">Enter Your Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2 dark:text-black">Name</label>
            <input
              type="text"
              className="border rounded-lg py-2 px-3 w-full  dark:text-black focus:outline-none focus:border-blue-500"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 dark:text-black">Last Name</label>
            <input
              type="text"
              className="border rounded-lg py-2 px-3 w-full focus:outline-none dark:text-black focus:border-blue-500"
              value={formData.lastName}
              onChange={e => handleChange('lastName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 dark:text-black">Job Profession</label>
            <input
              type="text"
              className="border rounded-lg py-2 dark:text-black px-3 w-full focus:outline-none focus:border-blue-500"
              value={formData.job}
              onChange={e => handleChange('job', e.target.value)}
            />
          </div>
          <button
            className={`bg-${isEditing ? 'green' : 'blue'}-500 hover:bg-${isEditing ? 'green' : 'blue'}-600 text-black py-2 px-4 rounded-md mr-2`}
            onClick={handleSubmit}
          >
            {isEditing ? 'Update' : 'Submit'}
          </button>
          {isEditing && (
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
              onClick={() => {
                setIsEditing(false);
                setEditIndex(null);
                setFormData({ id: Date.now(), name: '', lastName: '', job: '' });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      <div className="max-w-3xl mx-auto mt-8">
        <h2 className="text-lg font-semibold mb-4">User Data</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-red">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Last Name</th>
              <th className="border border-gray-300 px-4 py-2">Job</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.map((data, index) => (
              <tr key={data.id}>
                <td className="border border-gray-300 px-4 py-2">{data.name}</td>
                <td className="border border-gray-300 px-4 py-2">{data.lastName}</td>
                <td className="border border-gray-300 px-4 py-2">{data.job}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded-md mr-2"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-md"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllInOneForm;
