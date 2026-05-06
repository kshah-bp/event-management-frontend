"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  fetchEvents,
  updateEvent,
  deleteEvent,
  createEvent,
} from "@/features/events/eventsSlice";
import type { RootState } from "@/store";
import { Loader } from "@/components/ui/loader";
import { StatusBadge } from "@/components/ui/status-badge";
import { Edit, Trash2, MapPin, Users, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminEventsPage() {
  const dispatch = useDispatch();
  const events = useSelector((s: RootState) => s.events.items);
  const loading = useSelector((s: RootState) => s.events.loading);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    dispatch(fetchEvents() as any);
  }, [dispatch]);

  const eventSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    location: Yup.string().required("Location is required"),
    date: Yup.string().required("Date is required"),
    fromTime: Yup.string().required("From time is required"),
    toTime: Yup.string().required("To time is required"),
    price: Yup.number()
      .min(0, "Price must be non-negative")
      .required("Price is required"),
    capacity: Yup.number()
      .min(1, "Capacity must be at least 1")
      .required("Capacity is required"),
  });

  const createFormik = useFormik({
    initialValues: {
      title: "",
      description: "",
      location: "",
      date: "",
      fromTime: "",
      toTime: "",
      price: 0,
      capacity: 0,
    },
    validationSchema: eventSchema,
    onSubmit: async (values) => {
      try {
        const eventData = {
          title: values.title,
          description: values.description,
          location: values.location,
          date: new Date(values.date).toISOString(),
          fromTime: new Date(`${values.date}T${values.fromTime}`).toISOString(),
          toTime: new Date(`${values.date}T${values.toTime}`).toISOString(),
          price: Number(values.price),
          capacity: Number(values.capacity),
        };
        console.log("Creating event with data:", eventData);
        await dispatch(createEvent(eventData) as any);
        setIsModalOpen(false);
        createFormik.resetForm();
      } catch (error) {
        console.error("Failed to create event:", error);
      }
    },
  });

  const editFormik = useFormik({
    initialValues: {
      title: "",
      description: "",
      location: "",
      date: "",
      fromTime: "",
      toTime: "",
      price: 0,
      capacity: 0,
      status: "UPCOMING",
    },
    validationSchema: eventSchema,
    onSubmit: async (values) => {
      if (selectedEvent) {
        const eventData = {
          title: values.title,
          description: values.description,
          location: values.location,
          date: new Date(values.date).toISOString(),
          fromTime: new Date(`${values.date}T${values.fromTime}`).toISOString(),
          toTime: new Date(`${values.date}T${values.toTime}`).toISOString(),
          price: Number(values.price),
          capacity: Number(values.capacity),
        };
        await dispatch(
          updateEvent({ id: selectedEvent.id, data: eventData }) as any,
        );
        setIsModalOpen(false);
      }
    },
  });

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    editFormik.setValues({
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
      fromTime: event.fromTime
        ? new Date(event.fromTime).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "",
      toTime: event.toTime
        ? new Date(event.toTime).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "",
      price: event.price || 0,
      capacity: event.capacity || 0,
      status: event.status,
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedEvent(null);
    createFormik.resetForm();
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (eventToDelete) {
      await dispatch(deleteEvent(eventToDelete) as any);
      setDeleteModalOpen(false);
      setEventToDelete(null);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString();

  const columns = [
    { key: "title", header: "Title" },
    {
      key: "location",
      header: "Location",
      render: (item: any) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {item.location}
        </div>
      ),
    },
    {
      key: "fromTime",
      header: "From",
      render: (item: any) => formatDate(item.fromTime),
    },
    {
      key: "capacity",
      header: "Capacity",
      render: (item: any) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {item.capacity}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: any) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setEventToDelete(item.id);
              setDeleteModalOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filteredEvents = events.filter((e: any) =>
    filterStatus ? e.status === filterStatus : true,
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Event Management</h1>
        <Button onClick={handleCreate}>Create Event</Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search by status..."
              value={filterStatus}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilterStatus(e.target.value)
              }
              className="max-w-xs"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : (
        <Table
          columns={columns}
          data={filteredEvents}
          emptyMessage="No events found"
        />
      )}

      <Modal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setSelectedEvent(null);
        }}
        title={selectedEvent ? "Edit Event" : "Create Event"}
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {selectedEvent ? (
            <form onSubmit={editFormik.handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input {...editFormik.getFieldProps("title")} />
                  {editFormik.touched.title && editFormik.errors.title && (
                    <div className="text-red-500 text-sm">
                      {editFormik.errors.title}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Description</Label>
                  <Input {...editFormik.getFieldProps("description")} />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input {...editFormik.getFieldProps("location")} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input type="date" {...editFormik.getFieldProps("date")} />
                  </div>
                  <div>
                    <Label>From Time</Label>
                    <Input
                      type="time"
                      {...editFormik.getFieldProps("fromTime")}
                    />
                  </div>
                  <div>
                    <Label>To Time</Label>
                    <Input
                      type="time"
                      {...editFormik.getFieldProps("toTime")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      {...editFormik.getFieldProps("price")}
                    />
                  </div>
                  <div>
                    <Label>Capacity</Label>
                    <Input
                      type="number"
                      {...editFormik.getFieldProps("capacity")}
                    />
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <select
                    {...editFormik.getFieldProps("status")}
                    className="w-full p-2 border rounded"
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit">Save</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={createFormik.handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input {...createFormik.getFieldProps("title")} />
                  {createFormik.touched.title && createFormik.errors.title && (
                    <div className="text-red-500 text-sm">
                      {createFormik.errors.title}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Description</Label>
                  <Input {...createFormik.getFieldProps("description")} />
                  {createFormik.touched.description &&
                    createFormik.errors.description && (
                      <div className="text-red-500 text-sm">
                        {createFormik.errors.description}
                      </div>
                    )}
                </div>
                <div>
                  <Label>Location</Label>
                  <Input {...createFormik.getFieldProps("location")} />
                  {createFormik.touched.location &&
                    createFormik.errors.location && (
                      <div className="text-red-500 text-sm">
                        {createFormik.errors.location}
                      </div>
                    )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      {...createFormik.getFieldProps("date")}
                    />
                    {createFormik.touched.date && createFormik.errors.date && (
                      <div className="text-red-500 text-sm">
                        {createFormik.errors.date}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>From Time</Label>
                    <Input
                      type="time"
                      {...createFormik.getFieldProps("fromTime")}
                    />
                    {createFormik.touched.fromTime &&
                      createFormik.errors.fromTime && (
                        <div className="text-red-500 text-sm">
                          {createFormik.errors.fromTime}
                        </div>
                      )}
                  </div>
                  <div>
                    <Label>To Time</Label>
                    <Input
                      type="time"
                      {...createFormik.getFieldProps("toTime")}
                    />
                    {createFormik.touched.toTime &&
                      createFormik.errors.toTime && (
                        <div className="text-red-500 text-sm">
                          {createFormik.errors.toTime}
                        </div>
                      )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      {...createFormik.getFieldProps("price")}
                    />
                    {createFormik.touched.price &&
                      createFormik.errors.price && (
                        <div className="text-red-500 text-sm">
                          {createFormik.errors.price}
                        </div>
                      )}
                  </div>
                  <div>
                    <Label>Capacity</Label>
                    <Input
                      type="number"
                      {...createFormik.getFieldProps("capacity")}
                    />
                    {createFormik.touched.capacity &&
                      createFormik.errors.capacity && (
                        <div className="text-red-500 text-sm">
                          {createFormik.errors.capacity}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit">Create</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      <Modal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Confirm Delete"
      >
        <p className="mb-4">Are you sure you want to delete this event?</p>
        <div className="flex gap-2">
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
