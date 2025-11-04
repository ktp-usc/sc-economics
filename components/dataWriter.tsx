import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const AddCustomer = () => {
    const [title, setTitle] = useState("");
    const queryClient = useQueryClient();

    async function AddCustomer() {
        await fetch("/api/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });
        setTitle("");
        await queryClient.invalidateQueries({ queryKey: ["todos"] });
    }

    return (
        <div className="flex gap-2">
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New todo..."
                className="flex-1 border rounded-md p-2"
            />
            <button onClick={AddCustomer} className="bg-blue-600 text-white px-3 rounded-md hover:bg-blue-700">
                Add
            </button>
        </div>
    );
};
export default AddTodo;