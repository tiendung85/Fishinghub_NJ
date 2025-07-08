import React, { useEffect, useState } from "react";
import EventCreateForm from "./EventCreateForm";
import { useParams } from "react-router-dom";

export default function EventEditForm() {
    const { id } = useParams();
    const [eventData, setEventData] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:9999/events/${id}`)
            .then(res => res.json())
            .then(data => setEventData(data));
    }, [id]);

    if (!eventData) return <div>Đang tải...</div>;

    return <EventCreateForm initialData={eventData} isEdit />;
}