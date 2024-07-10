import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Container, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import CalendarPage from "../CalendarPage";
import './CalendarPage.css';

function DashboardHeader({ onAddNewCoach }) {
  return (
    <div className="dashboard-header">
      <h1 className="mt-5">Table of coaches</h1>
      <Button
        variant="info"
        onClick={onAddNewCoach}
        style={{ margin: "10px" }}
      >
        <FontAwesomeIcon icon={faPlus} /> Add New Coach
      </Button>
    </div>
  );
}

function CoachTable({ coaches, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <Table striped bordered hover responsive className="calendar table">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coaches.map((coach, index) => (
            <tr key={coach._id}>
              <td>{index + 1}</td>
              <td>{coach.firstName}</td>
              <td>{coach.lastName}</td>
              <td>{coach.email}</td>
              <td>{coach.phoneNumber}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => onEdit(coach)}
                  className="mr-2"
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </Button>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => onDelete(coach)}
                  className="mr-2"
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function AddCoachModal({ show, handleClose, handleSave, newCoach, setNewCoach }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faPlus} /> Add New Coach
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formCoachFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              value={newCoach.firstName}
              onChange={(e) => setNewCoach({ ...newCoach, firstName: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formCoachLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={newCoach.lastName}
              onChange={(e) => setNewCoach({ ...newCoach, lastName: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formCoachEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={newCoach.email}
              onChange={(e) => setNewCoach({ ...newCoach, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formCoachPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              value={newCoach.phoneNumber}
              onChange={(e) => setNewCoach({ ...newCoach, phoneNumber: e.target.value })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} /> Cancel
        </Button>
        <Button variant="info" onClick={handleSave}>
          <FontAwesomeIcon icon={faPlus} /> Add Coach
          </Button>
      </Modal.Footer>
    </Modal>
  );
}

function EditCoachModal({ show, handleClose, handleSave, selectedCoach, setSelectedCoach }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faEdit} /> Edit Coach: {selectedCoach?.firstName} {selectedCoach?.lastName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formCoachFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              value={selectedCoach?.firstName || ''}
              onChange={(e) => setSelectedCoach({ ...selectedCoach, firstName: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formCoachLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={selectedCoach?.lastName || ''}
              onChange={(e) => setSelectedCoach({ ...selectedCoach, lastName: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formCoachEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={selectedCoach?.email || ''}
              onChange={(e) => setSelectedCoach({ ...selectedCoach, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formCoachPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              value={selectedCoach?.phoneNumber || ''}
              onChange={(e) => setSelectedCoach({ ...selectedCoach, phoneNumber: e.target.value })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} /> Cancel
        </Button>
        <Button variant="info" onClick={handleSave}>
          <FontAwesomeIcon icon={faEdit} /> Update Coach
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function ConfirmActionModal({ show, handleClose, handleConfirm, action, coach }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={action === "delete" ? faTrash : action === "add" ? faPlus : faEdit} /> Confirm {action === "delete" ? "Delete" : action === "add" ? "Add" : "Update"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {action === "delete" ? (
          <p>Are you sure you want to delete the coach: {coach?.firstName} {coach?.lastName}?</p>
        ) : action === "add" ? (
          <p>Are you sure you want to add this new coach?</p>
        ) : (
          <p>Are you sure you want to update the coach: {coach?.firstName} {coach?.lastName}?</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} /> Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          <FontAwesomeIcon icon={action === "delete" ? faTrash : action === "add" ? faPlus : faEdit} /> {action === "delete" ? "Delete" : action === "add" ? "Add" : "Update"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function Dashboard() {
  const [coaches, setCoaches] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newCoach, setNewCoach] = useState({ firstName: "", lastName: "", email: "", phoneNumber: "" });
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [actionType, setActionType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      const response = await axios.get("http://localhost:3001/coaches/all");
      setCoaches(response.data.coaches);
    } catch (error) {
      console.error("Error fetching coaches:", error);
    }
  };

  const handleAddCoach = async () => {
    try {
      await axios.post("http://localhost:3001/coaches/create", newCoach);
      fetchCoaches();
      setShowAddModal(false);
      setShowConfirmModal(false);
      setNewCoach({ firstName: "", lastName: "", email: "", phoneNumber: "" });
    } catch (error) {
      console.error("Error adding coach:", error);
    }
  };

  const handleEditCoach = async () => {
    try {
      await axios.put(`http://localhost:3001/coaches/${selectedCoach._id}`, selectedCoach);
      fetchCoaches();
      setShowEditModal(false);
      setShowConfirmModal(false);
      setSelectedCoach(null);
    } catch (error) {
      console.error("Error updating coach:", error);
    }
  };

  const handleEditButtonClick = (coach) => {
    setSelectedCoach(coach);
    setShowEditModal(true);
  };

  const handleDeleteCoach = async () => {
    try {
      await axios.delete(`http://localhost:3001/coaches/${selectedCoach._id}`);
      fetchCoaches();
      setShowConfirmModal(false);
      setSelectedCoach(null);
    } catch (error) {
      console.error("Error deleting coach:", error);
    }
  };

  const handleDeleteButtonClick = (coach) => {
    setSelectedCoach(coach);
    setActionType("delete");
    setShowConfirmModal(true);
  };

  const handleAddButtonClick = () => {
    setActionType("add");
    setShowConfirmModal(true);
  };

  const handleEditSaveClick = () => {
    setActionType("edit");
    setShowConfirmModal(true);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCoaches = coaches.filter((coach) =>
    `${coach.firstName} ${coach.lastName} ${coach.email} ${coach.phoneNumber}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="wrapper">
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Container fluid>
            <DashboardHeader onAddNewCoach={() => setShowAddModal(true)} />
            <div className="search-bar my-3">
              <Form.Control
                type="text"
                placeholder="Search... (by name, email, or phone)"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <CoachTable
              coaches={filteredCoaches}
              onEdit={handleEditButtonClick}
              onDelete={handleDeleteButtonClick}
            />
            <AddCoachModal
              show={showAddModal}
              handleClose={() => setShowAddModal(false)}
              handleSave={handleAddButtonClick}
              newCoach={newCoach}
              setNewCoach={setNewCoach}
            />
            <EditCoachModal
              show={showEditModal}
              handleClose={() => setShowEditModal(false)}
              handleSave={handleEditSaveClick}
              selectedCoach={selectedCoach}
              setSelectedCoach={setSelectedCoach}
            />
            <ConfirmActionModal
              show={showConfirmModal}
              handleClose={() => setShowConfirmModal(false)}
              handleConfirm={
                actionType === "delete"
                  ? handleDeleteCoach
                  : actionType === "add"
                  ? handleAddCoach
                  : handleEditCoach
              }
              action={actionType}
              coach={selectedCoach}
            />
            <CalendarPage />
          </Container>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


