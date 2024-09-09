"use client";
import React, { useEffect, useState } from "react";

export default function Home2() {
    const [data, setData] = useState({ hotelList: [] });
    const [selected, setSelected] = useState(new Set());

    useEffect(() => {
        fetch('http://localhost:8080/restaurant/findAll')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setData({ hotelList: data });
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }, []);

    const handleCheckboxChange = (index) => {
        setSelected(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(index)) {
                newSelected.delete(index);
            } else {
                newSelected.add(index);
            }
            return newSelected;
        });
    };

    const handleDelete = () => {
        // Implement the delete functionality here
        const selectedItems = Array.from(selected);
        if (selectedItems.length > 0) {
            
            // Perform delete operation
            console.log('Deleting items:', selectedItems);
        } else {
            alert('No items selected for deletion.');
        }
    };

    const handleUpdate = () => {
        const selectedItems = Array.from(selected);
        if (selectedItems.length === 1) {
            const itemId = selectedItems[0];
            window.location.href = `/restaurant/update/${data.hotelList[itemId].id}`;
        } else if (selectedItems.length > 1) {
            alert('Please select exactly one item for updating.');
        } else {
            alert('No items selected for update.');
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-6">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
                <div className="mb-4 flex space-x-4">
                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                        onClick={handleDelete}
                    >
                        Delete Selected
                    </button>
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onClick={handleUpdate}
                    >
                        Update Selected
                    </button>
                    <button
                        className=" bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onClick={() => {
                            alert('Insert page로 이동합니다');
                            window.location.href = "/restaurant/register";
                        }}
                    >
                        Go Save
                    </button>
                </div>
                <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-blue-600 text-white">
                            <th className="py-3 px-4 border-b">
                                <input
                                    type="checkbox"
                                    checked={selected.size === data.hotelList.length}
                                    onChange={() => {
                                        if (selected.size === data.hotelList.length) {
                                            setSelected(new Set());
                                        } else {
                                            setSelected(new Set(data.hotelList.map((_, index) => index)));
                                        }
                                    }}
                                />
                            </th>
                            <th className="py-3 px-4 border-b">Index</th>
                            <th className="py-3 px-4 border-b">Name</th>
                            <th className="py-3 px-4 border-b">Tel</th>
                            <th className="py-3 px-4 border-b">Address</th>
                            <th className="py-3 px-4 border-b">OperateDate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.hotelList.map((h, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="py-3 px-4 border-b">
                                    <input
                                        type="checkbox"
                                        checked={selected.has(index)}
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                </td>
                                <td className="py-3 px-4 border-b">{index}</td>
                                <td className="py-3 px-4 border-b">{h.name}</td>
                                <td className="py-3 px-4 border-b">{h.tel}</td>
                                <td className="py-3 px-4 border-b">{h.address}</td>
                                <td className="py-3 px-4 border-b">{h.operateTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
