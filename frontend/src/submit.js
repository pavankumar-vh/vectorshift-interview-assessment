// submit.js

import { useState } from 'react';
import { useStore } from './store';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const SubmitButton = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            const { nodes, edges } = useStore.getState();
            const response = await fetch(`${API_BASE_URL}/pipelines/parse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!response.ok) {
                throw new Error(`Request failed (${response.status})`);
            }

            const result = await response.json();
            alert(
                `Pipeline summary:\nNodes: ${result.num_nodes}\nEdges: ${result.num_edges}\nDAG: ${result.is_dag ? 'Yes' : 'No'}`
            );
        } catch (error) {
            alert(`Could not submit pipeline. ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <button
            className="submit-button"
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
        >
            {isSubmitting ? 'Submitting...' : 'Submit Pipeline'}
        </button>
    );
};
