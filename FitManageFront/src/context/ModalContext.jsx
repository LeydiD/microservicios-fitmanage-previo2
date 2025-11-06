import React, { createContext, useState, useContext } from "react";
import Modal from "../components/Modal.jsx";

const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalData, setModalData] = useState({
    show: false,
    title: "",
    body: "",
    type: "info",
    onConfirm: null
  });

  const showModal = (title, body, type = "info", onConfirm = null) => {
    setModalData({
      show: true,
      title,
      body,
      type,
      onConfirm
    });
  };

  const closeModal = () => {
    if (modalData.onConfirm && modalData.type === "info") {
      modalData.onConfirm();
    }
    setModalData({ ...modalData, show: false, onConfirm: null });
  };

  const cancelModal = () => {
    setModalData({ ...modalData, show: false, onConfirm: null });
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal, cancelModal }}>
      {children}

      <Modal
        show={modalData.show}
        title={modalData.title}
        body={modalData.body}
        type={modalData.type}
        onClose={closeModal}
        onCancel={cancelModal}
      />
    </ModalContext.Provider>
  );
};

export default ModalProvider;
