"use client"
import React, { useState } from 'react'

const OutputTextbar = ({ jsonData }) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded shadow-lg">
      <pre className="whitespace-pre-wrap">{JSON.stringify(jsonData, null, 2)}</pre>
    </div>
  )
}

const CRUDForm = ({ onCreate, onUpdate }) => {
  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  return (
    <div className="bg-gray-800 text-white p-4 rounded shadow-lg">
      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold" htmlFor="id">ID (update only)</label>
        <input
          type="text"
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold" htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold" htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onCreate(title, description)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create
        </button>
        <button
          onClick={() => onUpdate(id, title, description)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Update
        </button>
        <button
          onClick={() => { setTitle(''); setDescription(''); }}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

const ActionForm = ({ onGet, onDelete, notFoundId }) => {
  const [number, setNumber] = useState('')

  return (
    <div className="bg-gray-800 text-white p-4 rounded shadow-lg">
      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold" htmlFor="number">Number</label>
        <input
          id="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onGet(number)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Get
        </button>
        <button
          onClick={() => onDelete(number)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          DELETE
        </button>
      </div>
      {notFoundId !== null && <label className="block mb-2 text-sm font-bold mt-4" htmlFor="id">ID NOT FOUND {notFoundId}</label>}
    </div>
  )
}

const GetAllButton = ({ onGetAll }) => {
  return (
    <button
      onClick={onGetAll}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Get ALL
    </button>
  )
}

export default function Home() {
  const API = "http://localhost:3000/api/issues"
  const [issues, setIssues] = useState([])
  const [notFoundId, setNotFoundId] = useState(null)

  const fetchIssues = async () => {
    const response = await fetch(`${API}`)
    const data = await response.json()
    setIssues(data)
    setNotFoundId(null)
  }

  const createIssue = async (title, description) => {
    const response = await fetch(`${API}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })
    if (response.ok) {
      fetchIssues()
    }
  }

  const updateIssue = async (id, title, description) => {
    const use_id = id || 0;
    const response = await fetch(`${API}/${use_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })
    if (response.ok) {
      fetchIssues()
    }
  }

  const deleteIssue = async (id) => {
    const response = await fetch(`${API}/${id}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      fetchIssues()
    } else if (!response.ok && response.status === 404) {
      setNotFoundId(id)
    }
  }

  const getIssue = async (id) => {
    const response = await fetch(`${API}/${id}`)
    const data = await response.json()
    setIssues([data])
    if (!response.ok && response.status === 404) {
      setNotFoundId(id)
    }
  }

  return (
    <main className="bg-gray-900 flex min-h-screen flex-col items-center justify-around gap-30 p-24">
      <h1 className="text-2xl text-white">Issue Tracker</h1>

      <div className="flex flex-row items-center justify-around space-y-4">
        <OutputTextbar jsonData={issues} />
        <div className="flex flex-col justify-between gap-10">
          <CRUDForm
            onCreate={createIssue}
            onUpdate={updateIssue}
          />
          <ActionForm
            onGet={getIssue}
            onDelete={deleteIssue}
            notFoundId={notFoundId}
          />
          <GetAllButton onGetAll={fetchIssues} />
        </div>
      </div>
    </main>
  )
}
