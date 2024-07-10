import React, { useState, useEffect, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import "./CalendarPage.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faEdit, faTrash, faFilePdf } from "@fortawesome/free-solid-svg-icons";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [coachName, setCoachName] = useState("");
  const [coachSpecialty, setCoachSpecialty] = useState("");
  const [coachContact, setCoachContact] = useState("");
  const [sportType, setSportType] = useState("");
  const [location, setLocation] = useState("");
  const calendarRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fetchedCoaches, setFetchedCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmUpdateModal, setShowConfirmUpdateModal] = useState(false);
  const eventColors = ["#3174ad", "#e74c3c", "#2ecc71", "#9b59b6", "#f1c40f"];
  const colorMap = useRef({}); // To store assigned colors for coaches

  useEffect(() => {
    fetchTasks();
    // Set interval fetching for coaches
    const intervalId = setInterval(() => {
      fetchCoaches();
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchCoaches = async () => {
    try {
      const response = await fetch("http://localhost:3001/coaches/all");
      const data = await response.json();
      const coachesList = data.coaches.map((coach) => {
        const coachName = `${coach.firstName} ${coach.lastName}`;
        if (!colorMap.current[coachName]) {
          // Assign a color from predefined eventColors if not already assigned
          colorMap.current[coachName] = generateColor();
        }
        return {
          id: coach._id,
          name: coachName,
          color: colorMap.current[coachName],
        };
      });
      setFetchedCoaches(coachesList);
    } catch (error) {
      console.error("Failed to fetch coaches:", error);
    }
  };

  const generateColor = () => {
    const index = Math.floor(Math.random() * eventColors.length);
    return eventColors[index];
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3001/tasks/all");
      const data = await response.json();
      const tasks = data.tasks.map((task) => ({
        id: task._id,
        title: `${task.coach} - ${task.typeSport}`,
        start: new Date(task.startTime),
        end: new Date(task.endTime),
        coachSpecialty: task.specialty,
        coachContact: task.contacts,
        location: task.location,
        bgColor: colorMap.current[task.coach] || "#3174ad",
      }));
      setEvents(tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchedCoaches]);

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    setShowModal(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setCoachName(event.title.split(" - ")[0]);
    setSportType(event.title.split(" - ")[1]);
    setCoachSpecialty(event.coachSpecialty);
    setCoachContact(event.coachContact);
    setLocation(event.location);
    setShowDetailModal(true);
  };

  const handleAddCoach = async () => {
    if (
      !coachName ||
      !coachSpecialty ||
      !coachContact ||
      !sportType ||
      !location
    ) {
      console.error("All fields must be filled");
      return;
    }

    setLoading(true);

    const newTask = {
      coach: coachName,
      specialty: coachSpecialty,
      contacts: coachContact,
      typeSport: sportType,
      location,
      startTime: selectedSlot.start,
      endTime: selectedSlot.end,
    };

    try {
      const response = await fetch("http://localhost:3001/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const savedTask = await response.json();
        setEvents([
          ...events,
          {
            id: savedTask.task._id,
            title: `${coachName} - ${sportType}`,
            start: new Date(savedTask.task.startTime),
            end: new Date(savedTask.task.endTime),
            coachSpecialty,
            coachContact,
            location,
            bgColor: colorMap.current[coachName] || generateColor(),
          },
        ]);
        setShowModal(false);
        setCoachName("");
        setCoachSpecialty("");
        setCoachContact("");
        setSportType("");
        setLocation("");
      } else {
        console.error("Failed to create task:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCoach = async () => {
    if (
      !coachName ||
      !coachSpecialty ||
      !coachContact ||
      !sportType ||
      !location
    ) {
      console.error("All fields must be filled");
      return;
    }

    const updatedTask = {
      coach: coachName,
      specialty: coachSpecialty,
      contacts: coachContact,
      typeSport: sportType,
      location,
      startTime: selectedEvent.start,
      endTime: selectedEvent.end,
    };

    try {
      const response = await fetch(
        `http://localhost:3001/tasks/${selectedEvent.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        }
      );

      if (response.ok) {
        setEvents(
          events.map((event) =>
            event.id === selectedEvent.id
              ? {
                  ...event,
                  title: `${coachName} - ${sportType}`,
                  coachSpecialty,
                  coachContact,
                  location,
                  bgColor: colorMap.current[coachName] || generateColor(),
                }
              : event
          )
        );
        setShowEditModal(false);
        setShowConfirmUpdateModal(false);
        setCoachName("");
        setCoachSpecialty("");
        setCoachContact("");
        setSportType("");
        setLocation("");
      } else {
        console.error("Failed to update task:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteCoach = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/tasks/${selectedEvent.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setEvents(events.filter((event) => event.id !== selectedEvent.id));
        setShowDetailModal(false);
        setShowDeleteModal(false);
      } else {
        console.error("Failed to delete task:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleExportToPDF = () => {
    if (!calendarRef.current) {
      console.error("Calendar element is not ready.");
      return;
    }

    html2canvas(calendarRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdfHeight = Math.min(imgHeight, pdf.internal.pageSize.getHeight());

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, pdfHeight);
      pdf.save("calendar.pdf");
    });
  };

  return (
    <div>
      <h1>Coach Calendar</h1>
      <Button variant="info" onClick={handleExportToPDF}>
        <FontAwesomeIcon icon={faFilePdf} /> Export to PDF
      </Button>
      <hr />

      <div ref={calendarRef}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 900 }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={(event) => ({
            style: { backgroundColor: event.bgColor },
          })}
        />
      </div>
      <hr />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Coach</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && <Spinner animation="border" />}
          {!loading && (
            <Form>
              <Form.Group>
                <Form.Label>Coach</Form.Label>
                <Form.Control
                  as="select"
                  value={coachName}
                  onChange={(e) => setCoachName(e.target.value)}
                >
                  <option value="">Select Coach</option>
                  {fetchedCoaches.map((coach) => (
                    <option key={coach.id} value={coach.name}>
                      {coach.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Specialty</Form.Label>
                <Form.Control
                  type="text"
                  value={coachSpecialty}
                  onChange={(e) => setCoachSpecialty(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Contact Information</Form.Label>
                <Form.Control
                  type="text"
                  value={coachContact}
                  onChange={(e) => setCoachContact(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Type of Sport</Form.Label>
                <Form.Control
                  type="text"
                  value={sportType}
                  onChange={(e) => setSportType(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Location/Class Number</Form.Label>
                <Form.Control
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="info" onClick={handleAddCoach}>
            Add Coach
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Coach Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              <p>
                <strong>Name:</strong> {selectedEvent.title}
              </p>
              <p>
                <strong>Specialty:</strong> {selectedEvent.coachSpecialty}
              </p>
              <p>
                <strong>Contact:</strong> {selectedEvent.coachContact}
              </p>
              <p>
                <strong>Type of Sport:</strong> {selectedEvent.title.split(" - ")[1]}
              </p>
              <p>
                <strong>Location/Class Number:</strong> {selectedEvent.location}
              </p>
              <p>
                <strong>Start Time:</strong> {moment(selectedEvent.start).format("MMMM Do YYYY, h:mm a")}
              </p>
              <p>
                <strong>End Time:</strong> {moment(selectedEvent.end).format("MMMM Do YYYY, h:mm a")}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Close</Button>
          <Button variant="info" 
            onClick={() => {
              setShowDetailModal(false);
              setShowEditModal(true);
            }}>
            Edit
          </Button>
          <Button variant="danger" 
            onClick={() => {
              setShowDetailModal(false);
              setShowDeleteModal(true);
            }}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Coach</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Coach</Form.Label>
              <Form.Control
                as="select"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
              >
                <option value="">Select Coach</option>
                {fetchedCoaches.map((coach) => (
                  <option key={coach.id} value={coach.name}>
                    {coach.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Specialty</Form.Label>
              <Form.Control
                type="text"
                value={coachSpecialty}
                onChange={(e) => setCoachSpecialty(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Contact Information</Form.Label>
              <Form.Control
                type="text"
                value={coachContact}
                onChange={(e) => setCoachContact(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Type of Sport</Form.Label>
              <Form.Control
                type="text"
                value={sportType}
                onChange={(e) => setSportType(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Location/Class Number</Form.Label>
              <Form.Control
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="info" 
            onClick={() => {
              setShowConfirmUpdateModal(true);
              setShowEditModal(false);
            }}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showConfirmUpdateModal}
        onHide={() => setShowConfirmUpdateModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to update the coach information?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmUpdateModal(false)}>
            Cancel
          </Button>
          <Button variant="info" onClick={handleUpdateCoach}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the coach?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteCoach}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CalendarPage;

